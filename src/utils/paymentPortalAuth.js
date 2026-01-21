import { supabase } from '../supabaseClient'

const SESSION_KEY = 'payment_portal_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

export const checkPaymentPortalSession = () => {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    if (!sessionData) return false

    const { timestamp, email } = JSON.parse(sessionData)
    const now = Date.now()
    
    // Check if session is still valid (8 hours)
    if (now - timestamp > SESSION_DURATION) {
      sessionStorage.removeItem(SESSION_KEY)
      return false
    }

    return { isValid: true, email }
  } catch (err) {
    console.error('Error checking session:', err)
    return false
  }
}

export const setPaymentPortalSession = (email, userData) => {
  try {
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true,
      email: email,
      userData: userData
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
  } catch (err) {
    console.error('Error setting session:', err)
  }
}

export const clearPaymentPortalSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch (err) {
    console.error('Error clearing session:', err)
  }
}

export const getSessionUserData = () => {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    if (!sessionData) return null

    const { userData } = JSON.parse(sessionData)
    return userData
  } catch (err) {
    console.error('Error getting user data:', err)
    return null
  }
}

/**
 * Verify user credentials and check approval status
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} - { success: boolean, message: string, userData: object }
 */
export const verifyPaymentPortalUser = async (email, password) => {
  try {
    const { data, error } = await supabase
      .from('payment_portal_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !data) {
      console.error('Error fetching user:', error)
      return { 
        success: false, 
        message: 'Invalid email or password',
        userData: null 
      }
    }

    // Check if password matches (assuming password field exists in the table)
    // Note: In production, passwords should be hashed
    if (data.password !== password) {
      return { 
        success: false, 
        message: 'Invalid email or password',
        userData: null 
      }
    }

    // Check if user is approved
    if (!data.approved) {
      return { 
        success: false, 
        message: 'Your account is pending approval. Please contact the administrator.',
        userData: null 
      }
    }

    // Check if user is denied
    if (data.denied) {
      return { 
        success: false, 
        message: 'Your account access has been denied. Please contact the administrator.',
        userData: null 
      }
    }

    // Set session
    setPaymentPortalSession(email, data)

    return { 
      success: true, 
      message: 'Login successful',
      userData: data 
    }
  } catch (err) {
    console.error('Error verifying user:', err)
    return { 
      success: false, 
      message: 'An error occurred during login. Please try again.',
      userData: null 
    }
  }
}

/**
 * Verify user email exists in the system
 * @param {string} email - User email
 * @returns {Object} - { exists: boolean, approved: boolean, denied: boolean, name: string, userId: number }
 */
export const verifyPaymentPortalEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('payment_portal_users')
      .select('id, email, approved, denied, name')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !data) {
      console.error('Error fetching user email:', error)
      return { exists: false, approved: false, denied: false, name: null, userId: null }
    }

    return { 
      exists: true, 
      approved: data.approved, 
      denied: data.denied,
      name: data.name,
      userId: data.id
    }
  } catch (err) {
    console.error('Error verifying email:', err)
    return { exists: false, approved: false, denied: false, name: null, userId: null }
  }
}

/**
 * Reset password for a user
 * @param {string} email - User email
 * @param {string} newPassword - New password
 * @returns {Object} - { success: boolean, message: string }
 */
export const resetPaymentPortalPassword = async (email, newPassword) => {
  try {
    // First verify the email exists
    const emailCheck = await verifyPaymentPortalEmail(email)
    
    if (!emailCheck.exists) {
      return { 
        success: false, 
        message: 'Email address not found in our system.' 
      }
    }

    if (!emailCheck.approved) {
      return { 
        success: false, 
        message: 'Your account is pending approval. Please contact the administrator.' 
      }
    }

    if (emailCheck.denied) {
      return { 
        success: false, 
        message: 'Your account access has been denied. Please contact the administrator.' 
      }
    }

    // Update the password
    // Note: In production, passwords should be hashed before storing
    const { error } = await supabase
      .from('payment_portal_users')
      .update({ password: newPassword })
      .eq('email', email.toLowerCase().trim())

    if (error) {
      console.error('Error updating password:', error)
      return { 
        success: false, 
        message: 'Failed to update password. Please try again.' 
      }
    }

    return { 
      success: true, 
      message: 'Password reset successful. You can now login with your new password.' 
    }
  } catch (err) {
    console.error('Error resetting password:', err)
    return { 
      success: false, 
      message: 'An error occurred while resetting password. Please try again.' 
    }
  }
}

/**
 * Fetch all DGMTS contact persons for dropdown
 * @returns {Promise<Array>} - Array of contact persons
 */
export const fetchDGMTSContactPersons = async () => {
  try {
    const { data, error } = await supabase
      .from('dgmts_contact_persons')
      .select('email, name')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching contact persons:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error fetching contact persons:', err)
    return []
  }
}

/**
 * Register a new payment portal user (without password - admin will set it)
 * @param {Object} userData - User registration data
 * @returns {Object} - { success: boolean, message: string, userId: number }
 */
export const registerPaymentPortalUser = async (userData) => {
  try {
    const { name, email, phone, dgmtsContactPerson } = userData

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('payment_portal_users')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists.',
        userId: null
      }
    }

    // Insert new user with approved=false, denied=false, and NO password (admin will set it)
    const { data, error } = await supabase
      .from('payment_portal_users')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: null, // Admin will set password upon approval
        approved: false,
        denied: false,
        dgmts_contact_person: dgmtsContactPerson
      }])
      .select()
      .single()

    if (error) {
      console.error('Error registering user:', error)
      return {
        success: false,
        message: 'Failed to register. Please try again.',
        userId: null
      }
    }

    return {
      success: true,
      message: 'Registration successful! Your request is pending approval. You will receive your password via email once approved.',
      userId: data.id
    }
  } catch (err) {
    console.error('Error during registration:', err)
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.',
      userId: null
    }
  }
}
