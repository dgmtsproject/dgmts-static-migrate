import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { sendEmail } from '../../utils/emailService'
import './PasswordResetByContact.css'

function PasswordResetByContact() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [userData, setUserData] = useState(null)
  const [userId, setUserId] = useState(null)
  const [showOriginalPassword, setShowOriginalPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      setMessage({ type: 'error', text: 'Invalid password reset link' })
      setLoading(false)
      return
    }

    setUserId(parseInt(userIdParam))
    fetchUserData(parseInt(userIdParam))
  }, [searchParams])

  const fetchUserData = async (id) => {
    try {
      const { data, error } = await supabase
        .from('payment_portal_users')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setMessage({ type: 'error', text: 'User not found' })
        setLoading(false)
        return
      }

      if (!data.approved || data.denied) {
        setMessage({ type: 'error', text: 'This user account is not active' })
        setLoading(false)
        return
      }

      setUserData(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user:', err)
      setMessage({ type: 'error', text: 'Error loading user data' })
      setLoading(false)
    }
  }

  const generateRandomPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
    let password = ''
    
    // Ensure password has at least one lowercase, one uppercase, one number, and one special char
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    password += '0123456789'[Math.floor(Math.random() * 10)]
    password += '!@#$%&*'[Math.floor(Math.random() * 7)]
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    
    setNewPassword(password)
  }

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      setMessage({ type: 'error', text: 'Please enter a new password' })
      return
    }

    if (newPassword.trim().length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    if (!window.confirm(`Are you sure you want to update the password for ${userData.name}? The new password will be sent to their email.`)) {
      return
    }

    setUpdating(true)
    setMessage({ type: '', text: '' })

    try {
      // Update password in database
      const { error: updateError } = await supabase
        .from('payment_portal_users')
        .update({ password: newPassword.trim() })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      // Send email to user with new password
      const emailResult = await sendEmail({
        type: 'payment_portal_password_updated',
        applicantEmail: userData.email,
        applicantName: userData.name,
        newPassword: newPassword.trim(),
        loginUrl: `${window.location.origin}/payment-portal-login`
      })

      if (emailResult.error) {
        console.error('Email error:', emailResult.error)
        setMessage({ 
          type: 'warning', 
          text: 'Password updated successfully, but failed to send email notification. Please inform the user manually.' 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password updated successfully! The new password has been sent to the user via email.' 
        })
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    } catch (err) {
      console.error('Error updating password:', err)
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading && !userData) {
    return (
      <div className="password-reset-page">
        <div className="password-reset-container">
          <Loader className="spinner" size={48} />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (message.type === 'error' && !userData) {
    return (
      <div className="password-reset-page">
        <div className="password-reset-container">
          <div className="error-icon">❌</div>
          <h2>Error</h2>
          <p className="message-error">{message.text}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (message.type === 'success') {
    return (
      <div className="password-reset-page">
        <div className="password-reset-container">
          <CheckCircle size={64} color="#28a745" />
          <h2>Success!</h2>
          <p className="message-success">{message.text}</p>
          <p className="redirect-message">Redirecting to homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="password-reset-page">
      <div className="password-reset-container">
        <div className="header-section">
          <Lock size={48} color="#dc3545" />
          <h2>Reset User Password</h2>
          <p className="subtitle">Update password for payment portal user</p>
        </div>

        {userData && (
          <>
            <div className="user-info-section">
              <h3>User Information</h3>
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{userData.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{userData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{userData.phone}</span>
              </div>
            </div>

            <div className="original-password-section">
              <h3>Current Password</h3>
              <div className="password-display-group">
                <input
                  type={showOriginalPassword ? 'text' : 'password'}
                  value={userData.password || 'Not Set'}
                  readOnly
                  className="password-display"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowOriginalPassword(!showOriginalPassword)}
                  title={showOriginalPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showOriginalPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="new-password-section">
              <h3>New Password</h3>
              <div className="password-input-group">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)..."
                  disabled={updating}
                  className="password-input"
                />
                <button
                  type="button"
                  className="generate-password-button"
                  onClick={generateRandomPassword}
                  disabled={updating}
                  title="Generate Random Password"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <p className="help-text">
                Click the refresh icon to generate a secure random password, or enter your own password (minimum 6 characters).
              </p>
            </div>

            {message.type && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleUpdatePassword}
                disabled={updating}
              >
                {updating ? 'Updating Password...' : 'Update Password & Send Email'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/')}
                disabled={updating}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PasswordResetByContact
