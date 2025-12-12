// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';
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
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    });
    // Initialize Supabase client
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { amount, customerName, customerEmail, customerAddress, invoiceNo, paymentNote, originalAmount } = await req.json();
    // Validate required fields
    if (!amount || !customerName || !customerEmail || !invoiceNo || !originalAmount) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Generate temporary transaction ID
    const tempTransactionId = 'txn-' + Date.now() + Math.random().toString(36).substr(2, 9);
    // Insert payment record into Supabase
    const { data: paymentRecord, error: dbError } = await supabaseClient.from('payments').insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: customerAddress,
        invoice_no: invoiceNo,
        payment_note: paymentNote || '',
        amount: originalAmount,
        transaction_id: tempTransactionId,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]).select().single();
    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({
        error: 'Database error: ' + dbError.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: [
        'card',
        'us_bank_account'
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Invoice Number: ${invoiceNo}`
            }
          },
          quantity: 1
        }
      ],
      success_url: `${Deno.env.get('CLIENT_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('CLIENT_URL')}/cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: customerAddress,
        invoice_no: invoiceNo,
        payment_note: paymentNote || '',
        temp_transaction_id: tempTransactionId,
        payment_record_id: paymentRecord.id.toString(),
        amount: originalAmount.toString()
      }
    });
    // Update record with Stripe session ID
    await supabaseClient.from('payments').update({
      transaction_id: session.id,
      status: 'processing'
    }).eq('id', paymentRecord.id);
    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create checkout session: ' + error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
