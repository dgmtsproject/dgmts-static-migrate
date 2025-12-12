import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import './NewsletterSubscribersList.css';

const NewsletterSubscribersList = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false); // Show all by default for admin
  const [subscriberStatuses, setSubscriberStatuses] = useState({}); // Track checkbox states
  const [saving, setSaving] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_PASSWORD = 'admin@dgmts123';

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setPassword('');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Invalid password' });
    }
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

  const handleSendEmails = async () => {
    if (!emailContent.trim()) {
      setMessage({ type: 'error', text: 'Please enter email content' });
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
              message: emailContent.trim(),
              fromEmail: emailConfig.email_id.trim(),
              fromName: emailConfig.from_email_name.trim(),
              password: emailConfig.email_password.trim()
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
            <button type="submit" className="btn btn-primary">
              Login
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
          <h3 className="section-title">Send Notification to Active Subscribers</h3>
          <p className="section-description">
            Send an email notification to all active subscribers. Emails will be sent one by one.
          </p>
          <div className="email-form">
            <div className="form-group">
              <label htmlFor="email_content">Email Content *</label>
              <textarea
                id="email_content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter your message here (e.g., policy updates, announcements, etc.)"
                rows={6}
                className="email-content-textarea"
                disabled={sendingEmails}
              />
              <small className="form-hint">
                This message will be sent to all {activeSubscribers} active subscriber(s)
              </small>
            </div>
            <button 
              onClick={handleSendEmails} 
              className="btn btn-secondary send-email-btn"
              disabled={sendingEmails || !emailContent.trim() || activeSubscribers === 0}
            >
              {sendingEmails ? `Sending... (${activeSubscribers} emails)` : `Send to All Active Subscribers (${activeSubscribers})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsletterSubscribersList;

