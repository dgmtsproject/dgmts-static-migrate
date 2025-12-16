import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, FileText, Mail, Users, Settings } from 'lucide-react'
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth'
import './AdminDashboard.css'

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)

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

  const adminPages = [
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts with rich text editor and image uploads',
      icon: FileText,
      path: '/admin/blog-management',
      color: '#4a90e2'
    },
    {
      title: 'Newsletter Subscribers',
      description: 'Manage subscribers and send professional newsletter emails with rich formatting',
      icon: Users,
      path: '/admin/newsletter-subscribers-list',
      color: '#28a745'
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
        </div>
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

