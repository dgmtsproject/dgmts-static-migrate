
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@10.17.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: "2025-07-30.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON_KEY")
);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { customer_name, customer_email, customer_address, invoice_no, payment_note, invoiceAmount } = session.metadata;

      const { error } = await supabase.from("payments").insert([
        {
          customer_name,
          customer_email,
          customer_address,
          invoice_no,
          payment_note,
          amount: invoiceAmount,
          transaction_id: session.id,
          status: session.payment_status,
          payment_method: session.payment_method_types[0],
          response: JSON.stringify(session),
        },
      ]);

      if (error) {
        console.error("Error inserting payment data:", error);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
