// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

// Declare Deno global for TypeScript
declare const Deno: any;
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});
const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const cryptoProvider = Stripe.createSubtleCryptoProvider();
serve(async (req)=>{
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
  if (!signature || !webhookSecret) {
    return new Response('Webhook signature or secret missing', {
      status: 400
    });
  }
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400
    });
  }
  // Handle the event
  switch(event.type){
    case 'checkout.session.completed':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'checkout.session.expired':
      await handleExpiredPayment(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response(JSON.stringify({
    received: true
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
async function handleSuccessfulPayment(session) {
  try {
    const paymentRecordId = session.metadata?.payment_record_id;
    if (!paymentRecordId) {
      console.error('No payment record ID found in session metadata');
      return;
    }

    // Update payment record in Supabase
    const { error } = await supabaseClient.from('payments').update({
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
    }).eq('id', parseInt(paymentRecordId));

    if (error) {
      console.error('Error updating payment record:', error);
    } else {
      console.log('Payment record updated successfully for session:', session.id);

      // Send email notification to admin
      await sendPaymentNotificationEmail(session);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}
async function handleExpiredPayment(session) {
  try {
    const paymentRecordId = session.metadata?.payment_record_id;
    if (!paymentRecordId) {
      console.error('No payment record ID found in session metadata');
      return;
    }
    // Update payment record as expired
    const { error } = await supabaseClient.from('payments').update({
      status: 'expired',
      response: JSON.stringify({
        payment_status: 'expired',
        expired_at: new Date().toISOString()
      }),
      updated_at: new Date().toISOString()
    }).eq('id', parseInt(paymentRecordId));
    if (error) {
      console.error('Error updating expired payment record:', error);
    } else {
      console.log('Payment record marked as expired for session:', session.id);
    }
  } catch (error) {
    console.error('Error handling expired payment:', error);
  }
}

async function sendPaymentNotificationEmail(session) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!resendApiKey || !adminEmail) {
      console.error('Missing RESEND_API or ADMIN_EMAIL environment variables');
      return;
    }

    const customerName = session.metadata?.customer_name || 'N/A';
    const customerEmail = session.customer_email || 'N/A';
    const customerAddress = session.metadata?.customer_address || 'N/A';
    const invoiceNo = session.metadata?.invoice_no || 'N/A';
    const paymentNote = session.metadata?.payment_note || 'N/A';
    const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A';

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DGMTS Payment System <onboarding@resend.dev>",
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

        ${paymentNote && paymentNote.trim() !== '' ? `
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
        reply_to: customerEmail,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error(`Failed to send payment notification email: ${emailResponse.status} - ${errorData}`);
    } else {
      console.log('Payment notification email sent successfully to admin');
    }

  } catch (error) {
    console.error('Error sending payment notification email:', error);
  }
}
