import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff, Upload, FileText, X } from 'lucide-react';
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
  const [emailMode, setEmailMode] = useState('rich'); // 'rich' or 'plain'
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const quillRef = useRef(null);

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
              insertImageToEditor(imageUrl)
            }
            reader.readAsDataURL(file)
            return
          }

          insertImageToEditor(imageUrl)
        } catch (err) {
          console.error('Error uploading image:', err)
          // Fallback to data URL
          const reader = new FileReader()
          reader.onloadend = () => {
            insertImageToEditor(reader.result)
          }
          reader.readAsDataURL(file)
        }
      }
    }

    // Insert image to editor helper function
    const insertImageToEditor = (url) => {
      // Get the Quill editor instance from the DOM
      const editorElement = document.querySelector('.ql-editor')
      if (editorElement) {
        // Try to get Quill instance from the element
        const quillInstance = editorElement.__quill || (window.Quill && window.Quill.find(editorElement))
        if (quillInstance) {
          const range = quillInstance.getSelection(true)
          quillInstance.insertEmbed(range.index, 'image', url, 'user')
          quillInstance.setSelection(range.index + 1)
        }
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
          image: imageHandler
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
    const content = emailMode === 'rich' ? emailContent.trim() : emailContent.trim()
    
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
      // Get all active subscribers
      const activeSubscribers = subscribers.filter(sub => sub.is_active === true);
      
      if (activeSubscribers.length === 0) {
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
      for (const subscriber of activeSubscribers) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-email', {
            method: 'POST',
            body: JSON.stringify({
              type: 'subscriber_notification',
              email: subscriber.email,
              name: subscriber.name || 'Subscriber',
              message: content,
              subject: emailSubject.trim(),
              htmlContent: emailMode === 'rich' ? content : null,
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

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = subscriber.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = subscriber.email?.toLowerCase().includes(searchLower) || false;
    return nameMatch || emailMatch;
  });

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
                <div className="subscribers-table">
                  <div className="table-header">
                    <div className="table-cell header-cell checkbox-cell">
                      <input
                        type="checkbox"
                        checked={filteredSubscribers.length > 0 && filteredSubscribers.every(sub => {
                          const status = subscriberStatuses[sub.id];
                          return status === true || (status === undefined && sub.is_active === true);
                        })}
                        onChange={(e) => {
                          filteredSubscribers.forEach(sub => {
                            handleStatusChange(sub.id, e.target.checked);
                          });
                        }}
                        className="header-checkbox"
                      />
                    </div>
                    <div className="table-cell header-cell">#</div>
                    <div className="table-cell header-cell">Name</div>
                    <div className="table-cell header-cell">Email</div>
                    <div className="table-cell header-cell">Date Joined</div>
                    <div className="table-cell header-cell">Status</div>
                  </div>
                  {filteredSubscribers.map((subscriber, index) => (
                    <div key={subscriber.id || index} className="table-row">
                      <div className="table-cell checkbox-cell">
                        <input
                          type="checkbox"
                          checked={subscriberStatuses[subscriber.id] === true || (subscriberStatuses[subscriber.id] === undefined && subscriber.is_active === true)}
                          onChange={(e) => handleStatusChange(subscriber.id, e.target.checked)}
                          className="subscriber-checkbox"
                        />
                      </div>
                      <div className="table-cell">{index + 1}</div>
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
                    </div>
                  ))}
                </div>
                
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
          <h3 className="section-title">Send Newsletter to Active Subscribers</h3>
          <p className="section-description">
            Create and send a professional newsletter email to all active subscribers. Emails will be sent one by one.
          </p>
          <div className="email-form">
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
                  Rich Text (HTML)
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
                    theme="snow"
                    value={emailContent}
                    onChange={setEmailContent}
                    placeholder="Write your newsletter content here... Use the toolbar to format text, add images, links, etc."
                    modules={quillModules}
                    formats={quillFormats}
                  />
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
                This message will be sent to all {activeSubscribers} active subscriber(s)
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
              disabled={sendingEmails || !emailContent.trim() || !emailSubject.trim() || activeSubscribers === 0 || uploadingPdf}
            >
              {sendingEmails ? `Sending... (${activeSubscribers} emails)` : `Send Newsletter to All Active Subscribers (${activeSubscribers})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsletterSubscribersList;

