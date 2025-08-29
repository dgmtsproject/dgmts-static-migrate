
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare Deno global for TypeScript
declare const Deno: any;

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
    const { blog_title, blog_url } = await req.json();

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all active subscribers
    const { data: subscribers, error: subsError } = await supabaseAdmin
      .from('subscribers')
      .select('email, name, token')
      .eq('is_active', true);

    if (subsError) {
      throw new Error(`Failed to fetch subscribers: ${subsError.message}`);
    }

    const resendApiKey = Deno.env.get("RESEND_API");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API environment variable");
    }

    for (const subscriber of subscribers) {
      const baseUrl = Deno.env.get("BASE_URL") || "https://dgmts-static.vercel.app";
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${subscriber.token}`;

      const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Blog Post from DGMTS</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="text-align: center; margin-bottom: 30px;">
              <img src="${baseUrl}/assets/img/cropped-logo.png" alt="DGMTS Logo" style="height: 80px;">
              <h1 style="color: #003366; margin: 10px 0;">Dulles Geotechnical and Material Testing Services</h1>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #003366; margin-top: 0;">New Blog Post Published!</h2>
              <p>We have published a new blog post that might interest you:</p>
          </div>

          <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
              <div style="padding: 20px;">
                  <h3 style="color: #003366; margin-top: 0;">${blog_title}</h3>
                  <p style="color: #666; margin-bottom: 15px;">Published on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p>Check out our latest insights and updates from the field.</p>
                  <a href="${blog_url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Read Full Article</a>
              </div>
          </div>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; color: #666;">
              <p>You are receiving this email because you subscribed to the DGMTS newsletter.</p>
              <p>
                  <a href="${unsubscribeUrl}" style="color: #007bff; text-decoration: none;">Unsubscribe from newsletter</a> |
                  <a href="${baseUrl}" style="color: #007bff; text-decoration: none;">Visit our website</a>
              </p>
              <p style="margin-top: 15px; font-size: 12px;">
                  Dulles Geotechnical and Material Testing Services Inc.<br>
                  14155 Sullyfield Circle, Suite H, Chantilly, VA 20151<br>
                  Phone: 703.488.9953 | Email: info@dullesgeotechnical.com
              </p>
          </div>

      </body>
      </html>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DGMTS Blog <onboarding@resend.dev>",
          to: subscriber.email,
          subject: `New Blog Post: ${blog_title}`,
          html: emailHtml,
        }),
      });
    }

    return new Response(JSON.stringify({ 
      message: `Emails sent to ${subscribers.length} subscribers.`
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
    return new Response(JSON.stringify({ 
      message: error.message,
      error: error.toString()
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
        "Access-control-Allow-Methods": "POST, OPTIONS"
      },
    });
  }
});
