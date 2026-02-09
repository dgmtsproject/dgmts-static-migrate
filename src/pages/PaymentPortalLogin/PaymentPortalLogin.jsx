import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from 'lucide-react'
import { 
  checkPaymentPortalSession, 
  verifyPaymentPortalUser,
  verifyPaymentPortalEmail,
  resetPaymentPortalPassword,
  fetchDGMTSContactPersons,
  registerPaymentPortalUser
} from '../../utils/paymentPortalAuth'
import { sendPaymentPortalRegistration } from '../../utils/emailService'
import './PaymentPortalLogin.css'

function PaymentPortalLogin() {
  // TEMPORARY: Disable payment portal login/registration
  const PORTAL_DISABLED = true;

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [view, setView] = useState('login') // 'login', 'register', 'forgot-password'

  // Sign In states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loginLoading, setLoginLoading] = useState(false)

  // Registration states
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCompanyName, setRegCompanyName] = useState('')
  const [regContactPerson, setRegContactPerson] = useState('')
  const [contactPersons, setContactPersons] = useState([])
  const [regLoading, setRegLoading] = useState(false)
  const [regMessage, setRegMessage] = useState({ type: '', text: '' })

  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotContactPerson, setForgotContactPerson] = useState('')
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState({ type: '', text: '' })
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in via session
    const session = checkPaymentPortalSession()
    if (session && session.isValid) {
      setIsAuthenticated(true)
      navigate('/payment')
    }
    setLoading(false)
  }, [navigate])

  useEffect(() => {
    // Fetch DGMTS contact persons when registration or forgot password view is shown
    if (view === 'register' || view === 'forgot-password') {
      loadContactPersons()
    }
  }, [view])

  const loadContactPersons = async () => {
    const persons = await fetchDGMTSContactPersons()
    setContactPersons(persons)
  }

  // LOGIN HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setMessage({ type: '', text: '' })

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter both email and password' })
      setLoginLoading(false)
      return
    }

    const result = await verifyPaymentPortalUser(email, password)
    
    if (result.success) {
      setIsAuthenticated(true)
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => {
        navigate('/payment')
      }, 1000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    
    setLoginLoading(false)
  }

  // REGISTRATION HANDLERS
  const handleRegistration = async (e) => {
    e.preventDefault()
    setRegLoading(true)
    setRegMessage({ type: '', text: '' })

    // Validation
    if (!regName || !regEmail || !regPhone || !regContactPerson) {
      setRegMessage({ type: 'error', text: 'Please fill in all required fields' })
      setRegLoading(false)
      return
    }

    // Confirm before submission
    const confirmed = window.confirm('Are you sure you want to submit the registration form? The admin will send you a password once approved.')
    if (!confirmed) {
      setRegLoading(false)
      return
    }

    // Register user (without password - admin will set it)
    const result = await registerPaymentPortalUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      companyName: regCompanyName,
      dgmtsContactPerson: regContactPerson
    })

    if (result.success) {
      // Send email notification
      const contactPerson = contactPersons.find(cp => cp.email === regContactPerson)
      const siteUrl = window.location.origin
      
      await sendPaymentPortalRegistration({
        applicantName: regName,
        applicantEmail: regEmail,
        applicantPhone: regPhone,
        applicantCompanyName: regCompanyName || null,
        contactPersonEmail: regContactPerson,
        contactPersonName: contactPerson?.name || 'DGMTS Team',
        userId: result.userId,
        siteUrl: siteUrl
      })

      setRegMessage({ type: 'success', text: result.message })
      
      // Clear form
      setTimeout(() => {
        setRegName('')
        setRegEmail('')
        setRegPhone('')
        setRegCompanyName('')
        setRegContactPerson('')
        setView('login')
        setMessage({ type: 'success', text: 'Registration submitted! You will receive your password via email once approved.' })
      }, 3000)
    } else {
      setRegMessage({ type: 'error', text: result.message })
    }

    setRegLoading(false)
  }

  // FORGOT PASSWORD HANDLERS
  const handlePasswordResetRequest = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setForgotPasswordMessage({ type: '', text: '' })

    if (!forgotEmail || !forgotContactPerson) {
      setForgotPasswordMessage({ type: 'error', text: 'Please fill in all required fields' })
      setResetLoading(false)
      return
    }

    const emailCheck = await verifyPaymentPortalEmail(forgotEmail)
    
    if (!emailCheck.exists) {
      setForgotPasswordMessage({ type: 'error', text: 'Email address not found in our system' })
      setResetLoading(false)
      return
    }

    if (!emailCheck.approved) {
      setForgotPasswordMessage({ 
        type: 'error', 
        text: 'Your account is pending approval. Please contact the administrator.' 
      })
      setResetLoading(false)
      return
    }

    if (emailCheck.denied) {
      setForgotPasswordMessage({ 
        type: 'error', 
        text: 'Your account access has been denied. Please contact the administrator.' 
      })
      setResetLoading(false)
      return
    }

    // Send password reset request email to DGMTS contact person
    const { sendPasswordResetRequest } = await import('../../utils/emailService')
    const contactPerson = contactPersons.find(cp => cp.email === forgotContactPerson)
    
    const result = await sendPasswordResetRequest({
      applicantName: emailCheck.name,
      applicantEmail: forgotEmail,
      contactPersonEmail: forgotContactPerson,
      contactPersonName: contactPerson?.name || 'DGMTS Team',
      siteUrl: window.location.origin,
      userId: emailCheck.userId
    })

    if (result.data) {
      setForgotPasswordMessage({ 
        type: 'success', 
        text: 'Password reset request sent! The DGMTS contact person will send you a new password via email.' 
      })
      
      setTimeout(() => {
        setView('login')
        setForgotEmail('')
        setForgotContactPerson('')
        setForgotPasswordMessage({ type: '', text: '' })
        setMessage({ type: 'success', text: 'Password reset request submitted! Please check your email.' })
      }, 3000)
    } else {
      setForgotPasswordMessage({ type: 'error', text: 'Failed to send password reset request. Please try again.' })
    }
    
    setResetLoading(false)
  }

  if (loading) {
    return (
      <div className="payment-portal-login-page">
        <div className="payment-portal-login-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show disabled message if portal is temporarily disabled
  if (PORTAL_DISABLED) {
    return (
      <div className="payment-portal-login-page">
        <div className="payment-portal-login-container">
          <div className="portal-disabled-message">
            <Lock size={64} className="disabled-icon" />
            <h2>Login & Registration Temporarily Disabled</h2>
            <p>
              Payment portal login and registration are currently disabled.
            </p>
            <p>
              However, you can still make payments directly without logging in.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/payment')}
              style={{ marginTop: '20px' }}
            >
              Go to Payment Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-portal-login-page">
      <div className="payment-portal-login-container">
        {view === 'login' && (
          <>
            <div className="login-header">
              <Lock size={48} className="login-icon" />
              <h2>Payment Portal Login</h2>
              <p className="login-subtitle">Sign in to access the payment portal</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoFocus
                  disabled={loginLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loginLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loginLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {message.type && (
                <div className={`message message-${message.type}`}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loginLoading}
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="form-links">
              <button 
                type="button" 
                onClick={() => setView('forgot-password')} 
                className="link-button"
                disabled={loginLoading}
              >
                Forgot Password?
              </button>
              <span className="link-divider">|</span>
              <button 
                type="button" 
                onClick={() => setView('register')} 
                className="link-button"
                disabled={loginLoading}
              >
                Register
              </button>
            </div>
          </>
        )}

        {view === 'register' && (
          <>
            <div className="login-header">
              <UserPlus size={48} className="login-icon" />
              <h2>Register for Payment Portal</h2>
              <p className="login-subtitle">Submit your registration (admin will send your password)</p>
            </div>

            <form onSubmit={handleRegistration} className="login-form">
              <div className="form-group">
                <label htmlFor="reg-name">
                  <User size={18} />
                  Full Name *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoFocus
                  disabled={regLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">
                  <Mail size={18} />
                  Email Address *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={regLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">
                  <Phone size={18} />
                  Phone Number *
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1234567890"
                  required
                  disabled={regLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-company">
                  Company Name
                </label>
                <input
                  id="reg-company"
                  type="text"
                  value={regCompanyName}
                  onChange={(e) => setRegCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  disabled={regLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-contact">
                  <User size={18} />
                  DGMTS Contact Person *
                </label>
                <select
                  id="reg-contact"
                  value={regContactPerson}
                  onChange={(e) => setRegContactPerson(e.target.value)}
                  required
                  disabled={regLoading}
                >
                  <option value="">Select a contact person</option>
                  {contactPersons.map((person) => (
                    <option key={person.email} value={person.email}>
                      {person.name} ({person.email})
                    </option>
                  ))}
                </select>
                <p className="form-help-text">
                  Your selected contact person will receive your registration request and send you a password once approved.
                </p>
              </div>

              {regMessage.type && (
                <div className={`message message-${regMessage.type}`}>
                  {regMessage.text}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={regLoading}
              >
                {regLoading ? 'Submitting...' : 'Register'}
              </button>
            </form>

            <div className="back-to-login">
              <button 
                type="button" 
                onClick={() => {
                  setView('login')
                  setRegMessage({ type: '', text: '' })
                }} 
                className="link-button"
                disabled={regLoading}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}

        {view === 'forgot-password' && (
          <>
            <div className="login-header">
              <Mail size={48} className="login-icon" />
              <h2>Request Password Reset</h2>
              <p className="login-subtitle">
                Request a new password from your DGMTS contact person
              </p>
            </div>

            <form onSubmit={handlePasswordResetRequest} className="login-form">
              <div className="form-group">
                <label htmlFor="forgot-email">
                  <Mail size={18} />
                  Email Address *
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  autoFocus
                  disabled={resetLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="forgot-contact">
                  <User size={18} />
                  DGMTS Contact Person *
                </label>
                <select
                  id="forgot-contact"
                  value={forgotContactPerson}
                  onChange={(e) => setForgotContactPerson(e.target.value)}
                  required
                  disabled={resetLoading}
                >
                  <option value="">Select your contact person</option>
                  {contactPersons.map((person) => (
                    <option key={person.email} value={person.email}>
                      {person.name} ({person.email})
                    </option>
                  ))}
                </select>
                <p className="form-help-text">
                  Your selected contact person will receive your password reset request and send you a new password via email.
                </p>
              </div>

              {forgotPasswordMessage.type && (
                <div className={`message message-${forgotPasswordMessage.type}`}>
                  {forgotPasswordMessage.text}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={resetLoading}
              >
                {resetLoading ? 'Submitting Request...' : 'Request Password Reset'}
              </button>
            </form>

            <div className="back-to-login">
              <button 
                type="button" 
                onClick={() => {
                  setView('login')
                  setForgotEmail('')
                  setForgotContactPerson('')
                  setForgotPasswordMessage({ type: '', text: '' })
                }} 
                className="link-button"
                disabled={resetLoading}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentPortalLogin
