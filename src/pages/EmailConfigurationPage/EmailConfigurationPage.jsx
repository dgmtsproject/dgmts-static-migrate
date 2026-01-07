import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Eye, EyeOff } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import './EmailConfigurationPage.css'

function EmailConfigurationPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  
  // Tab state
  const [activeTab, setActiveTab] = useState('primary') // 'primary' or 'secondary'
  
  // Primary config
  const [primaryId, setPrimaryId] = useState(null)
  const [primaryEmailId, setPrimaryEmailId] = useState('')
  const [primaryEmailPassword, setPrimaryEmailPassword] = useState('')
  const [primaryFromEmailName, setPrimaryFromEmailName] = useState('')
  const [showPrimaryPassword, setShowPrimaryPassword] = useState(false)
  
  // Secondary config
  const [secondaryId, setSecondaryId] = useState(null)
  const [secondaryEmailId, setSecondaryEmailId] = useState('')
  const [secondaryEmailPassword, setSecondaryEmailPassword] = useState('')
  const [secondaryFromEmailName, setSecondaryFromEmailName] = useState('')
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false)
  
  const [testEmail, setTestEmail] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState(false)

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
      fetchEmailConfig()
    }
  }, [loggedIn])

  const fetchEmailConfig = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('email_config')
        .select('*')
        .order('type', { ascending: true }) // primary comes before secondary alphabetically

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching email config:', error)
        setMessage({ type: 'error', text: 'Failed to load email configuration' })
      } else if (data) {
        // Load primary config
        const primary = data.find(config => config.type === 'primary')
        if (primary) {
          setPrimaryId(primary.id)
          setPrimaryEmailId(primary.email_id || '')
          setPrimaryEmailPassword(primary.email_password || '')
          setPrimaryFromEmailName(primary.from_email_name || '')
        }
        
        // Load secondary config
        const secondary = data.find(config => config.type === 'secondary')
        if (secondary) {
          setSecondaryId(secondary.id)
          setSecondaryEmailId(secondary.email_id || '')
          setSecondaryEmailPassword(secondary.email_password || '')
          setSecondaryFromEmailName(secondary.from_email_name || '')
        }
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage({ type: 'error', text: 'Failed to load email configuration' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setCheckingSession(true)
    setMessage({ type: '', text: '' })

    const isValid = await verifyAdminPassword(password)
    if (isValid) {
      setLoggedIn(true)
      setPassword('')
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Invalid password' })
    }
    setCheckingSession(false)
  }

  const handleSaveConfiguration = async (e) => {
    e.preventDefault()
    
    const configType = activeTab
    const emailId = configType === 'primary' ? primaryEmailId : secondaryEmailId
    const emailPassword = configType === 'primary' ? primaryEmailPassword : secondaryEmailPassword
    const fromEmailName = configType === 'primary' ? primaryFromEmailName : secondaryFromEmailName
    const configId = configType === 'primary' ? primaryId : secondaryId
    
    if (!emailId.trim() || !fromEmailName.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }
    
    // For primary config, always require password
    if (configType === 'primary' && !emailPassword.trim()) {
      setMessage({ type: 'error', text: 'Password is required' })
      return
    }
    
    // For secondary config with existing record, password is not required (read-only)
    // Only require password for new secondary configs (created directly in database)

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const configData = {
        email_id: emailId.trim(),
        from_email_name: fromEmailName.trim(),
        type: configType
      }
      
      // Only include password for primary config
      // Secondary password is never updated from UI (managed in database only)
      if (configType === 'primary') {
        configData.email_password = emailPassword.trim()
      }

      if (configId) {
        // Update existing config
        const { error } = await supabase
          .from('email_config')
          .update(configData)
          .eq('id', configId)

        if (error) throw error
        setMessage({ type: 'success', text: `${configType.charAt(0).toUpperCase() + configType.slice(1)} email configuration updated successfully!` })
      } else {
        // Insert new config
        const { data, error } = await supabase
          .from('email_config')
          .insert(configData)
          .select()

        if (error) throw error
        
        // Update the ID state
        if (data && data[0]) {
          if (configType === 'primary') {
            setPrimaryId(data[0].id)
          } else {
            setSecondaryId(data[0].id)
          }
        }
        
        setMessage({ type: 'success', text: `${configType.charAt(0).toUpperCase() + configType.slice(1)} email configuration saved successfully!` })
      }
    } catch (err) {
      console.error('Error saving configuration:', err)
      setMessage({ type: 'error', text: 'Failed to save configuration: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConfiguration = async (e) => {
    e.preventDefault()
    
    if (!testEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter a test email address' })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail.trim())) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setTesting(true)
    setMessage({ type: '', text: '' })

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        method: 'POST',
        body: JSON.stringify({
          type: 'test',
          email: testEmail.trim()
        })
      })

      if (error) {
        console.error('Edge function error:', error)
        throw error
      }

      if (data && data.message) {
        const configUsed = data.configUsed || 'primary'
        setMessage({ 
          type: 'success', 
          text: `Test email sent successfully using ${configUsed} configuration!` 
        })
        setTestEmail('')
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (err) {
      console.error('Error sending test email:', err)
      setMessage({ 
        type: 'error', 
        text: 'Failed to send test email: ' + (err.message || 'Unknown error') 
      })
    } finally {
      setTesting(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="email-config-page">
        <div className="email-config-login">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div className="email-config-page">
        <div className="email-config-login">
          <h2>Email Configuration</h2>
          <p className="login-subtitle">Enter password to access email configuration</p>
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
      </div>
    )
  }

  // Get current config based on active tab
  const currentEmailId = activeTab === 'primary' ? primaryEmailId : secondaryEmailId
  const currentEmailPassword = activeTab === 'primary' ? primaryEmailPassword : secondaryEmailPassword
  const currentFromEmailName = activeTab === 'primary' ? primaryFromEmailName : secondaryFromEmailName
  const currentShowPassword = activeTab === 'primary' ? showPrimaryPassword : showSecondaryPassword
  const setCurrentEmailId = activeTab === 'primary' ? setPrimaryEmailId : setSecondaryEmailId
  const setCurrentEmailPassword = activeTab === 'primary' ? setPrimaryEmailPassword : setSecondaryEmailPassword
  const setCurrentFromEmailName = activeTab === 'primary' ? setPrimaryFromEmailName : setSecondaryFromEmailName
  const setCurrentShowPassword = activeTab === 'primary' ? setShowPrimaryPassword : setShowSecondaryPassword

  return (
    <div className="email-config-page">
      <div className="email-config-container">
        <div className="email-config-header">
          <h2>Email Configuration</h2>
          <p className="config-subtitle">Manage your email settings with automatic fallback support</p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Info Box */}
        <div className="info-box">
          <p><strong>📧 Fallback Email System:</strong> The system will automatically use the secondary email if the primary fails with authentication errors.</p>
        </div>

        {/* Tab Navigation */}
        <div className="config-tabs">
          <button
            className={`tab-button ${activeTab === 'primary' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('primary')
              setMessage({ type: '', text: '' })
            }}
            type="button"
          >
            Primary Email
          </button>
          <button
            className={`tab-button ${activeTab === 'secondary' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('secondary')
              setMessage({ type: '', text: '' })
            }}
            type="button"
          >
            Secondary Email (Fallback)
          </button>
        </div>

        <form onSubmit={handleSaveConfiguration} className="email-config-form">
          <div className="form-section">
            <h3>{activeTab === 'primary' ? 'Primary' : 'Secondary'} Email Settings</h3>
            {activeTab === 'secondary' && (
              <p className="tab-description">
                This email will be used automatically if the primary email fails to send.
              </p>
            )}
            
            <div className="form-group">
              <label htmlFor={`${activeTab}_email_id`}>Email ID *</label>
              <input
                id={`${activeTab}_email_id`}
                type="email"
                value={currentEmailId}
                onChange={(e) => setCurrentEmailId(e.target.value)}
                placeholder={activeTab === 'primary' ? 'noreply@dullesgeotechnical.com' : 'noreply.dullesgeotechnical@gmail.com'}
                required
                disabled={loading}
              />
              <small className="form-hint">The email address used for sending emails</small>
            </div>

            {activeTab === 'primary' ? (
              // Primary: Editable password field
              <div className="form-group">
                <label htmlFor="primary_email_password">Password *</label>
                <div className="password-input-wrapper">
                  <input
                    id="primary_email_password"
                    type={showPrimaryPassword ? "text" : "password"}
                    value={primaryEmailPassword}
                    onChange={(e) => setPrimaryEmailPassword(e.target.value)}
                    placeholder="Enter email password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPrimaryPassword(!showPrimaryPassword)}
                    disabled={loading}
                    aria-label={showPrimaryPassword ? "Hide password" : "Show password"}
                  >
                    {showPrimaryPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <small className="form-hint">The password for the email account</small>
              </div>
            ) : (
              // Secondary: Read-only password display
              <div className="form-group">
                <label htmlFor="secondary_email_password">
                  Password (Read-Only)
                </label>
                <div className="password-readonly-wrapper">
                  <input
                    id="secondary_email_password"
                    type="text"
                    value={secondaryEmailPassword}
                    disabled
                    className="password-readonly-input"
                  />
                  <small className="form-hint">
                    Gmail App Password is read-only. To change it, generate a new App Password in Google Settings and update directly in the database.
                  </small>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor={`${activeTab}_from_email_name`}>From Name *</label>
              <input
                id={`${activeTab}_from_email_name`}
                type="text"
                value={currentFromEmailName}
                onChange={(e) => setCurrentFromEmailName(e.target.value)}
                placeholder="DGMTS"
                required
                disabled={loading}
              />
              <small className="form-hint">The display name shown in the "From" field</small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : `Save ${activeTab === 'primary' ? 'Primary' : 'Secondary'} Configuration`}
            </button>
          </div>
        </form>

        <div className="test-section">
          <h3>Test Email Configuration</h3>
          <p className="test-description">
            Send a test email to verify your configuration. The system will automatically try the primary email first, 
            and fallback to secondary if it fails.
          </p>
          
          <form onSubmit={handleTestConfiguration} className="test-email-form">
            <div className="form-group">
              <label htmlFor="test_email">Test Email Address *</label>
              <input
                id="test_email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                disabled={testing}
              />
              <small className="form-hint">Enter the email address where you want to receive the test email</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary"
              disabled={testing || loading}
            >
              {testing ? 'Sending...' : 'Test Configuration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmailConfigurationPage

