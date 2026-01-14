/**
 * Email Service Utility
 * Sends emails via the DGMTS email API endpoint
 */

const EMAIL_API_ENDPOINT = 'https://imsite.dullesgeotechnical.com/api/dgmts-static/send-mail'

/**
 * Send email via the DGMTS email API
 * @param {Object} emailData - The email data object
 * @param {string} emailData.type - Email type: 'test', 'payment', 'newsletter', 'contact', 'subscriber_notification'
 * @param {string} emailData.email - Recipient email address
 * @param {string} [emailData.name] - Recipient name
 * @param {string} [emailData.message] - Email message content
 * @param {string} [emailData.subject] - Email subject
 * @param {string} [emailData.htmlContent] - HTML content for email
 * @param {Array} [emailData.attachments] - Array of attachment objects {name, url/data, type, size}
 * @param {Array} [emailData.embeddedImages] - Array of embedded images for CID {cid, name, data, type}
 * @param {string} [emailData.token] - Subscriber token for unsubscribe
 * @param {boolean} [emailData.includeHeaderFooter] - Whether to include DGMTS header/footer template
 * @param {Object} [emailData.paymentData] - Payment data for payment emails
 * @returns {Promise<Object>} Response from the email API
 */
export const sendEmail = async (emailData) => {
  try {
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to send email')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Email service error:', error)
    return {
      data: null,
      error: {
        message: error.message || 'Failed to send email',
        details: error.toString()
      }
    }
  }
}

/**
 * Send test email
 * @param {string} email - Test email recipient
 */
export const sendTestEmail = async (email) => {
  return sendEmail({
    type: 'test',
    email
  })
}

/**
 * Send payment confirmation email
 * @param {string} email - Customer email
 * @param {Object} paymentData - Payment details
 */
export const sendPaymentEmail = async (email, paymentData) => {
  return sendEmail({
    type: 'payment',
    email,
    paymentData
  })
}

/**
 * Send newsletter welcome email
 * @param {string} email - Subscriber email
 * @param {string} [name] - Subscriber name
 * @param {string} [token] - Subscriber token
 */
export const sendNewsletterWelcome = async (email, name, token) => {
  return sendEmail({
    type: 'newsletter',
    email,
    name,
    token
  })
}

/**
 * Send contact form email
 * @param {string} name - Sender name
 * @param {string} email - Sender email
 * @param {string} message - Message content
 */
export const sendContactForm = async (name, email, message) => {
  return sendEmail({
    type: 'contact',
    name,
    email,
    message
  })
}

/**
 * Send subscriber notification (admin newsletter)
 * @param {string} email - Subscriber email
 * @param {string} name - Subscriber name
 * @param {string} subject - Email subject
 * @param {string} message - Plain text message
 * @param {string} [htmlContent] - HTML content
 * @param {Array} [attachments] - Array of attachments {name, url/data, type, size}
 * @param {Array} [embeddedImages] - Array of embedded images for CID {cid, name, data, type}
 * @param {string} [token] - Subscriber token
 * @param {boolean} [includeHeaderFooter] - Whether to include DGMTS header/footer template
 * @param {Object} [customHeader] - Custom header settings {backgroundColor, heading, tagline}
 * @param {Object} [customFooter] - Custom footer settings {footerText, linkText, linkUrl}
 * @param {boolean} [isTestMode] - Whether to use secondary email instead of primary
 */
export const sendSubscriberNotification = async (email, name, subject, message, htmlContent, attachments, embeddedImages, token, includeHeaderFooter = false, customHeader = null, customFooter = null, isTestMode = false) => {
  return sendEmail({
    type: 'subscriber_notification',
    email,
    name,
    subject,
    message,
    htmlContent,
    attachments,
    embeddedImages,
    token,
    includeHeaderFooter,
    customHeader,
    customFooter,
    isTestMode
  })
}

