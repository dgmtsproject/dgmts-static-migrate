import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      } 
    });
  }

  try {
    const { name, email, message, type, fromEmail, fromName, password, paymentData } = await req.json();

    console.log('Email request received:', { type, name, email });

    // Initialize Supabase client for database access
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

    // Get email configuration from database
    const { data: emailConfig, error: dbError } = await supabase
      .from('email_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (dbError || !emailConfig || !emailConfig.email_id || !emailConfig.email_password) {
      throw new Error("Email configuration not found. Please configure email settings in the admin panel.");
    }

    // Use database credentials with Microsoft 365 SMTP
    const smtpHost = "smtp.office365.com";
    const smtpPort = 587;
    const smtpUser = emailConfig.email_id.trim();
    const smtpPass = emailConfig.email_password.trim();
    const fromEmailName = (emailConfig.from_email_name || "DGMTS").trim();

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const bccEmails = ["iaziz@dullesgeotechnical.com", "info@dullesgeotechnical.com", "qhaider@dullesgeotechnical.com"];
    const paymentCcEmails = ["dgmts.project@gmail.com"];

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    let mailOptions;

    // Handle different email types
    if (type === 'test') {
      // Test email
      if (!email) {
        throw new Error("Missing required field: email");
      }
      mailOptions = {
        from: `${fromEmailName} <${smtpUser}>`,
        to: email,
        subject: "Test Email from DGMTS Email Configuration",
        text: `
TEST EMAIL FROM DGMTS
=====================

This is a test email sent from the DGMTS email configuration system.

If you received this email, your email configuration is working correctly!

Best regards,
DGMTS Email System
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .success-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .label { font-weight: bold; color: #4a90e2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Test Email Successful!</h1>
        <p>DGMTS Email Configuration</p>
    </div>
    
    <div class="content">
        <div class="success-box">
            <h2 style="margin-top: 0; color: #28a745;">Email Configuration Working</h2>
            <p>This is a test email sent from the DGMTS email configuration system.</p>
            <p>If you received this email, your email configuration is working correctly!</p>
        </div>
        
        <p>Best regards,<br><strong>DGMTS Email System</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated test email from the DGMTS email configuration system.</p>
    </div>
</body>
</html>
        `,
      };
    } else if (type === 'payment') {
      // Payment confirmation email
      if (!paymentData || !email) {
        throw new Error("Missing required fields for payment email: paymentData and email");
      }

      const {
        customerName,
        customerEmail,
        customerAddress,
        invoiceNo,
        paymentNote,
        transactionId,
        amount,
        invoiceAmount,
        serviceCharge,
        paymentMethod
      } = paymentData;

      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(amount || 0));

      const formattedInvoiceAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(invoiceAmount || 0));

      const formattedServiceCharge = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(serviceCharge || 0));

      mailOptions = {
        from: `${fromEmailName} <${smtpUser}>`,
        to: customerEmail || email,
        cc: ["accounting@dullesgeotechnical.com", "info@dullesgeotechnical.com"],
        bcc: paymentCcEmails,
        subject: `✅ Payment Confirmation - Invoice #${invoiceNo}`,
        text: `
PAYMENT CONFIRMATION
====================

Dear ${customerName || 'Valued Customer'},

Thank you for your payment! Your transaction has been processed successfully.

TRANSACTION DETAILS:
- Transaction ID: ${transactionId || 'N/A'}
- Invoice Number: ${invoiceNo || 'N/A'}
- Payment Method: ${paymentMethod || 'Credit Card'}
- Payment Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

PAYMENT SUMMARY:
- Invoice Amount: ${formattedInvoiceAmount}
- Service Charge: ${formattedServiceCharge}
- Total Amount Paid: ${formattedAmount}

${paymentNote ? `\nPAYMENT NOTE:\n${paymentNote}\n` : ''}

BILLING INFORMATION:
${customerName ? `Name: ${customerName}` : ''}
${customerEmail ? `Email: ${customerEmail}` : ''}
${customerAddress ? `Address: ${customerAddress}` : ''}

This is a confirmation of your payment. Please keep this email for your records.

If you have any questions about this payment, please contact us at info@dullesgeotechnical.com.

Best regards,
DGMTS Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .success-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745; }
        .billing-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2795d0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .label { font-weight: bold; color: #2795d0; display: inline-block; min-width: 140px; }
        .value { color: #333; }
        .amount { font-size: 1.2em; font-weight: bold; color: #28a745; }
        .note-box { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        h3 { margin-top: 0; color: #2795d0; }
        .divider { border-top: 1px solid #dee2e6; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Payment Confirmation</h1>
        <p>Thank You for Your Payment</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${customerName || 'Valued Customer'}</strong>,</p>
        
        <p>Thank you for your payment! Your transaction has been processed successfully.</p>
        
        <div class="success-box">
            <h2 style="margin-top: 0; color: #28a745;">Payment Received</h2>
            <p>Your payment has been confirmed and processed. Please keep this email for your records.</p>
        </div>
        
        <div class="details-box">
            <h3>Transaction Details</h3>
            <p><span class="label">Transaction ID:</span> <span class="value"><strong>${transactionId || 'N/A'}</strong></span></p>
            <p><span class="label">Invoice Number:</span> <span class="value">${invoiceNo || 'N/A'}</span></p>
            <p><span class="label">Payment Method:</span> <span class="value">${paymentMethod || 'Credit Card'}</span></p>
            <p><span class="label">Payment Date:</span> <span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
        </div>
        
        <div class="summary-box">
            <h3 style="color: #28a745; margin-top: 0;">Payment Summary</h3>
            <div class="divider"></div>
            <p><span class="label">Invoice Amount:</span> <span class="value">${formattedInvoiceAmount}</span></p>
            <p><span class="label">Service Charge:</span> <span class="value">${formattedServiceCharge}</span></p>
            <div class="divider"></div>
            <p><span class="label">Total Amount Paid:</span> <span class="amount">${formattedAmount}</span></p>
        </div>
        
        ${paymentNote ? `
        <div class="note-box">
            <h3 style="margin-top: 0; color: #856404;">Payment Note</h3>
            <p style="margin: 0;">${paymentNote.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <div class="billing-box">
            <h3>Billing Information</h3>
            ${customerName ? `<p><span class="label">Name:</span> <span class="value">${customerName}</span></p>` : ''}
            ${customerEmail ? `<p><span class="label">Email:</span> <span class="value">${customerEmail}</span></p>` : ''}
            ${customerAddress ? `<p><span class="label">Address:</span> <span class="value">${customerAddress}</span></p>` : ''}
        </div>
        
        <p>If you have any questions about this payment, please contact us at <a href="mailto:info@dullesgeotechnical.com">info@dullesgeotechnical.com</a>.</p>
        
        <p>Best regards,<br><strong>DGMTS Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated payment confirmation email from DGMTS.</p>
        <p>Please do not reply to this email. For inquiries, contact info@dullesgeotechnical.com</p>
    </div>
</body>
</html>
        `,
      };
    } else if (type === 'newsletter') {
      // Newsletter subscription welcome email
      const subscriberName = name || email.split('@')[0];
      mailOptions = {
        from: `${fromEmailName} <${smtpUser}>`,
        to: email,
        subject: `🎉 Welcome to DGMTS Newsletter!`,
        bcc: bccEmails,
        text: `
WELCOME TO DGMTS NEWSLETTER
============================

Dear ${subscriberName},

Thank you for subscribing to the DGMTS newsletter! We're excited to have you join our community.

You'll now receive:
• Latest engineering insights and updates
• New blog posts and technical articles
• Company news and announcements
• Industry trends and best practices

We're committed to providing you with valuable content that helps you stay informed about geotechnical engineering, material testing, and related services.

If you have any questions or would like to learn more about our services, please don't hesitate to contact us.

Best regards,
The DGMTS Team

---
You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE" in the subject line.
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2795d0 0%, #28a745 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .welcome-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2795d0; }
        .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { background: #e3f2fd; padding: 2px 6px; border-radius: 4px; }
        .button { background: #2795d0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Welcome to DGMTS Newsletter!</h1>
        <p>Thank You for Subscribing</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${subscriberName}</strong>,</p>
        
        <p>Thank you for subscribing to the DGMTS newsletter! We're excited to have you join our community.</p>
        
        <div class="welcome-box">
            <h3 style="margin-top: 0; color: #2795d0;">What You'll Receive:</h3>
            <ul style="line-height: 2;">
                <li>📰 Latest engineering insights and updates</li>
                <li>📝 New blog posts and technical articles</li>
                <li>📢 Company news and announcements</li>
                <li>🔬 Industry trends and best practices</li>
            </ul>
        </div>
        
        <p>We're committed to providing you with valuable content that helps you stay informed about geotechnical engineering, material testing, and related services.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="https://dullesgeotechnical.com" class="button">Visit Our Website</a>
        </div>
        
        <p>If you have any questions or would like to learn more about our services, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br><strong>The DGMTS Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This email was sent to ${email} because you subscribed to our newsletter.</p>
        <p>You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE" in the subject line.</p>
    </div>
</body>
</html>
        `,
      };
    } else if (type === 'subscriber_notification') {
      // Subscriber notification email (admin-sent updates)
      if (!email || !message) {
        throw new Error("Missing required fields for subscriber notification: email and message");
      }
      const subscriberName = name || email.split('@')[0];
      mailOptions = {
        from: `${fromEmailName} <${smtpUser}>`,
        to: email,
        subject: `📢 Important Update from DGMTS`,
        text: `
IMPORTANT UPDATE FROM DGMTS
============================

Dear ${subscriberName},

${message.replace(/\n/g, '\n')}

Best regards,
The DGMTS Team

---
You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE" in the subject line.
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2795d0 0%, #28a745 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .message-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2795d0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { background: #e3f2fd; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📢 Important Update from DGMTS</h1>
        <p>Newsletter Notification</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${subscriberName}</strong>,</p>
        
        <div class="message-box">
            ${message.replace(/\n/g, '<br>')}
        </div>
        
        <p>Best regards,<br><strong>The DGMTS Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This email was sent to ${email} because you are subscribed to our newsletter.</p>
        <p>You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE" in the subject line.</p>
    </div>
</body>
</html>
        `,
      };
    } else {
      // Contact form submission (default behavior)
      mailOptions = {
        from: `${fromEmailName} Contact Form <${smtpUser}>`,
        to: "info@dullesgeotechnical.com",
        bcc: bccEmails,
        subject: `🔔 New Contact Form Submission from ${name}`,
        text: `
NEW CONTACT FORM SUBMISSION
============================

You have received a new message through your website contact form.

👤 SENDER DETAILS:
Name: ${name}
Email: ${email}

💬 MESSAGE:
${message}

---
This email was sent from your DGMTS website contact form.
Reply directly to this email to respond to ${name}.
      `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .sender-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .label { font-weight: bold; color: #667eea; }
        .highlight { background: #e3f2fd; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 New Contact Form Submission</h1>
        <p>DGMTS Website</p>
    </div>
    
    <div class="content">
        <p>You have received a new message through your website contact form:</p>
        
        <div class="sender-info">
            <h3>👤 Sender Information</h3>
            <p><span class="label">Name:</span> <span class="highlight">${name}</span></p>
            <p><span class="label">Email:</span> <span class="highlight">${email}</span></p>
        </div>
        
        <div class="message-box">
            <h3>💬 Message</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; font-style: italic;">
                ${message.replace(/\n/g, '<br>')}
            </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:${email}?subject=Re: Your message to DGMTS" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                📧 Reply to ${name}
            </a>
        </div>
    </div>
    
    <div class="footer">
        <p>This email was automatically generated from your DGMTS website contact form.</p>
        <p>Simply reply to this email to respond directly to the sender.</p>
    </div>
</body>
</html>
      `,
        replyTo: email,
      };
    }

    // Send email using SMTP
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully: ${info.messageId}`);

    return new Response(JSON.stringify({ 
      message: "Email sent successfully"
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
    });
  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(JSON.stringify({ 
      message: error.message,
      error: error.toString()
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
    });
  }
});
