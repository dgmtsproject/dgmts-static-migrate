import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff, Upload, FileText, X, UserPlus, Trash2, Users, Plus, Edit2, Check, XCircle, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth';
import './NewsletterSubscribersList.css';

const NewsletterSubscribersList = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false); // Show all by default for admin
  const [subscriberStatuses, setSubscriberStatuses] = useState({}); // Track checkbox states
  const [saving, setSaving] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [emailMode, setEmailMode] = useState('rich'); // 'rich', 'plain', or 'html'
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const quillRef = useRef(null);

  // State for adding new subscriber
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    is_active: true
  });
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // State for delete functionality
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for group management
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [savingGroup, setSavingGroup] = useState(false);
  const [selectedGroupForEmail, setSelectedGroupForEmail] = useState('all');
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [managingGroup, setManagingGroup] = useState(null);
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const [pendingGroupMembers, setPendingGroupMembers] = useState(new Set());
  const [savingGroupMembers, setSavingGroupMembers] = useState(false);

  // State for CSV bulk upload
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvGroupSelection, setCsvGroupSelection] = useState('none');
  const [importingCsv, setImportingCsv] = useState(false);
  const [csvParseError, setCsvParseError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Enhanced ReactQuill modules configuration for professional newsletters
  const quillModules = useMemo(() => {
    // Image handler function
    const imageHandler = () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return

        // Validate file size (max 5MB for email)
        if (file.size > 5 * 1024 * 1024) {
          setMessage({ type: 'error', text: 'Image size must be less than 5MB for email compatibility' })
          return
        }

        try {
          // Get the Quill editor instance from the ref
          const quillEditor = quillRef.current?.getEditor()
          if (!quillEditor) {
            console.error('Quill editor instance not found')
            return
          }

          // Try to upload to Supabase Storage
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
          const filePath = `newsletter-images/${fileName}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('newsletter-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })

          let imageUrl = ''

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('newsletter-images')
              .getPublicUrl(filePath)

            if (urlData?.publicUrl) {
              imageUrl = urlData.publicUrl
            }
          }

          // Fallback to data URL if storage fails
          if (!imageUrl) {
            const reader = new FileReader()
            reader.onloadend = () => {
              imageUrl = reader.result
              const range = quillEditor.getSelection(true)
              quillEditor.insertEmbed(range.index, 'image', imageUrl, 'user')
              quillEditor.setSelection(range.index + 1)
            }
            reader.readAsDataURL(file)
            return
          }

          // Insert the image into the editor
          const range = quillEditor.getSelection(true)
          quillEditor.insertEmbed(range.index, 'image', imageUrl, 'user')
          quillEditor.setSelection(range.index + 1)
          setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        } catch (err) {
          console.error('Error uploading image:', err)
          setMessage({ type: 'error', text: 'Failed to upload image: ' + err.message })
        }
      }
    }

    // Link handler - works like Gmail/MS Word
    const linkHandler = function(value) {
      const quillEditor = quillRef.current?.getEditor()
      if (!quillEditor) return

      const range = quillEditor.getSelection()
      if (!range) return

      if (value) {
        // Get selected text
        const selectedText = quillEditor.getText(range.index, range.length)
        
        // Check if there's already a link at this position
        const format = quillEditor.getFormat(range)
        const existingLink = format.link
        
        if (existingLink) {
          // Edit existing link
          const newUrl = prompt('Edit URL:', existingLink)
          if (newUrl !== null) {
            if (newUrl === '') {
              // Remove link if URL is empty
              quillEditor.format('link', false)
            } else {
              // Update link
              quillEditor.format('link', newUrl)
            }
          }
        } else {
          // Create new link
          if (range.length === 0) {
            // No text selected - prompt for both text and URL
            const linkText = prompt('Enter link text:')
            if (linkText) {
              const url = prompt('Enter URL:')
              if (url) {
                // Insert text and make it a link
                quillEditor.insertText(range.index, linkText, 'link', url)
                quillEditor.setSelection(range.index + linkText.length)
              }
            }
          } else {
            // Text is selected - just ask for URL
            const url = prompt('Enter URL:', 'https://')
            if (url) {
              quillEditor.format('link', url)
            }
          }
        }
      } else {
        // Remove link
        quillEditor.format('link', false)
      }
    }

    // Video handler - supports YouTube, Vimeo URLs and iframe embeds
    const videoHandler = function() {
      const quillEditor = quillRef.current?.getEditor()
      if (!quillEditor) return

      const input = prompt(
        'Enter video URL or paste iframe code:\n\n' +
        '• YouTube URL: https://www.youtube.com/watch?v=...\n' +
        '• Vimeo URL: https://vimeo.com/...\n' +
        '• Or paste full iframe embed code'
      )
      
      if (!input) return

      const range = quillEditor.getSelection(true)
      if (!range) return

      try {
        let videoUrl = input.trim()

        // Check if it's iframe code
        if (videoUrl.includes('<iframe')) {
          // Extract src from iframe
          const srcMatch = videoUrl.match(/src=["']([^"']+)["']/)
          if (srcMatch && srcMatch[1]) {
            videoUrl = srcMatch[1]
          } else {
            setMessage({ type: 'error', text: 'Could not extract video URL from iframe code' })
            return
          }
        }

        // Convert various YouTube formats to embed format
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
          let videoId = ''
          
          if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0].split('&')[0]
          } else if (videoUrl.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(videoUrl.split('?')[1])
            videoId = urlParams.get('v')
          } else if (videoUrl.includes('youtube.com/embed/')) {
            videoId = videoUrl.split('youtube.com/embed/')[1].split('?')[0]
          }
          
          if (videoId) {
            videoUrl = `https://www.youtube.com/embed/${videoId}`
          }
        }
        
        // Convert Vimeo formats to embed format
        if (videoUrl.includes('vimeo.com') && !videoUrl.includes('/video/')) {
          const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0]
          if (videoId && !videoId.includes('player.vimeo.com')) {
            videoUrl = `https://player.vimeo.com/video/${videoId}`
          }
        }

        // Insert video
        quillEditor.insertEmbed(range.index, 'video', videoUrl, 'user')
        quillEditor.insertText(range.index + 1, '\n')
        quillEditor.setSelection(range.index + 2)
        
        setMessage({ type: 'success', text: 'Video embedded successfully!' })
      } catch (err) {
        console.error('Error embedding video:', err)
        setMessage({ type: 'error', text: 'Failed to embed video. Please check the URL or iframe code.' })
      }
    }

    return {
      toolbar: {
        container: [
          [{ 'header': ['1', '2', '3', '4', '5', '6', false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['link', 'image', 'video', 'blockquote', 'code-block'],
          ['clean']
        ],
        handlers: {
          image: imageHandler,
          link: linkHandler,
          video: videoHandler
        }
      },
      clipboard: {
        matchVisual: false,
      }
    }
  }, [])

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video', 'blockquote', 'code-block'
  ]

  useEffect(() => {
    // Check if user is already logged in via session
    const isAuthenticated = checkAdminSession()
    if (isAuthenticated) {
      setLoggedIn(true)
    }
    setCheckingSession(false)
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchSubscribers();
      fetchGroups();
    }
  }, [loggedIn, filterActive]);

  useEffect(() => {
    // Initialize subscriber statuses when subscribers are loaded
    if (subscribers.length > 0) {
      const initialStatuses = {};
      subscribers.forEach(sub => {
        initialStatuses[sub.id] = sub.is_active;
      });
      setSubscriberStatuses(initialStatuses);
    }
  }, [subscribers]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('subscribers')
        .select('*')
        .order('date_joined', { ascending: false });

      // Filter by active status if needed
      if (filterActive) {
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('subscriber_groups')
        .select('*, subscriber_group_members(subscriber_id)')
        .order('name', { ascending: true });

      if (fetchError) {
        // If table doesn't exist, that's okay - groups feature is optional
        if (fetchError.code === '42P01') {
          console.log('Groups table not found - groups feature disabled');
          setGroups([]);
          return;
        }
        throw fetchError;
      }

      setGroups(data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      // Don't show error for groups - it's optional
      setGroups([]);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a group name' });
      return;
    }

    setSavingGroup(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingGroup) {
        // Update existing group
        const { error } = await supabase
          .from('subscriber_groups')
          .update({ 
            name: newGroupName.trim(),
            description: newGroupDescription.trim() || null
          })
          .eq('id', editingGroup.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Group updated successfully!' });
      } else {
        // Create new group
        const { error } = await supabase
          .from('subscriber_groups')
          .insert([{
            name: newGroupName.trim(),
            description: newGroupDescription.trim() || null
          }]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Group created successfully!' });
      }

      setNewGroupName('');
      setNewGroupDescription('');
      setEditingGroup(null);
      setShowGroupModal(false);
      await fetchGroups();
    } catch (err) {
      console.error('Error saving group:', err);
      setMessage({ type: 'error', text: 'Failed to save group: ' + err.message });
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? Members will not be deleted.')) {
      return;
    }

    try {
      // First delete group memberships
      await supabase
        .from('subscriber_group_members')
        .delete()
        .eq('group_id', groupId);

      // Then delete the group
      const { error } = await supabase
        .from('subscriber_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Group deleted successfully!' });
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      setMessage({ type: 'error', text: 'Failed to delete group: ' + err.message });
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || '');
    setShowGroupModal(true);
  };

  const handleManageGroupMembers = (group) => {
    setManagingGroup(group);
    setGroupMemberSearch('');
    // Initialize pending members with current group members
    const currentMemberIds = new Set(
      group.subscriber_group_members?.map(m => m.subscriber_id) || []
    );
    setPendingGroupMembers(currentMemberIds);
    setShowGroupMembersModal(true);
  };

  const getGroupMemberIds = (group) => {
    if (!group?.subscriber_group_members) return new Set();
    return new Set(group.subscriber_group_members.map(m => m.subscriber_id));
  };

  const handleToggleGroupMember = (subscriberId) => {
    setPendingGroupMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriberId)) {
        newSet.delete(subscriberId);
      } else {
        newSet.add(subscriberId);
      }
      return newSet;
    });
  };

  const handleSaveGroupMembers = async () => {
    if (!managingGroup) return;

    setSavingGroupMembers(true);
    setMessage({ type: '', text: '' });

    try {
      const currentMemberIds = getGroupMemberIds(managingGroup);
      const pendingMemberIds = pendingGroupMembers;

      // Find members to add (in pending but not in current)
      const toAdd = Array.from(pendingMemberIds).filter(id => !currentMemberIds.has(id));
      
      // Find members to remove (in current but not in pending)
      const toRemove = Array.from(currentMemberIds).filter(id => !pendingMemberIds.has(id));

      // Remove members
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('subscriber_group_members')
          .delete()
          .eq('group_id', managingGroup.id)
          .in('subscriber_id', toRemove);

        if (removeError) throw removeError;
      }

      // Add members
      if (toAdd.length > 0) {
        const membersToAdd = toAdd.map(subscriberId => ({
          group_id: managingGroup.id,
          subscriber_id: subscriberId
        }));

        const { error: addError } = await supabase
          .from('subscriber_group_members')
          .insert(membersToAdd);

        if (addError) throw addError;
      }

      const totalChanges = toAdd.length + toRemove.length;
      if (totalChanges > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully updated group members (${toAdd.length} added, ${toRemove.length} removed)` 
        });
      } else {
        setMessage({ type: 'success', text: 'No changes to save' });
      }

      // Refresh groups data
      await fetchGroups();
      
      // Update the managing group with new data
      const { data: updatedGroup } = await supabase
        .from('subscriber_groups')
        .select('*, subscriber_group_members(subscriber_id)')
        .eq('id', managingGroup.id)
        .single();
      
      if (updatedGroup) {
        setManagingGroup(updatedGroup);
        // Update pending members to match new state
        const newMemberIds = new Set(
          updatedGroup.subscriber_group_members?.map(m => m.subscriber_id) || []
        );
        setPendingGroupMembers(newMemberIds);
      }

      setShowGroupMembersModal(false);
    } catch (err) {
      console.error('Error updating group membership:', err);
      setMessage({ type: 'error', text: 'Failed to update membership: ' + err.message });
    } finally {
      setSavingGroupMembers(false);
    }
  };

  const handleAddSelectedToGroup = async (groupId) => {
    if (selectedSubscribers.size === 0) {
      setMessage({ type: 'error', text: 'Please select subscribers first' });
      return;
    }

    try {
      const membersToAdd = Array.from(selectedSubscribers).map(subscriberId => ({
        group_id: groupId,
        subscriber_id: subscriberId
      }));

      const { error } = await supabase
        .from('subscriber_group_members')
        .upsert(membersToAdd, { onConflict: 'group_id,subscriber_id' });

      if (error) throw error;

      setMessage({ type: 'success', text: `Added ${selectedSubscribers.size} subscriber(s) to group` });
      setSelectedSubscribers(new Set());
      await fetchGroups();
    } catch (err) {
      console.error('Error adding to group:', err);
      setMessage({ type: 'error', text: 'Failed to add to group: ' + err.message });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCheckingSession(true);
    setMessage({ type: '', text: '' });

    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setLoggedIn(true);
      setPassword('');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Invalid password' });
    }
    setCheckingSession(false);
  };

  const handleStatusChange = (subscriberId, isActive) => {
    setSubscriberStatuses(prev => ({
      ...prev,
      [subscriberId]: isActive
    }));
  };

  const handleSaveStatuses = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Get all subscribers that need to be updated
      const updates = [];
      subscribers.forEach(sub => {
        const newStatus = subscriberStatuses[sub.id];
        if (newStatus !== undefined && newStatus !== sub.is_active) {
          updates.push({
            id: sub.id,
            is_active: newStatus
          });
        }
      });

      if (updates.length === 0) {
        setMessage({ type: 'success', text: 'No changes to save' });
        setSaving(false);
        return;
      }

      // Update each subscriber
      for (const update of updates) {
        const { error } = await supabase
          .from('subscribers')
          .update({ is_active: update.is_active })
          .eq('id', update.id);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: `Successfully updated ${updates.length} subscriber(s)` });
      
      // Refresh the list
      await fetchSubscribers();
    } catch (err) {
      console.error('Error saving subscriber statuses:', err);
      setMessage({ type: 'error', text: 'Failed to save changes: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSubscriber.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setAddingSubscriber(true);

    try {
      // Generate a random token for unsubscribe functionality
      const token = Math.floor(Math.random() * 1000000000000);

      const { data, error: insertError } = await supabase
        .from('subscribers')
        .insert([{
          name: newSubscriber.name.trim() || null,
          email: newSubscriber.email.trim().toLowerCase(),
          is_active: newSubscriber.is_active,
          date_joined: new Date().toISOString(),
          token: token
        }])
        .select();

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This email is already subscribed');
        }
        throw insertError;
      }

      setMessage({ type: 'success', text: 'Subscriber added successfully!' });
      
      // Reset form
      setNewSubscriber({ name: '', email: '', is_active: true });
      setShowAddForm(false);
      
      // Refresh the list
      await fetchSubscribers();
    } catch (err) {
      console.error('Error adding subscriber:', err);
      setMessage({ type: 'error', text: 'Failed to add subscriber: ' + err.message });
    } finally {
      setAddingSubscriber(false);
    }
  };

  // Select all functionality
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredSubscribers.map(sub => sub.id));
      setSelectedSubscribers(allIds);
    } else {
      setSelectedSubscribers(new Set());
    }
  };

  const handleSelectSubscriber = (subscriberId, isSelected) => {
    setSelectedSubscribers(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(subscriberId);
      } else {
        newSet.delete(subscriberId);
      }
      return newSet;
    });
  };

  // Delete functionality
  const handleDeleteSelected = async () => {
    if (selectedSubscribers.size === 0) return;

    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      const idsToDelete = Array.from(selectedSubscribers);

      // First, remove from any groups
      await supabase
        .from('subscriber_group_members')
        .delete()
        .in('subscriber_id', idsToDelete);

      // Then delete the subscribers
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      setMessage({ type: 'success', text: `Successfully deleted ${idsToDelete.length} subscriber(s)` });
      setSelectedSubscribers(new Set());
      setShowDeleteConfirm(false);
      
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting subscribers:', err);
      setMessage({ type: 'error', text: 'Failed to delete subscribers: ' + err.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (subscriberId) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;

    setMessage({ type: '', text: '' });

    try {
      // First, remove from any groups
      await supabase
        .from('subscriber_group_members')
        .delete()
        .eq('subscriber_id', subscriberId);

      // Then delete the subscriber
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Subscriber deleted successfully' });
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      setMessage({ type: 'error', text: 'Failed to delete subscriber: ' + err.message });
    }
  };

  // CSV Upload and Import functions
  const handleCsvFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    setCsvFileName(file.name);
    setCsvParseError('');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsedData = parseCsv(text);
        
        if (parsedData.length === 0) {
          setCsvParseError('No valid subscribers found in the CSV file');
          setCsvData([]);
          return;
        }
        
        setCsvData(parsedData);
        setShowCsvModal(true);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setCsvParseError('Failed to parse CSV file: ' + err.message);
        setCsvData([]);
      }
    };
    reader.onerror = () => {
      setCsvParseError('Failed to read the file');
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return [];

    // Try to detect header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('name') || firstLine.includes('email') || firstLine.includes('active');
    
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsedSubscribers = [];
    const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      // Parse CSV line (handle quoted values)
      const values = parseCSVLine(line);
      
      if (values.length < 2) continue;

      const name = values[0]?.trim() || '';
      const email = values[1]?.trim().toLowerCase() || '';
      const activeValue = values[2]?.trim().toLowerCase() || 'true';
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) continue;

      // Parse active status
      const isActive = activeValue === 'true' || activeValue === '1' || activeValue === 'yes' || activeValue === 'active';

      // Check for duplicates
      const isDuplicate = existingEmails.has(email) || parsedSubscribers.some(s => s.email === email);

      parsedSubscribers.push({
        name,
        email,
        is_active: isActive,
        isDuplicate,
        rowIndex: i + (hasHeader ? 2 : 1) // For display purposes (1-indexed, accounting for header)
      });
    }

    return parsedSubscribers;
  };

  // Helper function to parse CSV line with proper handling of quoted values
  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  };

  const handleCsvImport = async () => {
    const validSubscribers = csvData.filter(s => !s.isDuplicate);
    
    if (validSubscribers.length === 0) {
      setMessage({ type: 'error', text: 'No new subscribers to import (all are duplicates)' });
      return;
    }

    setImportingCsv(true);
    setMessage({ type: '', text: '' });

    try {
      let successCount = 0;
      let failCount = 0;
      const insertedSubscriberIds = [];

      for (const sub of validSubscribers) {
        try {
          // Generate a random token for unsubscribe functionality
          const token = Math.floor(Math.random() * 1000000000000);

          const { data, error: insertError } = await supabase
            .from('subscribers')
            .insert([{
              name: sub.name || null,
              email: sub.email,
              is_active: sub.is_active,
              date_joined: new Date().toISOString(),
              token: token
            }])
            .select();

          if (insertError) {
            console.error(`Failed to insert ${sub.email}:`, insertError);
            failCount++;
          } else {
            successCount++;
            if (data && data[0]) {
              insertedSubscriberIds.push(data[0].id);
            }
          }
        } catch (err) {
          console.error(`Error inserting ${sub.email}:`, err);
          failCount++;
        }
      }

      // Add to group if selected
      if (csvGroupSelection !== 'none' && insertedSubscriberIds.length > 0) {
        try {
          const groupMembers = insertedSubscriberIds.map(subscriberId => ({
            group_id: csvGroupSelection,
            subscriber_id: subscriberId
          }));

          const { error: groupError } = await supabase
            .from('subscriber_group_members')
            .insert(groupMembers);

          if (groupError) {
            console.error('Error adding subscribers to group:', groupError);
            setMessage({ 
              type: 'success', 
              text: `Imported ${successCount} subscriber(s)${failCount > 0 ? `, ${failCount} failed` : ''}. Note: Failed to add to group.`
            });
          } else {
            const groupName = groups.find(g => g.id === csvGroupSelection)?.name || 'selected group';
            setMessage({ 
              type: 'success', 
              text: `Successfully imported ${successCount} subscriber(s) and added to "${groupName}"${failCount > 0 ? `. ${failCount} failed.` : ''}`
            });
          }
        } catch (err) {
          console.error('Error adding to group:', err);
        }
      } else {
        setMessage({ 
          type: 'success', 
          text: `Successfully imported ${successCount} subscriber(s)${failCount > 0 ? `. ${failCount} failed.` : ''}`
        });
      }

      // Reset and close modal
      setShowCsvModal(false);
      setCsvData([]);
      setCsvFileName('');
      setCsvGroupSelection('none');
      
      // Refresh data
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error importing CSV:', err);
      setMessage({ type: 'error', text: 'Failed to import subscribers: ' + err.message });
    } finally {
      setImportingCsv(false);
    }
  };

  const closeCsvModal = () => {
    setShowCsvModal(false);
    setCsvData([]);
    setCsvFileName('');
    setCsvGroupSelection('none');
    setCsvParseError('');
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file' })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'PDF size must be less than 10MB' })
      return
    }

    setUploadingPdf(true)
    setMessage({ type: '', text: '' })

    try {
      // Try to upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `newsletter-pdfs/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('newsletter-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('newsletter-pdfs')
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          setPdfUrl(urlData.publicUrl)
          setPdfFile(file)
          setMessage({ type: 'success', text: 'PDF uploaded successfully!' })
          setUploadingPdf(false)
          return
        }
      }

      // Fallback: Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        setPdfUrl(base64data)
        setPdfFile(file)
        setMessage({ type: 'success', text: 'PDF loaded successfully!' })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Error uploading PDF:', err)
      setMessage({ type: 'error', text: 'Failed to upload PDF: ' + err.message })
    } finally {
      setUploadingPdf(false)
    }
  }

  const removePdf = () => {
    setPdfFile(null)
    setPdfUrl('')
  }

  const handleSendEmails = async () => {
    const content = emailContent.trim();
    
    if (!content || (emailMode === 'rich' && content === '<p><br></p>')) {
      setMessage({ type: 'error', text: 'Please enter email content' });
      return;
    }

    if (!emailSubject.trim()) {
      setMessage({ type: 'error', text: 'Please enter email subject' });
      return;
    }

    setSendingEmails(true);
    setMessage({ type: '', text: '' });

    try {
      // Get subscribers based on selected group
      let targetSubscribers = [];

      if (selectedGroupForEmail === 'all') {
        // Get all active subscribers
        targetSubscribers = subscribers.filter(sub => sub.is_active === true);
      } else {
        // Get subscribers in the selected group
        const selectedGroup = groups.find(g => g.id === selectedGroupForEmail);
        if (selectedGroup && selectedGroup.subscriber_group_members) {
          const memberIds = new Set(selectedGroup.subscriber_group_members.map(m => m.subscriber_id));
          targetSubscribers = subscribers.filter(sub => sub.is_active && memberIds.has(sub.id));
        }
      }
      
      if (targetSubscribers.length === 0) {
        setMessage({ type: 'error', text: 'No active subscribers to send emails to' });
        setSendingEmails(false);
        return;
      }

      // Get email config
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

      // Send emails one by one
      for (const subscriber of targetSubscribers) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-email', {
            method: 'POST',
            body: JSON.stringify({
              type: 'subscriber_notification',
              email: subscriber.email,
              name: subscriber.name || 'Subscriber',
              message: content,
              subject: emailSubject.trim(),
              htmlContent: (emailMode === 'rich' || emailMode === 'html') ? content : null,
              pdfUrl: pdfUrl || null,
              pdfFileName: pdfFile?.name || null,
              fromEmail: emailConfig.email_id.trim(),
              fromName: emailConfig.from_email_name.trim(),
              password: emailConfig.email_password.trim(),
              token: subscriber.token || null
            })
          });

          if (emailError) {
            console.error(`Error sending email to ${subscriber.email}:`, emailError);
            failCount++;
          } else {
            successCount++;
            // Add a small delay between emails to avoid rate limiting
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

  // Filter subscribers based on search term and remove invalid entries, then sort alphabetically
  const filteredSubscribers = subscribers
    .filter((subscriber) => {
      // Remove invalid subscribers - must have both id and email, and they must be truthy strings
      if (!subscriber || 
          !subscriber.id || 
          !subscriber.email || 
          typeof subscriber.id !== 'string' && typeof subscriber.id !== 'number' ||
          typeof subscriber.email !== 'string' ||
          subscriber.email.trim() === '') {
        return false;
      }
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = subscriber.name?.toLowerCase().includes(searchLower) || false;
      const emailMatch = subscriber.email?.toLowerCase().includes(searchLower) || false;
      return nameMatch || emailMatch;
    })
    .sort((a, b) => {
      // Sort alphabetically by name, then by email if names are equal
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA !== nameB) {
        return nameA.localeCompare(nameB);
      }
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

  // Check if all filtered subscribers are selected
  const isAllSelected = filteredSubscribers.length > 0 && 
    filteredSubscribers.every(sub => selectedSubscribers.has(sub.id));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const hasChanges = subscribers.some(sub => 
    subscriberStatuses[sub.id] !== undefined && subscriberStatuses[sub.id] !== sub.is_active
  );

  // Calculate target count for email
  const getTargetEmailCount = () => {
    if (selectedGroupForEmail === 'all') {
      return activeSubscribers;
    }
    const selectedGroup = groups.find(g => g.id === selectedGroupForEmail);
    if (selectedGroup && selectedGroup.subscriber_group_members) {
      const memberIds = new Set(selectedGroup.subscriber_group_members.map(m => m.subscriber_id));
      return subscribers.filter(sub => sub.is_active && memberIds.has(sub.id)).length;
    }
    return 0;
  };

  const targetEmailCount = getTargetEmailCount();

  if (checkingSession) {
    return (
      <main className="newsletter-subscribers-page bg-texture">
        <div className="subscribers-login">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="newsletter-subscribers-page bg-texture">
        <div className="subscribers-login">
          <h2>Subscribers Management</h2>
          <p className="login-subtitle">Enter password to access subscribers management</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoFocus
                  disabled={checkingSession}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {message.type === 'error' && (
              <div className="message message-error">{message.text}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={checkingSession}>
              {checkingSession ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="newsletter-subscribers-page bg-texture">
      <div className="subscribers-container">
        <div className="subscribers-header">
          <h1 className="subscribers-title">Newsletter Subscribers</h1>
          <p className="subscribers-subtitle">
            Manage and view all newsletter subscribers
          </p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Stats Section */}
        <div className="subscribers-stats">
          <div className="stat-card">
            <div className="stat-value">{totalSubscribers}</div>
            <div className="stat-label">Total Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeSubscribers}</div>
            <div className="stat-label">Active Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{subscribers.length - activeSubscribers}</div>
            <div className="stat-label">Inactive Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{groups.length}</div>
            <div className="stat-label">Groups</div>
          </div>
        </div>

        {/* Group Management Section */}
        <div className="group-management-section">
          <div className="group-management-header">
            <h3 className="section-title">
              <Users size={20} />
              Subscriber Groups
            </h3>
            <button 
              className="btn btn-toggle-form"
              onClick={() => {
                setEditingGroup(null);
                setNewGroupName('');
                setNewGroupDescription('');
                setShowGroupModal(true);
              }}
            >
              <Plus size={18} />
              Create Group
            </button>
          </div>
          
          {groups.length === 0 ? (
            <div className="groups-empty-state">
              <Users size={48} />
              <p>No groups created yet. Create groups to organize your subscribers and send targeted emails.</p>
            </div>
          ) : (
            <div className="groups-list">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-info">
                    <h4 className="group-name">{group.name}</h4>
                    {group.description && (
                      <p className="group-description">{group.description}</p>
                    )}
                    <span className="group-member-count">
                      {group.subscriber_group_members?.length || 0} member(s)
                    </span>
                  </div>
                  <div className="group-actions">
                    <button
                      className="btn-group-action"
                      onClick={() => handleManageGroupMembers(group)}
                      title="Manage members"
                    >
                      <Users size={16} />
                    </button>
                    <button
                      className="btn-group-action"
                      onClick={() => handleEditGroup(group)}
                      title="Edit group"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-group-action btn-group-delete"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Delete group"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Actions Section */}
        {selectedSubscribers.size > 0 && (
          <div className="bulk-actions-section">
            <div className="bulk-actions-info">
              <span className="selected-count">{selectedSubscribers.size} subscriber(s) selected</span>
            </div>
            <div className="bulk-actions-buttons">
              {groups.length > 0 && (
                <div className="add-to-group-dropdown">
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddSelectedToGroup(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="group-select"
                  >
                    <option value="">Add to group...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
              <button
                className="btn btn-secondary-outline"
                onClick={() => setSelectedSubscribers(new Set())}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Add Subscriber Section */}
        <div className="add-subscriber-section">
          <div className="add-subscriber-header">
            <h3 className="section-title">Add New Subscriber</h3>
            <div className="add-subscriber-buttons">
              <button 
                className="btn btn-toggle-form"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <UserPlus size={18} />
                {showAddForm ? 'Cancel' : 'Add Single'}
              </button>
              <label className="btn btn-csv-upload">
                <FileSpreadsheet size={18} />
                Import CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {csvParseError && (
            <div className="csv-error-message">
              <XCircle size={16} />
              {csvParseError}
            </div>
          )}
          
          {showAddForm && (
            <form className="add-subscriber-form" onSubmit={handleAddSubscriber}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new_subscriber_name">Name</label>
                  <input
                    id="new_subscriber_name"
                    type="text"
                    value={newSubscriber.name}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter subscriber name (optional)"
                    className="form-input"
                    disabled={addingSubscriber}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_subscriber_email">Email *</label>
                  <input
                    id="new_subscriber_email"
                    type="email"
                    value={newSubscriber.email}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter subscriber email"
                    className="form-input"
                    disabled={addingSubscriber}
                    required
                  />
                </div>
                <div className="form-group form-group-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newSubscriber.is_active}
                      onChange={(e) => setNewSubscriber(prev => ({ ...prev, is_active: e.target.checked }))}
                      disabled={addingSubscriber}
                      className="form-checkbox"
                    />
                    Active
                  </label>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary add-subscriber-btn"
                disabled={addingSubscriber || !newSubscriber.email.trim()}
              >
                {addingSubscriber ? 'Adding...' : 'Add Subscriber'}
              </button>
            </form>
          )}

          <div className="csv-format-hint">
            <small>
              <strong>CSV Format:</strong> The CSV file should have columns: <code>name, email, active</code> (active can be true/false, yes/no, or 1/0)
            </small>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="subscribers-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
                className="filter-checkbox"
              />
              Show only active subscribers
            </label>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading subscribers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>Error loading subscribers: {error}</p>
            <button onClick={fetchSubscribers} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {/* Subscribers List */}
        {!loading && !error && (
          <div className="subscribers-list-container">
            {filteredSubscribers.length === 0 ? (
              <div className="empty-state">
                <p>No subscribers found.</p>
              </div>
            ) : (
              <>
                {/* Table info bar */}
                <div className="table-info-bar">
                  <span className="showing-info">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                  </span>
                  <div className="items-per-page">
                    <label htmlFor="items-per-page">Show:</label>
                    <select
                      id="items-per-page"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="items-per-page-select"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="subscribers-table">
                  <div className="table-header">
                    <div className="table-cell header-cell checkbox-cell">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="header-checkbox"
                        title="Select all"
                      />
                    </div>
                    <div className="table-cell header-cell">Active</div>
                    <div className="table-cell header-cell">Name</div>
                    <div className="table-cell header-cell">Email</div>
                    <div className="table-cell header-cell">Date Joined</div>
                    <div className="table-cell header-cell">Status</div>
                    <div className="table-cell header-cell">Actions</div>
                  </div>
                  {paginatedSubscribers
                    .filter(sub => sub && sub.id && sub.email && sub.email.trim() !== '')
                    .map((subscriber, index) => (
                      <div key={subscriber.id} className="table-row">
                        <div className="table-cell checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.has(subscriber.id)}
                            onChange={(e) => handleSelectSubscriber(subscriber.id, e.target.checked)}
                            className="subscriber-checkbox"
                          />
                        </div>
                        <div className="table-cell checkbox-cell">
                          <input
                            type="checkbox"
                            checked={subscriberStatuses[subscriber.id] === true || (subscriberStatuses[subscriber.id] === undefined && subscriber.is_active === true)}
                            onChange={(e) => handleStatusChange(subscriber.id, e.target.checked)}
                            className="subscriber-checkbox"
                          />
                        </div>
                        <div className="table-cell name-cell">
                          {subscriber.name || 'N/A'}
                        </div>
                        <div className="table-cell email-cell">
                          <a href={`mailto:${subscriber.email}`} className="email-link">
                            {subscriber.email}
                          </a>
                        </div>
                        <div className="table-cell date-cell">
                          {formatDate(subscriber.date_joined)}
                        </div>
                        <div className="table-cell status-cell">
                          <span className={`status-badge ${(subscriberStatuses[subscriber.id] === true || (subscriberStatuses[subscriber.id] === undefined && subscriber.is_active === true)) ? 'active' : 'inactive'}`}>
                            {(subscriberStatuses[subscriber.id] === true || (subscriberStatuses[subscriber.id] === undefined && subscriber.is_active === true)) ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="table-cell actions-cell">
                          <button
                            className="btn-delete-single"
                            onClick={() => handleDeleteSingle(subscriber.id)}
                            title="Delete subscriber"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      title="First page"
                    >
                      ««
                    </button>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      title="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="pagination-pages">
                      {(() => {
                        const pages = [];
                        const maxVisiblePages = 5;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              className={`pagination-page ${currentPage === 1 ? 'active' : ''}`}
                              onClick={() => setCurrentPage(1)}
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          if (i === 1 && startPage > 1) continue;
                          if (i === totalPages && endPage < totalPages) continue;
                          pages.push(
                            <button
                              key={i}
                              className={`pagination-page ${currentPage === i ? 'active' : ''}`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
                          }
                          pages.push(
                            <button
                              key={totalPages}
                              className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
                              onClick={() => setCurrentPage(totalPages)}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      title="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      title="Last page"
                    >
                      »»
                    </button>
                  </div>
                )}
                
                {hasChanges && (
                  <div className="save-status-section">
                    <button 
                      onClick={handleSaveStatuses} 
                      className="btn btn-primary save-status-btn"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Send Email to Subscribers Section */}
        <div className="send-email-section">
          <h3 className="section-title">Send Newsletter to Subscribers</h3>
          <p className="section-description">
            Create and send a professional newsletter email. Select a group or send to all active subscribers.
          </p>
          <div className="email-form">
            {/* Target Group Selection */}
            <div className="form-group">
              <label htmlFor="target_group">Send To *</label>
              <select
                id="target_group"
                value={selectedGroupForEmail}
                onChange={(e) => setSelectedGroupForEmail(e.target.value)}
                className="target-group-select"
                disabled={sendingEmails}
              >
                <option value="all">All Active Subscribers ({activeSubscribers})</option>
                {groups.map(group => {
                  const memberCount = group.subscriber_group_members?.length || 0;
                  const activeMemberCount = group.subscriber_group_members 
                    ? subscribers.filter(s => s.is_active && group.subscriber_group_members.some(m => m.subscriber_id === s.id)).length
                    : 0;
                  return (
                    <option key={group.id} value={group.id}>
                      {group.name} ({activeMemberCount} active of {memberCount})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email_subject">Email Subject *</label>
              <input
                id="email_subject"
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject (e.g., Monthly Newsletter - January 2025)"
                className="email-subject-input"
                disabled={sendingEmails}
                required
              />
            </div>

            <div className="form-group">
              <div className="email-mode-toggle">
                <label className="mode-label">Email Format:</label>
                <button
                  type="button"
                  className={`mode-btn ${emailMode === 'rich' ? 'active' : ''}`}
                  onClick={() => setEmailMode('rich')}
                  disabled={sendingEmails}
                >
                  Rich Text Editor
                </button>
                <button
                  type="button"
                  className={`mode-btn ${emailMode === 'html' ? 'active' : ''}`}
                  onClick={() => setEmailMode('html')}
                  disabled={sendingEmails}
                >
                  Custom HTML/CSS
                </button>
                <button
                  type="button"
                  className={`mode-btn ${emailMode === 'plain' ? 'active' : ''}`}
                  onClick={() => setEmailMode('plain')}
                  disabled={sendingEmails}
                >
                  Plain Text
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email_content">Email Content *</label>
              {emailMode === 'rich' ? (
                <div className="quill-container">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={emailContent}
                    onChange={setEmailContent}
                    placeholder="Write your newsletter content here... Use the toolbar to format text, add images, links, etc."
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>
              ) : emailMode === 'html' ? (
                <div className="html-editor-container">
                  <textarea
                    id="html_content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder={`Paste your custom HTML/CSS code here...

Example:
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #4a90e2; color: white; padding: 20px; }
    .content { padding: 20px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Newsletter Title</h1>
  </div>
  <div class="content">
    <img src="https://your-image-url.com/image.jpg" alt="Banner" />
    <p>Your content here...</p>
  </div>
</body>
</html>`}
                    rows={20}
                    className="html-content-textarea"
                    disabled={sendingEmails}
                    spellCheck={false}
                  />
                  <small className="form-hint html-hint">
                    ðŸ’¡ <strong>Tips:</strong> Use inline CSS for best email client compatibility. 
                    For images, use absolute URLs (https://). 
                    Test with popular email clients before sending to all subscribers.
                  </small>
                </div>
              ) : (
                <textarea
                  id="email_content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Enter your message here (e.g., policy updates, announcements, etc.)"
                  rows={8}
                  className="email-content-textarea"
                  disabled={sendingEmails}
                />
              )}
              <small className="form-hint">
                This message will be sent to {targetEmailCount} subscriber(s)
                {selectedGroupForEmail !== 'all' && groups.find(g => g.id === selectedGroupForEmail) && 
                  ` in "${groups.find(g => g.id === selectedGroupForEmail).name}"`}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="pdf_upload">Attach PDF Newsletter (Optional)</label>
              <div className="pdf-upload-section">
                {pdfFile ? (
                  <div className="pdf-preview-container">
                    <FileText size={24} />
                    <span className="pdf-file-name">{pdfFile.name}</span>
                    <button
                      type="button"
                      className="btn-remove-pdf"
                      onClick={removePdf}
                      disabled={sendingEmails || uploadingPdf}
                      title="Remove PDF"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="pdf-upload-area">
                    <input
                      id="pdf_upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      disabled={sendingEmails || uploadingPdf}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="pdf_upload" className="pdf-upload-label">
                      <Upload size={20} />
                      <span>{uploadingPdf ? 'Uploading PDF...' : 'Upload PDF Newsletter'}</span>
                    </label>
                    <small className="form-hint">Upload a PDF file to attach to the newsletter (max 10MB)</small>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSendEmails} 
              className="btn btn-secondary send-email-btn"
              disabled={sendingEmails || !emailContent.trim() || !emailSubject.trim() || targetEmailCount === 0 || uploadingPdf}
            >
              {sendingEmails 
                ? `Sending... (${targetEmailCount} emails)` 
                : `Send Newsletter (${targetEmailCount} subscriber${targetEmailCount !== 1 ? 's' : ''})`}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {selectedSubscribers.size} subscriber(s)?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary-outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteSelected}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Create/Edit Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content group-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
              <button className="modal-close" onClick={() => setShowGroupModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="group_name">Group Name *</label>
                <input
                  id="group_name"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name (e.g., VIP Clients, Monthly Updates)"
                  className="form-input"
                  disabled={savingGroup}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="group_description">Description (Optional)</label>
                <textarea
                  id="group_description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter a description for this group"
                  className="form-textarea"
                  rows={3}
                  disabled={savingGroup}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary-outline"
                onClick={() => {
                  setShowGroupModal(false);
                  setEditingGroup(null);
                  setNewGroupName('');
                  setNewGroupDescription('');
                }}
                disabled={savingGroup}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateGroup}
                disabled={savingGroup || !newGroupName.trim()}
              >
                {savingGroup ? 'Saving...' : (editingGroup ? 'Update Group' : 'Create Group')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Group Members Modal */}
      {showGroupMembersModal && managingGroup && (
        <div className="modal-overlay" onClick={() => setShowGroupMembersModal(false)}>
          <div className="modal-content group-members-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Members - {managingGroup.name}</h3>
              <button className="modal-close" onClick={() => setShowGroupMembersModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="member-search">
                <input
                  type="text"
                  value={groupMemberSearch}
                  onChange={(e) => setGroupMemberSearch(e.target.value)}
                  placeholder="Search subscribers..."
                  className="form-input"
                />
              </div>
              <div className="members-list">
                {(() => {
                  const currentMemberIds = getGroupMemberIds(managingGroup);
                  const searchLower = groupMemberSearch.toLowerCase();
                  
                  return subscribers
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
                    })
                    .map(subscriber => {
                      const isInPending = pendingGroupMembers.has(subscriber.id);
                      const wasInGroup = currentMemberIds.has(subscriber.id);
                      const hasChanged = isInPending !== wasInGroup;
                      
                      return (
                        <div 
                          key={subscriber.id} 
                          className={`member-item ${isInPending ? 'in-group' : ''} ${hasChanged ? 'changed' : ''}`}
                          onClick={() => handleToggleGroupMember(subscriber.id)}
                        >
                          <div className="member-info">
                            <span className="member-name">{subscriber.name || 'No Name'}</span>
                            <span className="member-email">{subscriber.email}</span>
                            {!subscriber.is_active && (
                              <span className="member-inactive-badge">Inactive</span>
                            )}
                          </div>
                          <div className="member-status">
                            <input
                              type="checkbox"
                              checked={isInPending}
                              onChange={() => {}}
                              className="member-checkbox"
                            />
                            {hasChanged && (
                              <span className="changed-indicator">●</span>
                            )}
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
              <div className="members-summary">
                <span>{pendingGroupMembers.size} member(s) selected</span>
                {(() => {
                  const currentMemberIds = getGroupMemberIds(managingGroup);
                  const toAdd = Array.from(pendingGroupMembers).filter(id => !currentMemberIds.has(id)).length;
                  const toRemove = Array.from(currentMemberIds).filter(id => !pendingGroupMembers.has(id)).length;
                  const hasChanges = toAdd > 0 || toRemove > 0;
                  
                  if (hasChanges) {
                    return (
                      <span className="changes-summary">
                        ({toAdd > 0 ? `+${toAdd}` : ''}{toAdd > 0 && toRemove > 0 ? ', ' : ''}{toRemove > 0 ? `-${toRemove}` : ''})
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary-outline"
                onClick={() => setShowGroupMembersModal(false)}
                disabled={savingGroupMembers}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveGroupMembers}
                disabled={savingGroupMembers}
              >
                {savingGroupMembers ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Preview Modal */}
      {showCsvModal && (
        <div className="modal-overlay" onClick={closeCsvModal}>
          <div className="modal-content csv-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FileSpreadsheet size={22} />
                CSV Import Preview
              </h3>
              <button className="modal-close" onClick={closeCsvModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="csv-file-info">
                <FileText size={18} />
                <span className="csv-file-name">{csvFileName}</span>
                <span className="csv-subscribers-count">
                  {csvData.length} subscriber(s) found
                </span>
              </div>

              {/* Add to Group Option */}
              <div className="csv-group-selection">
                <label htmlFor="csv_group_select">Add all imported subscribers to group (optional):</label>
                <select
                  id="csv_group_select"
                  value={csvGroupSelection}
                  onChange={(e) => setCsvGroupSelection(e.target.value)}
                  className="csv-group-select"
                  disabled={importingCsv}
                >
                  <option value="none">Don't add to any group</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              {/* Summary stats */}
              <div className="csv-import-stats">
                <div className="csv-stat">
                  <span className="csv-stat-value csv-stat-new">
                    {csvData.filter(s => !s.isDuplicate).length}
                  </span>
                  <span className="csv-stat-label">New subscribers</span>
                </div>
                <div className="csv-stat">
                  <span className="csv-stat-value csv-stat-duplicate">
                    {csvData.filter(s => s.isDuplicate).length}
                  </span>
                  <span className="csv-stat-label">Duplicates (will skip)</span>
                </div>
                <div className="csv-stat">
                  <span className="csv-stat-value csv-stat-active">
                    {csvData.filter(s => !s.isDuplicate && s.is_active).length}
                  </span>
                  <span className="csv-stat-label">Active</span>
                </div>
                <div className="csv-stat">
                  <span className="csv-stat-value csv-stat-inactive">
                    {csvData.filter(s => !s.isDuplicate && !s.is_active).length}
                  </span>
                  <span className="csv-stat-label">Inactive</span>
                </div>
              </div>

              {/* Preview Table */}
              <div className="csv-preview-table-container">
                <table className="csv-preview-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((subscriber, index) => (
                      <tr 
                        key={index} 
                        className={subscriber.isDuplicate ? 'csv-row-duplicate' : 'csv-row-new'}
                      >
                        <td className="csv-row-number">{subscriber.rowIndex}</td>
                        <td className="csv-name">{subscriber.name || <em>No name</em>}</td>
                        <td className="csv-email">{subscriber.email}</td>
                        <td className="csv-active">
                          <span className={`csv-active-badge ${subscriber.is_active ? 'active' : 'inactive'}`}>
                            {subscriber.is_active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="csv-status">
                          {subscriber.isDuplicate ? (
                            <span className="csv-status-badge duplicate">
                              <XCircle size={14} />
                              Duplicate
                            </span>
                          ) : (
                            <span className="csv-status-badge new">
                              <Check size={14} />
                              Will import
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {csvData.filter(s => s.isDuplicate).length > 0 && (
                <div className="csv-duplicate-warning">
                  <XCircle size={16} />
                  <span>
                    {csvData.filter(s => s.isDuplicate).length} duplicate email(s) found and will be skipped.
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary-outline"
                onClick={closeCsvModal}
                disabled={importingCsv}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCsvImport}
                disabled={importingCsv || csvData.filter(s => !s.isDuplicate).length === 0}
              >
                {importingCsv 
                  ? 'Importing...' 
                  : `Import ${csvData.filter(s => !s.isDuplicate).length} Subscriber(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default NewsletterSubscribersList;

