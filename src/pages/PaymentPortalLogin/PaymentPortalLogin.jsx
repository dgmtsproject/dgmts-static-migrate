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
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regContactPerson, setRegContactPerson] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)
  const [contactPersons, setContactPersons] = useState([])
  const [regLoading, setRegLoading] = useState(false)
  const [regMessage, setRegMessage] = useState({ type: '', text: '' })

  // Forgot Password states
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
    const session = checkPaymentPortalSession()
    if (session && session.isValid) {
      setIsAuthenticated(true)
      navigate('/payment')
    }
    setLoading(false)
  }, [navigate])

  useEffect(() => {
    // Fetch DGMTS contact persons when registration view is shown
    if (view === 'register') {
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
    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirmPassword || !regContactPerson) {
      setRegMessage({ type: 'error', text: 'Please fill in all required fields' })
      setRegLoading(false)
      return
    }

    if (regPassword.length < 6) {
      setRegMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setRegLoading(false)
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegMessage({ type: 'error', text: 'Passwords do not match' })
      setRegLoading(false)
      return
    }

    // Confirm before submission
    const confirmed = window.confirm('Are you sure you want to submit the registration form?')
    if (!confirmed) {
      setRegLoading(false)
      return
    }

    // Register user
    const result = await registerPaymentPortalUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
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
        setRegPassword('')
        setRegConfirmPassword('')
        setRegContactPerson('')
        setView('login')
        setMessage({ type: 'success', text: 'Registration submitted! You will be notified once approved.' })
      }, 3000)
    } else {
      setRegMessage({ type: 'error', text: result.message })
    }

    setRegLoading(false)
  }

  // FORGOT PASSWORD HANDLERS
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setForgotPasswordMessage({ type: '', text: '' })

    if (!forgotEmail) {
      setForgotPasswordMessage({ type: 'error', text: 'Please enter your email address' })
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

    setForgotPasswordMessage({ type: 'success', text: 'Email verified! Please enter your new password.' })
    setForgotPasswordStep(2)
    setResetLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setForgotPasswordMessage({ type: '', text: '' })

    if (!newPassword || !confirmNewPassword) {
      setForgotPasswordMessage({ type: 'error', text: 'Please enter both password fields' })
      setResetLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setForgotPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      setResetLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setForgotPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      setResetLoading(false)
      return
    }

    const result = await resetPaymentPortalPassword(forgotEmail, newPassword)
    
    if (result.success) {
      setForgotPasswordMessage({ type: 'success', text: result.message })
      setTimeout(() => {
        setView('login')
        setForgotPasswordStep(1)
        setForgotEmail('')
        setNewPassword('')
        setConfirmNewPassword('')
        setForgotPasswordMessage({ type: '', text: '' })
        setMessage({ type: 'success', text: 'Password reset successful! Please login with your new password.' })
      }, 2000)
    } else {
      setForgotPasswordMessage({ type: 'error', text: result.message })
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
              <p className="login-subtitle">Create a new account (requires approval)</p>
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
                <label htmlFor="reg-password">
                  <Lock size={18} />
                  Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Enter password (min. 6 characters)"
                    required
                    minLength={6}
                    disabled={regLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                    disabled={regLoading}
                  >
                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">
                  <Lock size={18} />
                  Confirm Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    disabled={regLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                    disabled={regLoading}
                  >
                    {showRegConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
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
              <h2>Reset Password</h2>
              <p className="login-subtitle">
                {forgotPasswordStep === 1 
                  ? 'Enter your email to reset your password' 
                  : 'Enter your new password'}
              </p>
            </div>

            {forgotPasswordStep === 1 ? (
              <form onSubmit={handleVerifyEmail} className="login-form">
                <div className="form-group">
                  <label htmlFor="forgot-email">
                    <Mail size={18} />
                    Email Address
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
                  {resetLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="login-form">
                <div className="form-group">
                  <label htmlFor="new-password">
                    <Lock size={18} />
                    New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      required
                      autoFocus
                      disabled={resetLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      disabled={resetLoading}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-new-password">
                    <Lock size={18} />
                    Confirm New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirm-new-password"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      disabled={resetLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                      disabled={resetLoading}
                    >
                      {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
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
                  {resetLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="back-to-login">
              <button 
                type="button" 
                onClick={() => {
                  setView('login')
                  setForgotPasswordStep(1)
                  setForgotEmail('')
                  setNewPassword('')
                  setConfirmNewPassword('')
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
