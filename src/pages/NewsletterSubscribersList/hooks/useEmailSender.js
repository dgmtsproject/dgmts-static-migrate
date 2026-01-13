import { useState, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import { sendSubscriberNotification } from '../../../utils/emailService';

export const useEmailSender = (subscribers, groups) => {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailMode, setEmailMode] = useState('rich');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  // Enhanced selection state - supports multiple groups and individual subscribers
  const [emailTargetType, setEmailTargetType] = useState('all'); // 'all', 'groups', 'individuals'
  const [selectedGroupsForEmail, setSelectedGroupsForEmail] = useState(new Set());
  const [selectedIndividualsForEmail, setSelectedIndividualsForEmail] = useState(new Set());
  const [individualSearchTerm, setIndividualSearchTerm] = useState('');

  const handlePdfUpload = async (e, setMessage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'PDF size must be less than 10MB' });
      return;
    }

    setUploadingPdf(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `newsletter-pdfs/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('newsletter-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('newsletter-pdfs')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          setPdfUrl(urlData.publicUrl);
          setPdfFile(file);
          setMessage({ type: 'success', text: 'PDF uploaded successfully!' });
          setUploadingPdf(false);
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setPdfUrl(base64data);
        setPdfFile(file);
        setMessage({ type: 'success', text: 'PDF loaded successfully!' });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setMessage({ type: 'error', text: 'Failed to upload PDF: ' + err.message });
    } finally {
      setUploadingPdf(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfUrl('');
  };

  // Toggle group selection for email
  const toggleGroupForEmail = (groupId) => {
    setSelectedGroupsForEmail(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Toggle individual subscriber for email
  const toggleIndividualForEmail = (subscriberId) => {
    setSelectedIndividualsForEmail(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriberId)) {
        newSet.delete(subscriberId);
      } else {
        newSet.add(subscriberId);
      }
      return newSet;
    });
  };

  // Select all individuals from filtered list
  const selectAllIndividuals = (filteredList) => {
    const allIds = new Set(filteredList.map(sub => sub.id));
    setSelectedIndividualsForEmail(allIds);
  };

  // Clear all individual selections
  const clearIndividualSelections = () => {
    setSelectedIndividualsForEmail(new Set());
  };

  // Get filtered individuals for selection
  const getFilteredIndividualsForEmail = useMemo(() => {
    const searchLower = individualSearchTerm.toLowerCase();
    return subscribers
      .filter(sub => sub.is_active)
      .filter(sub => {
        if (!searchLower) return true;
        return (sub.name?.toLowerCase().includes(searchLower) || 
                sub.email.toLowerCase().includes(searchLower));
      })
      .sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (nameA !== nameB) return nameA.localeCompare(nameB);
        return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
      });
  }, [subscribers, individualSearchTerm]);

  // Calculate target subscribers based on selection type
  const getTargetSubscribers = useMemo(() => {
    const activeSubscribers = subscribers.filter(sub => sub.is_active);
    
    if (emailTargetType === 'all') {
      return activeSubscribers;
    }
    
    if (emailTargetType === 'groups') {
      if (selectedGroupsForEmail.size === 0) return [];
      
      // Collect all subscriber IDs from selected groups
      const memberIds = new Set();
      groups.forEach(group => {
        if (selectedGroupsForEmail.has(group.id)) {
          group.subscriber_group_members?.forEach(m => {
            memberIds.add(m.subscriber_id);
          });
        }
      });
      
      return activeSubscribers.filter(sub => memberIds.has(sub.id));
    }
    
    if (emailTargetType === 'individuals') {
      return activeSubscribers.filter(sub => selectedIndividualsForEmail.has(sub.id));
    }
    
    return [];
  }, [emailTargetType, selectedGroupsForEmail, selectedIndividualsForEmail, subscribers, groups]);

  const targetEmailCount = getTargetSubscribers.length;
  const activeSubscribers = subscribers.filter(s => s.is_active).length;

  // Get summary of target for display
  const getTargetSummary = () => {
    if (emailTargetType === 'all') {
      return `All Active Subscribers (${activeSubscribers})`;
    }
    
    if (emailTargetType === 'groups') {
      const selectedGroups = groups.filter(g => selectedGroupsForEmail.has(g.id));
      if (selectedGroups.length === 0) return 'No groups selected';
      const groupNames = selectedGroups.map(g => g.name).join(', ');
      return `${selectedGroups.length} group(s): ${groupNames} (${targetEmailCount} recipients)`;
    }
    
    if (emailTargetType === 'individuals') {
      if (selectedIndividualsForEmail.size === 0) return 'No individuals selected';
      return `${selectedIndividualsForEmail.size} individual subscriber(s)`;
    }
    
    return '';
  };

  const handleSendEmails = async (setMessage) => {
    const content = emailContent.trim();
    
    if (!content || (emailMode === 'rich' && content === '<p><br></p>')) {
      setMessage({ type: 'error', text: 'Please enter email content' });
      return;
    }

    if (!emailSubject.trim()) {
      setMessage({ type: 'error', text: 'Please enter email subject' });
      return;
    }

    const targetSubscribers = getTargetSubscribers;

    if (targetSubscribers.length === 0) {
      setMessage({ type: 'error', text: 'No active subscribers to send emails to' });
      return;
    }

    setSendingEmails(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: emailConfig, error: configError } = await supabase
        .from('email_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (configError || !emailConfig) {
        throw new Error('Email configuration not found. Please configure email settings first.');
      }

      let successCount = 0;
      let failCount = 0;

      for (const subscriber of targetSubscribers) {
        try {
          const { error: emailError } = await sendSubscriberNotification(
            subscriber.email,
            subscriber.name || 'Subscriber',
            emailSubject.trim(),
            content,
            (emailMode === 'rich' || emailMode === 'html') ? content : null,
            pdfUrl || null,
            pdfFile?.name || null,
            subscriber.token || null
          );

          if (emailError) {
            console.error(`Error sending email to ${subscriber.email}:`, emailError);
            failCount++;
          } else {
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (err) {
          console.error(`Error sending email to ${subscriber.email}:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully sent ${successCount} email(s)${failCount > 0 ? `. ${failCount} failed.` : ''}` 
        });
        setEmailContent('');
        setEmailSubject('');
        // Reset selections after successful send
        setSelectedGroupsForEmail(new Set());
        setSelectedIndividualsForEmail(new Set());
      } else {
        setMessage({ type: 'error', text: 'Failed to send emails to all subscribers' });
      }
    } catch (err) {
      console.error('Error sending emails:', err);
      setMessage({ type: 'error', text: 'Failed to send emails: ' + err.message });
    } finally {
      setSendingEmails(false);
    }
  };

  return {
    emailContent,
    emailSubject,
    sendingEmails,
    emailMode,
    pdfFile,
    pdfUrl,
    uploadingPdf,
    emailTargetType,
    selectedGroupsForEmail,
    selectedIndividualsForEmail,
    individualSearchTerm,
    targetEmailCount,
    activeSubscribers,
    getFilteredIndividualsForEmail,
    getTargetSubscribers,
    setEmailContent,
    setEmailSubject,
    setEmailMode,
    setEmailTargetType,
    setIndividualSearchTerm,
    toggleGroupForEmail,
    toggleIndividualForEmail,
    selectAllIndividuals,
    clearIndividualSelections,
    handlePdfUpload,
    removePdf,
    handleSendEmails,
    getTargetSummary
  };
};
