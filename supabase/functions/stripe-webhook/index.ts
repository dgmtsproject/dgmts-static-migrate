// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';
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
