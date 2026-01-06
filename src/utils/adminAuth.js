import { supabase } from '../supabaseClient'

const SESSION_KEY = 'admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours in milliseconds

export const checkAdminSession = () => {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    if (!sessionData) return false

    const { timestamp } = JSON.parse(sessionData)
    const now = Date.now()
    
    // Check if session is still valid (8 hours)
    if (now - timestamp > SESSION_DURATION) {
      sessionStorage.removeItem(SESSION_KEY)
      return false
    }

    return true
  } catch (err) {
    console.error('Error checking session:', err)
    return false
  }
}

export const setAdminSession = () => {
  try {
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
  } catch (err) {
    console.error('Error setting session:', err)
  }
}

export const clearAdminSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch (err) {
    console.error('Error clearing session:', err)
  }
}

export const verifyAdminPassword = async (password) => {
  try {
    const { data, error } = await supabase
      .from('credentials')
      .select('password')
      .eq('user', 'admin')
      .single()

    if (error) {
      console.error('Error fetching credentials:', error)
      return false
    }

    if (data && data.password === password) {
      setAdminSession()
      return true
    }

    return false
  } catch (err) {
    console.error('Error verifying password:', err)
    return false
  }
}

export const getAdminPassword = async () => {
  try {
    const { data, error } = await supabase
      .from('credentials')
      .select('password')
      .eq('user', 'admin')
      .single()

    if (error) {
      console.error('Error fetching credentials:', error)
      return null
    }

    return data?.password || null
  } catch (err) {
    console.error('Error getting password:', err)
    return null
  }
}

export const updateAdminPassword = async (newPassword) => {
  try {
    const { error } = await supabase
      .from('credentials')
      .update({ password: newPassword })
      .eq('user', 'admin')

    if (error) {
      console.error('Error updating password:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Error updating password:', err)
    return { success: false, error: err.message }
  }
}

export const verifyAdminEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('credentials')
      .select('email')
      .eq('user', 'admin')
      .single()

    if (error) {
      console.error('Error fetching credentials:', error)
      return false
    }

    if (data && data.email && data.email.toLowerCase() === email.toLowerCase().trim()) {
      return true
    }

    return false
  } catch (err) {
    console.error('Error verifying email:', err)
    return false
  }
}

export const resetAdminPasswordWithEmail = async (email, newPassword) => {
  try {
    // First verify the email
    const isValidEmail = await verifyAdminEmail(email)
    if (!isValidEmail) {
      return { success: false, error: 'Invalid email address' }
    }

    // Update the password
    const { error } = await supabase
      .from('credentials')
      .update({ password: newPassword })
      .eq('user', 'admin')

    if (error) {
      console.error('Error updating password:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Error resetting password:', err)
    return { success: false, error: err.message }
  }
}

