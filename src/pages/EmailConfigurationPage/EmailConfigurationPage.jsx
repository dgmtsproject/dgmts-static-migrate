import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Eye, EyeOff } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import './EmailConfigurationPage.css'

function EmailConfigurationPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)
  
  const [emailId, setEmailId] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [fromEmailName, setFromEmailName] = useState('')
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
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching email config:', error)
        setMessage({ type: 'error', text: 'Failed to load email configuration' })
      } else if (data) {
        setEmailId(data.email_id || '')
        setEmailPassword(data.email_password || '')
        setFromEmailName(data.from_email_name || '')
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
    
    if (!emailId.trim() || !emailPassword.trim() || !fromEmailName.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // Check if config exists
      const { data: existing } = await supabase
        .from('email_config')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

        if (existing) {
        // Update existing config
        const { error } = await supabase
          .from('email_config')
          .update({
            email_id: emailId.trim(),
            email_password: emailPassword.trim(), // Ensure password is trimmed
            from_email_name: fromEmailName.trim()
          })
          .eq('id', existing.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Email configuration updated successfully!' })
      } else {
        // Insert new config
        const { error } = await supabase
          .from('email_config')
          .insert({
            email_id: emailId.trim(),
            email_password: emailPassword.trim(), // Ensure password is trimmed
            from_email_name: fromEmailName.trim()
          })

        if (error) throw error
        setMessage({ type: 'success', text: 'Email configuration saved successfully!' })
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

    if (!emailId.trim() || !emailPassword.trim() || !fromEmailName.trim()) {
      setMessage({ type: 'error', text: 'Please save configuration first' })
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
          email: testEmail.trim(),
          fromEmail: emailId.trim(),
          fromName: fromEmailName.trim(),
          password: emailPassword.trim()
        })
      })

      if (error) {
        console.error('Edge function error:', error)
        throw error
      }

      if (data && data.message) {
        setMessage({ type: 'success', text: 'Test email sent successfully!' })
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

  return (
    <div className="email-config-page">
      <div className="email-config-container">
        <div className="email-config-header">
          <h2>Email Configuration</h2>
          <p className="config-subtitle">Manage your email settings and test email functionality</p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSaveConfiguration} className="email-config-form">
          <div className="form-section">
            <h3>Email Settings</h3>
            
            <div className="form-group">
              <label htmlFor="email_id">Email ID *</label>
              <input
                id="email_id"
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="noreply@dullesgeotechnical.com"
                required
                disabled={loading}
              />
              <small className="form-hint">The email address used for sending emails</small>
            </div>

            <div className="form-group">
              <label htmlFor="email_password">Password *</label>
              <div className="password-input-wrapper">
                <input
                  id="email_password"
                  type={showPassword ? "text" : "password"}
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Enter email password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small className="form-hint">The password for the email account</small>
            </div>

            <div className="form-group">
              <label htmlFor="from_email_name">From Name *</label>
              <input
                id="from_email_name"
                type="text"
                value={fromEmailName}
                onChange={(e) => setFromEmailName(e.target.value)}
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
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>

        <div className="test-section">
          <h3>Test Email Configuration</h3>
          <p className="test-description">Send a test email to verify your configuration is working correctly.</p>
          
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

