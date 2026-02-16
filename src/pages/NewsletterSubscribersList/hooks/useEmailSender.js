import { useState, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import { sendSubscriberNotification } from '../../../utils/emailService';

export const useEmailSender = (subscribers, groups) => {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailMode, setEmailMode] = useState('rich');

  // New attachments state (supports multiple file types)
  const [attachments, setAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // Embedded images for CID references
  const [embeddedImages, setEmbeddedImages] = useState([]);

  // Header/footer toggle - off by default
  const [includeHeaderFooter, setIncludeHeaderFooter] = useState(false);

  // Custom header settings (user-friendly fields instead of raw HTML)
  const [customHeader, setCustomHeader] = useState({
    backgroundColor: '#4a90e2',
    heading: '',
    tagline: ''
  });

  // Custom footer settings (user-friendly fields instead of raw HTML)
  const [customFooter, setCustomFooter] = useState({
    footerText: '',
    linkText: '',
    linkUrl: ''
  });

  // Test mode - when enabled, uses secondary email instead of primary
  const [isTestMode, setIsTestMode] = useState(false);

  // Enhanced selection state - supports multiple groups and individual subscribers
  const [emailTargetType, setEmailTargetType] = useState('all'); // 'all', 'groups', 'individuals'
  const [selectedGroupsForEmail, setSelectedGroupsForEmail] = useState(new Set());
  const [selectedIndividualsForEmail, setSelectedIndividualsForEmail] = useState(new Set());
  const [individualSearchTerm, setIndividualSearchTerm] = useState('');

  // Handle attachment upload (supports multiple file types)
  const handleAttachmentUpload = async (e, setMessage) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/zip',
      'application/x-rar-compressed',
      'image/png',
      'image/jpeg',
      'image/gif'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    setUploadingAttachment(true);
    setMessage({ type: '', text: '' });

    try {
      const newAttachments = [];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          setMessage({ type: 'error', text: `File type not allowed: ${file.name}` });
          continue;
        }

        if (file.size > maxSize) {
          setMessage({ type: 'error', text: `File too large (max 10MB): ${file.name}` });
          continue;
        }

        // Try to upload to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `newsletter-attachments/${fileName}`;

        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('newsletter-attachments')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('newsletter-attachments')
              .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
              newAttachments.push({
                name: file.name,
                url: urlData.publicUrl,
                type: file.type,
                size: file.size
              });
              continue;
            }
          }
        } catch (err) {
          console.error('Supabase upload failed, using base64:', err);
        }

        // Fallback to base64
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          name: file.name,
          data: base64,
          type: file.type,
          size: file.size
        });
      }

      if (newAttachments.length > 0) {
        setAttachments(prev => [...prev, ...newAttachments]);
        setMessage({ type: 'success', text: `${newAttachments.length} attachment(s) added successfully!` });
      }
    } catch (err) {
      console.error('Error uploading attachment:', err);
      setMessage({ type: 'error', text: 'Failed to upload attachment: ' + err.message });
    } finally {
      setUploadingAttachment(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle embedded image upload (for CID references)
  const handleEmbeddedImageUpload = async (e, setMessage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    try {
      // Generate unique CID
      const cid = `img_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      // Read as base64 - use this as both data and preview
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      // Use base64 as preview (works in editor and can be replaced with CID when sending)
      setEmbeddedImages(prev => [...prev, {
        cid,
        name: file.name,
        data: base64,
        type: file.type,
        preview: base64  // Use base64 as preview so it can be found and replaced
      }]);

      setMessage({ type: 'success', text: 'Image uploaded! Click "Insert" to add it to your content.' });
    } catch (err) {
      console.error('Error uploading embedded image:', err);
      setMessage({ type: 'error', text: 'Failed to upload image: ' + err.message });
    }

    // Reset input
    e.target.value = '';
  };

  // Remove embedded image
  const removeEmbeddedImage = (index) => {
    setEmbeddedImages(prev => prev.filter((_, i) => i !== index));
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

      // Detect environment - save full domain URL
      const environment = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'unknown';

      // Process HTML content to replace preview URLs with CID references
      // Also extract and convert pasted/inline base64 images
      let processedContent = content;
      const allEmbeddedImages = [...embeddedImages];
      
      if (emailMode === 'rich' || emailMode === 'html') {
        // First, extract all base64 images that were pasted/inserted directly in the editor
        const base64ImageRegex = /<img[^>]+src=["']data:image\/([^;]+);base64,([^"']+)["'][^>]*>/gi;
        let match;
        const extractedImages = [];
        
        while ((match = base64ImageRegex.exec(content)) !== null) {
          const fullImgTag = match[0];
          const imageType = match[1]; // e.g., 'png', 'jpeg'
          const base64Data = match[2];
          const base64Src = `data:image/${imageType};base64,${base64Data}`;
          
          // Check if this image is already in embeddedImages (from upload button)
          const alreadyExists = allEmbeddedImages.some(img => 
            img.preview && img.preview.includes(base64Data.substring(0, 100))
          );
          
          if (!alreadyExists) {
            // Generate unique CID for this pasted image
            const cid = `img_pasted_${Math.random().toString(36).substring(2)}_${Date.now()}_${extractedImages.length}`;
            
            extractedImages.push({
              cid,
              name: `image.${imageType}`,
              data: base64Src,
              type: `image/${imageType}`,
              preview: base64Src
            });
          }
        }
        
        // Add extracted images to the embedded images array
        allEmbeddedImages.push(...extractedImages);
        
        // Now replace all images (both uploaded and pasted) with CID references
        processedContent = content;
        for (const img of allEmbeddedImages) {
          if (img.preview) {
            // For base64 images, use simple string replace to avoid regex issues with long strings
            if (img.preview.startsWith('data:image')) {
              // Use split/join instead of regex for reliable replacement of very long base64 strings
              // Look for the exact data URI in src attributes
              const srcPattern1 = `src="${img.preview}"`;
              const srcPattern2 = `src='${img.preview}'`;
              
              if (processedContent.includes(srcPattern1)) {
                processedContent = processedContent.split(srcPattern1).join(`src="cid:${img.cid}"`);
              }
              if (processedContent.includes(srcPattern2)) {
                processedContent = processedContent.split(srcPattern2).join(`src='cid:${img.cid}'`);
              }
            } else {
              // For other preview URLs (blob:, etc.), simple string replace should work fine
              if (processedContent.includes(img.preview)) {
                processedContent = processedContent.split(img.preview).join(`cid:${img.cid}`);
              }
            }
          }
        }
      }

      // Prepare recipient list
      const recipientEmails = targetSubscribers.map(sub => sub.email);
      const totalPersons = targetSubscribers.length;
      let successCount = 0;
      let failCount = 0;
      const failedEmails = [];
      const failedReasons = [];

      // Batch processing with controlled concurrency (5 emails at a time)
      const BATCH_SIZE = 5;
      const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches
      const DELAY_BETWEEN_SUCCESS = 200; // 200ms delay between successful sends

      // Process emails in batches
      for (let i = 0; i < targetSubscribers.length; i += BATCH_SIZE) {
        const batch = targetSubscribers.slice(i, i + BATCH_SIZE);
        
        // Process batch concurrently
        const batchPromises = batch.map(async (subscriber) => {
          try {
            const { error: emailError } = await sendSubscriberNotification(
              subscriber.email,
              subscriber.name || 'Subscriber',
              emailSubject.trim(),
              content,
              (emailMode === 'rich' || emailMode === 'html') ? processedContent : null,
              attachments.length > 0 ? attachments : null,
              allEmbeddedImages.length > 0 ? allEmbeddedImages : null,
              subscriber.token || null,
              includeHeaderFooter,
              customHeader,
              customFooter,
              isTestMode
            );

            if (emailError) {
              const errorMessage = emailError.message || emailError.details || 'Unknown error';
              failedEmails.push(subscriber.email);
              failedReasons.push(`${subscriber.email}: ${errorMessage}`);
              failCount++;
              return { success: false, email: subscriber.email, error: errorMessage };
            } else {
              successCount++;
              // Small delay after successful send to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_SUCCESS));
              return { success: true, email: subscriber.email };
            }
          } catch (err) {
            const errorMessage = err.message || err.toString() || 'Unknown error';
            failedEmails.push(subscriber.email);
            failedReasons.push(`${subscriber.email}: ${errorMessage}`);
            failCount++;
            console.error(`Error sending email to ${subscriber.email}:`, err);
            return { success: false, email: subscriber.email, error: errorMessage };
          }
        });

        // Wait for all emails in batch to complete
        await Promise.all(batchPromises);

        // Delay between batches to avoid overwhelming the email service
        if (i + BATCH_SIZE < targetSubscribers.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      // Determine overall status
      const status = failCount === 0 ? 'success' : (successCount === 0 ? 'failed' : 'partial');
      
      // Prepare failure reason text (limit to reasonable size for database)
      const failedReasonText = failedReasons.length > 0 
        ? failedReasons.slice(0, 100).join('; ') + (failedReasons.length > 100 ? `; ... and ${failedReasons.length - 100} more failures` : '')
        : null;

      // Log to database
      try {
        const { error: logError } = await supabase
          .from('subscriber_newsletter_email_logs')
          .insert({
            recipients: recipientEmails,
            environment: environment,
            mail_subject: emailSubject.trim(),
            mail_content: (emailMode === 'rich' || emailMode === 'html') ? processedContent : content,
            total_persons: totalPersons,
            succeeded_persons: successCount,
            failed_persons: failCount,
            status: status,
            failed_reason: failedReasonText
          });

        if (logError) {
          console.error('Error logging email send to database:', logError);
        }
      } catch (logErr) {
        console.error('Error logging email send to database:', logErr);
      }

      // Update UI message
      if (successCount > 0) {
        setMessage({
          type: 'success',
          text: `Successfully sent ${successCount} email(s)${failCount > 0 ? `. ${failCount} failed.` : ''}`
        });
        setEmailContent('');
        setEmailSubject('');
        setAttachments([]);
        setEmbeddedImages([]);
        // Reset selections after successful send
        setSelectedGroupsForEmail(new Set());
        setSelectedIndividualsForEmail(new Set());
      } else {
        setMessage({ type: 'error', text: 'Failed to send emails to all subscribers' });
      }
    } catch (err) {
      console.error('Error sending emails:', err);
      setMessage({ type: 'error', text: 'Failed to send emails: ' + err.message });
      
      // Try to log the error to database
      try {
        const environment = typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : 'unknown';
        
        const targetSubscribers = getTargetSubscribers;
        await supabase
          .from('subscriber_newsletter_email_logs')
          .insert({
            recipients: targetSubscribers.map(sub => sub.email),
            environment: environment,
            mail_subject: emailSubject.trim(),
            mail_content: emailContent.trim(),
            total_persons: targetSubscribers.length,
            succeeded_persons: 0,
            failed_persons: targetSubscribers.length,
            status: 'failed',
            failed_reason: `System error: ${err.message || err.toString()}`
          });
      } catch (logErr) {
        console.error('Error logging failure to database:', logErr);
      }
    } finally {
      setSendingEmails(false);
    }
  };

  return {
    emailContent,
    emailSubject,
    sendingEmails,
    emailMode,
    attachments,
    uploadingAttachment,
    embeddedImages,
    includeHeaderFooter,
    customHeader,
    customFooter,
    isTestMode,
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
    setIncludeHeaderFooter,
    setCustomHeader,
    setCustomFooter,
    setIsTestMode,
    toggleGroupForEmail,
    toggleIndividualForEmail,
    selectAllIndividuals,
    clearIndividualSelections,
    handleAttachmentUpload,
    removeAttachment,
    handleEmbeddedImageUpload,
    removeEmbeddedImage,
    handleSendEmails,
    getTargetSummary
  };
};
