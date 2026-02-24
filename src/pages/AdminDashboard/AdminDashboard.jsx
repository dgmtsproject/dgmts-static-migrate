import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, FileText, Mail, Users, Settings, CalendarDays, DollarSign, Newspaper } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword, verifyAdminEmail, resetAdminPasswordWithEmail } from '../../utils/adminAuth'
import './AdminDashboard.css'

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: email, 2: new password
  const [forgotEmail, setForgotEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState({ type: '', text: '' })
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in via session
    const isAuthenticated = checkAdminSession()
    if (isAuthenticated) {
      setLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const isValid = await verifyAdminPassword(password)
    if (isValid) {
      setLoggedIn(true)
      setPassword('')
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Invalid password' })
    }
    setLoading(false)
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
    setForgotPasswordStep(1)
    setForgotEmail('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotPasswordMessage({ type: '', text: '' })
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep(1)
    setForgotEmail('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotPasswordMessage({ type: '', text: '' })
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setForgotPasswordMessage({ type: '', text: '' })

    const isValid = await verifyAdminEmail(forgotEmail)
    if (isValid) {
      setForgotPasswordStep(2)
      setForgotPasswordMessage({ type: 'success', text: 'Email verified! Now enter your new password.' })
    } else {
      setForgotPasswordMessage({ type: 'error', text: 'Invalid admin email address' })
    }
    setResetLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      setForgotPasswordMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    if (newPassword !== confirmNewPassword) {
      setForgotPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setForgotPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    setResetLoading(true)
    setForgotPasswordMessage({ type: '', text: '' })

    const result = await resetAdminPasswordWithEmail(forgotEmail, newPassword)

    if (result.success) {
      setForgotPasswordMessage({ type: 'success', text: 'Password reset successfully! You can now login with your new password.' })
      setTimeout(() => {
        handleCloseForgotPassword()
      }, 2000)
    } else {
      setForgotPasswordMessage({ type: 'error', text: result.error || 'Failed to reset password' })
    }

    setResetLoading(false)
  }

  const adminPages = [
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts with rich text editor and image uploads',
      icon: FileText,
      path: '/admin/blog-management',
      color: '#4a90e2'
    },
    {
      title: 'News Management',
      description: 'Manage company announcements, news updates, and project highlights',
      icon: Newspaper,
      path: '/admin/news-management',
      color: '#ff6b35'
    },
    {
      title: 'Event Management',
      description: 'Create, edit, and manage events, workshops, and webinars',
      icon: CalendarDays,
      path: '/admin/event-management',
      color: '#9c27b0'
    },
    {
      title: 'Payments',
      description: 'View and manage production environment payment transactions',
      icon: DollarSign,
      path: '/admin/payments',
      color: '#28a745'
    },
    {
      title: 'Payment Portal Users',
      description: 'View and manage payment portal user approvals and rejections',
      icon: Users,
      path: '/admin/payment-portal-users',
      color: '#e74c3c'
    },
    {
      title: 'Newsletter Subscribers',
      description: 'Manage subscribers and send professional newsletter emails with rich formatting',
      icon: Users,
      path: '/admin/newsletter-subscribers-list',
      color: '#17a2b8'
    },
    {
      title: 'Email Configuration',
      description: 'Configure email settings and test email functionality',
      icon: Mail,
      path: '/admin/email_configuration',
      color: '#ffc107'
    },
    {
      title: 'Change Password',
      description: 'Update your admin password',
      icon: Settings,
      path: '/admin/credentials',
      color: '#6c757d'
    }
  ]

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-login">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-login">
          <h2>Admin Dashboard</h2>
          <p className="login-subtitle">Enter password to access admin panel</p>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="forgot-password-link">
            <button type="button" onClick={handleForgotPasswordClick} className="link-button">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="modal-overlay" onClick={handleCloseForgotPassword}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{forgotPasswordStep === 1 ? 'Verify Admin Email' : 'Reset Password'}</h3>
                <button className="modal-close" onClick={handleCloseForgotPassword}>×</button>
              </div>

              {forgotPasswordStep === 1 ? (
                <form onSubmit={handleVerifyEmail}>
                  <div className="modal-body">
                    <p className="modal-description">
                      Enter the admin email address to verify your identity and reset your password.
                    </p>
                    <div className="form-group">
                      <label htmlFor="forgot-email">Admin Email</label>
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter admin email"
                        required
                        autoFocus
                      />
                    </div>
                    {forgotPasswordMessage.text && (
                      <div className={`message message-${forgotPasswordMessage.type}`}>
                        {forgotPasswordMessage.text}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={handleCloseForgotPassword} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                      {resetLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="modal-body">
                    <p className="modal-description">
                      Email verified successfully! Now enter your new password.
                    </p>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-new-password">Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="confirm-new-password"
                          type={showConfirmNewPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    {forgotPasswordMessage.text && (
                      <div className={`message message-${forgotPasswordMessage.type}`}>
                        {forgotPasswordMessage.text}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={handleCloseForgotPassword} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                      {resetLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your website content and settings</p>
        </div>

        <div className="admin-cards-grid">
          {adminPages.map((page, index) => {
            const IconComponent = page.icon
            return (
              <Link
                key={index}
                to={page.path}
                className="admin-card"
                style={{ '--card-color': page.color }}
              >
                <div className="admin-card-icon">
                  <IconComponent size={32} />
                </div>
                <div className="admin-card-content">
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                </div>
                <div className="admin-card-arrow">
                  →
                </div>
              </Link>
            )
          })}
        </div>

        <div className="admin-dashboard-footer">
          <p>Select a section above to manage your website</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

