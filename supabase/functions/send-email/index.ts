import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { name, email, message } = await req.json();

    console.log('Form data received:', { name, email });

    // Get Resend API key and admin email
    const resendApiKey = Deno.env.get("RESEND_API");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!resendApiKey || !adminEmail) {
      throw new Error("Missing RESEND_API or ADMIN_EMAIL environment variables");
    }

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DGMTS Contact Form <onboarding@resend.dev>", // Change this after domain verification
        to: adminEmail,
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
        reply_to: email,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorData}`);
    }

    console.log('Email sent successfully via Resend');

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
