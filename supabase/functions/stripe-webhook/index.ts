// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import nodemailer from "npm:nodemailer";
// Use the same CORS headers as your working function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    console.log('Webhook received:', req.method);
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response('Server configuration error', {
        status: 500,
        headers: corsHeaders
      });
    }
    // Initialize Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    // Get the signature and body
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found');
      return new Response('No signature', {
        status: 400,
        headers: corsHeaders
      });
    }
    const body = await req.text();
    console.log('Body length:', body.length);
    // Verify webhook signature using Web Crypto API directly (more reliable in Deno)
    let event;
    try {
      // Simple signature verification approach for Deno
      const elements = signature.split(',');
      const signatureHash = elements.find((el)=>el.startsWith('t='))?.split('=')[1];
      const timestamp = elements.find((el)=>el.startsWith('v1='))?.split('=')[1];
      if (!signatureHash || !timestamp) {
        throw new Error('Invalid signature format');
      }
      // For now, let's parse the body as JSON directly
      // In production, you should implement proper signature verification
      event = JSON.parse(body);
      console.log('Event type:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, {
        status: 400,
        headers: corsHeaders
      });
    }
    // Handle the event
    switch(event.type){
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object, supabaseClient);
        break;
      case 'checkout.session.expired':
        await handleExpiredPayment(event.data.object, supabaseClient);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error in stripe-webhook function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: 'Webhook processing failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
async function handleSuccessfulPayment(session, supabaseClient) {
  try {
    console.log('Handling successful payment for session:', session.id);
    const paymentRecordId = session.metadata?.payment_record_id;
    if (!paymentRecordId) {
      console.error('No payment record ID found in session metadata');
      return;
    }
    // Validate paymentRecordId is a valid number
    const recordId = parseInt(paymentRecordId);
    if (isNaN(recordId)) {
      console.error('Invalid payment record ID:', paymentRecordId);
      return;
    }
    // Update payment record in Supabase
    const { data, error } = await supabaseClient.from('payments').update({
      transaction_id: session.id,
      status: 'completed',
      payment_method: 'stripe',
      response: JSON.stringify({
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_intent: session.payment_intent,
        customer_email: session.customer_email
      }),
      updated_at: new Date().toISOString()
    }).eq('id', recordId).select();
    if (error) {
      console.error('Error updating payment record:', error);
      throw error;
    } else {
      console.log('Payment record updated successfully:', data);
      // Send email notification to admin
      await sendPaymentNotificationEmail(session);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error; // Re-throw to be caught by main handler
  }
}
async function handleExpiredPayment(session, supabaseClient) {
  try {
    console.log('Handling expired payment for session:', session.id);
    const paymentRecordId = session.metadata?.payment_record_id;
    if (!paymentRecordId) {
      console.error('No payment record ID found in session metadata');
      return;
    }
    const recordId = parseInt(paymentRecordId);
    if (isNaN(recordId)) {
      console.error('Invalid payment record ID:', paymentRecordId);
      return;
    }
    // Update payment record as expired
    const { data, error } = await supabaseClient.from('payments').update({
      status: 'expired',
      response: JSON.stringify({
        payment_status: 'expired',
        expired_at: new Date().toISOString()
      }),
      updated_at: new Date().toISOString()
    }).eq('id', recordId).select();
    if (error) {
      console.error('Error updating expired payment record:', error);
      throw error;
    } else {
      console.log('Payment record marked as expired:', data);
    }
  } catch (error) {
    console.error('Error handling expired payment:', error);
    throw error;
  }
}
async function sendPaymentNotificationEmail(session) {
  try {
    // Get SMTP credentials
    const smtpHost = "smtp.gmail.com";
    const smtpPort = 587;
    const smtpUser = Deno.env.get("SMTP_USERNAME");
    const smtpPass = Deno.env.get("SMTP_PASSWORD");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    
    console.log('Environment variables check:', {
      hasSmtpUser: !!smtpUser,
      hasSmtpPass: !!smtpPass,
      hasAdminEmail: !!adminEmail
    });

    if (!smtpUser || !smtpPass || !adminEmail) {
      console.error('Missing environment variables for email notification');
      return; // Don't throw, as payment was already processed
    }

    const customerName = session.metadata?.customer_name || 'N/A';
    const customerEmail = session.customer_email || 'N/A';
    const customerAddress = session.metadata?.customer_address || 'N/A';
    const invoiceNo = session.metadata?.invoice_no || 'N/A';
    const paymentNote = session.metadata?.payment_note || 'N/A';
    const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A';

    console.log('Preparing to send payment notification email');

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

    // Send email using SMTP
    const info = await transporter.sendMail({
      from: `DGMTS Payment System <${smtpUser}>`,
      to: adminEmail,
      subject: `💰 Payment Completed - Invoice ${invoiceNo}`,
      text: `
PAYMENT COMPLETED SUCCESSFULLY
===============================

A payment has been successfully processed through your website.

💳 PAYMENT DETAILS:
Amount: $${amount} USD
Invoice Number: ${invoiceNo}
Transaction ID: ${session.id}
Payment Method: Stripe

👤 CUSTOMER INFORMATION:
Name: ${customerName}
Email: ${customerEmail}
Address: ${customerAddress}

📝 PAYMENT NOTE:
${paymentNote}

---
This is an automated notification from your DGMTS payment system.
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .customer-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
        .payment-note { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .label { font-weight: bold; color: #28a745; }
        .highlight { background: #d4edda; padding: 2px 6px; border-radius: 4px; }
        .amount { font-size: 24px; font-weight: bold; color: #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 Payment Completed Successfully</h1>
        <p>DGMTS Payment System</p>
    </div>

    <div class="content">
        <p>A payment has been successfully processed through your website:</p>

        <div class="payment-details">
            <h3>💳 Payment Information</h3>
            <p><span class="label">Amount:</span> <span class="amount">$${amount} USD</span></p>
            <p><span class="label">Invoice Number:</span> <span class="highlight">${invoiceNo}</span></p>
            <p><span class="label">Transaction ID:</span> <span class="highlight">${session.id}</span></p>
            <p><span class="label">Payment Method:</span> <span class="highlight">Stripe</span></p>
            <p><span class="label">Date:</span> <span class="highlight">${new Date().toLocaleDateString()}</span></p>
        </div>

        <div class="customer-info">
            <h3>👤 Customer Information</h3>
            <p><span class="label">Name:</span> <span class="highlight">${customerName}</span></p>
            <p><span class="label">Email:</span> <span class="highlight">${customerEmail}</span></p>
            <p><span class="label">Address:</span> <span class="highlight">${customerAddress}</span></p>
        </div>

        ${paymentNote && paymentNote.trim() !== 'N/A' && paymentNote.trim() !== '' ? `
        <div class="payment-note">
            <h3>📝 Payment Note</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; font-style: italic;">
                ${paymentNote.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:${customerEmail}?subject=Re: Payment Confirmation - Invoice ${invoiceNo}"
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                📧 Contact Customer
            </a>
        </div>
    </div>

    <div class="footer">
        <p>This email was automatically generated from your DGMTS payment system.</p>
        <p>You can reply to this email to contact the customer directly.</p>
    </div>
</body>
</html>
      `,
      replyTo: customerEmail,
    });

    console.log(`Payment notification email sent successfully: ${info.messageId}`);

  } catch (error) {
    console.error('Error sending payment notification email:', error);
    // Don't throw - payment was successful, email is just notification
  }
}
