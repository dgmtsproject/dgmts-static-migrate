
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@10.17.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: "2022-11-15",
});

serve(async (req) => {
  const { customerName, customerEmail, customerAddress, invoiceNo, invoiceAmount, paymentNote } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice #${invoiceNo}`,
            },
            unit_amount: Math.round(invoiceAmount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${Deno.env.get("SITE_URL")}/success`,
      cancel_url: `${Deno.env.get("SITE_URL")}/cancel`,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: customerAddress,
        invoice_no: invoiceNo,
        payment_note: paymentNote,
        invoiceAmount: invoiceAmount,
      },
    });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
