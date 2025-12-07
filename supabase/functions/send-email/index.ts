import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";

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
    const { name, email, message, type } = await req.json();

    console.log('Email request received:', { type, name, email });

    // Get SMTP credentials and admin email
    const smtpHost = "smtp.gmail.com";
    const smtpPort = 587;
    const smtpUser = Deno.env.get("SMTP_USERNAME");
    const smtpPass = Deno.env.get("SMTP_PASSWORD");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const bccEmails = ["iaziz@dullesgeotechnical.com", "info@dullesgeotechnical.com", "qhaider@dullesgeotechnical.com"];

    if (!smtpUser || !smtpPass || !adminEmail) {
      throw new Error("Missing SMTP_USERNAME, SMTP_PASSWORD, or ADMIN_EMAIL environment variables");
    }

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
    if (type === 'newsletter') {
      // Newsletter subscription welcome email
      const subscriberName = name || email.split('@')[0];
      mailOptions = {
        from: `DGMTS <${smtpUser}>`,
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
    } else {
      // Contact form submission (default behavior)
      mailOptions = {
        from: `DGMTS Contact Form <${smtpUser}>`,
        to: adminEmail,
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
