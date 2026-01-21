import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { sendApprovalEmail, sendDenialEmail } from '../../utils/emailService'
import './PaymentPortalApproval.css'

function PaymentPortalApproval() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [action, setAction] = useState('') // 'approve' or 'deny'
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [denialReason, setDenialReason] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const actionParam = searchParams.get('action')
    const userIdParam = searchParams.get('userId')

    if (!actionParam || !userIdParam || !['approve', 'deny'].includes(actionParam)) {
      setMessage({ type: 'error', text: 'Invalid approval link' })
      setLoading(false)
      return
    }

    setAction(actionParam)
    setUserId(parseInt(userIdParam))
    
    // Fetch user data
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

      setUserData(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user:', err)
      setMessage({ type: 'error', text: 'Error loading user data' })
      setLoading(false)
    }
  }

  // Generate a random password
  const generateRandomPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
    let newPassword = ''
    
    // Ensure password has at least one lowercase, one uppercase, one number, and one special char
    newPassword += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    newPassword += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    newPassword += '0123456789'[Math.floor(Math.random() * 10)]
    newPassword += '!@#$%&*'[Math.floor(Math.random() * 7)]
    
    // Fill the rest randomly
    for (let i = newPassword.length; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('')
    
    setPassword(newPassword)
  }

  // Auto-generate password when action is approve and component loads
  useEffect(() => {
    if (action === 'approve' && !password) {
      generateRandomPassword()
    }
  }, [action])

  const handleConfirm = async () => {
    // Validate password if approving
    if (action === 'approve' && !password.trim()) {
      setMessage({ type: 'error', text: 'Please provide a password for the user' })
      return
    }

    // Validate password length
    if (action === 'approve' && password.trim().length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    // Validate denial reason if denying
    if (action === 'deny' && !denialReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for denial' })
      return
    }

    setLoading(true)

    try {
      let updateData = {}
      
      if (action === 'approve') {
        updateData = { approved: true, denied: false, password: password.trim() }
      } else {
        updateData = { approved: false, denied: true }
      }

      const { error } = await supabase
        .from('payment_portal_users')
        .update(updateData)
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Send email notification to applicant
      if (action === 'approve') {
        await sendApprovalEmail({
          applicantEmail: userData.email,
          applicantName: userData.name,
          userId: userData.email,
          password: password.trim()
        })
      } else {
        await sendDenialEmail({
          applicantEmail: userData.email,
          applicantName: userData.name,
          reason: denialReason.trim()
        })
      }

      setMessage({ 
        type: 'success', 
        text: `User has been ${action === 'approve' ? 'approved' : 'denied'} successfully! Email notification sent.` 
      })
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      console.error(`Error ${action}ing user:`, err)
      setMessage({ type: 'error', text: `Failed to ${action} user. Please try again.` })
      setLoading(false)
    }
  }

  if (loading && !userData) {
    return (
      <div className="approval-page">
        <div className="approval-container">
          <Loader className="spinner" size={48} />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (message.type === 'error' && !userData) {
    return (
      <div className="approval-page">
        <div className="approval-container">
          <XCircle size={64} color="#dc3545" />
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
      <div className="approval-page">
        <div className="approval-container">
          <CheckCircle size={64} color="#28a745" />
          <h2>Success!</h2>
          <p className="message-success">{message.text}</p>
          <p className="redirect-message">Redirecting to homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="approval-page">
      <div className="approval-container">
        {action === 'approve' ? (
          <CheckCircle size={64} color="#28a745" />
        ) : (
          <XCircle size={64} color="#dc3545" />
        )}
        
        <h2>{action === 'approve' ? 'Approve User' : 'Deny User'}</h2>
        <p className="approval-subtitle">
          {action === 'approve' 
            ? 'Are you sure you want to approve this user for payment portal access?' 
            : 'Are you sure you want to deny this user\'s payment portal access?'}
        </p>

        {userData && (
          <div className="user-details">
            <h3>User Details</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{userData.name}</span>
            </div>
            {userData.company && (
              <div className="detail-row">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{userData.company}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userData.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{userData.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${
                userData.approved && !userData.denied ? 'approved' :
                userData.denied ? 'denied' : 'pending'
              }`}>
                {userData.approved && !userData.denied ? 'Approved' :
                 userData.denied ? 'Denied' : 'Pending'}
              </span>
            </div>
          </div>
        )}

        {action === 'approve' && (
          <div className="password-section">
            <label htmlFor="user-password">
              <strong>Set Password for User *</strong>
            </label>
            <div className="password-input-group">
              <input
                type="text"
                id="user-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password for the user (min 6 characters)..."
                disabled={loading}
                required
              />
              <button
                type="button"
                className="generate-password-button"
                onClick={generateRandomPassword}
                disabled={loading}
                title="Generate Random Password"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <p className="help-text">
              A secure password has been auto-generated. Click the refresh icon to generate a new one, or enter your own password (min 6 characters). This password will be sent to the applicant via email.
            </p>
          </div>
        )}

        {action === 'deny' && (
          <div className="denial-reason-section">
            <label htmlFor="denial-reason">
              <strong>Reason for Denial *</strong>
            </label>
            <textarea
              id="denial-reason"
              value={denialReason}
              onChange={(e) => setDenialReason(e.target.value)}
              placeholder="Please provide a reason for denying this application..."
              rows={4}
              disabled={loading}
              required
            />
            <p className="help-text">This reason will be sent to the applicant via email.</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className={`btn ${action === 'approve' ? 'btn-approve' : 'btn-deny'}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approval' : 'Denial'}`}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPortalApproval
