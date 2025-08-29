import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { blogId, blogTitle, blogSlug, blogExcerpt, blogAuthor } = await req.json();

    console.log('New blog post data received:', { blogTitle, blogAuthor });

    // Get environment variables
    const resendApiKey = Deno.env.get("RESEND_API");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const blogBaseUrl = Deno.env.get("BLOG_BASE_URL") || "https://dgmts-static.vercel.app/blog";

    if (!resendApiKey || !supabaseUrl || !supabaseAnonKey || !adminEmail) {
      throw new Error("Missing required environment variables");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query active subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email')
      .eq('is_active', true);

    console.log('Subscribers query result:', { subscribers, error });

    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return new Response(JSON.stringify({ 
        message: "No active subscribers to notify"
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        },
      });
    }

    const bccEmails = subscribers.map(sub => sub.email);
    console.log('BCC emails:', bccEmails);

    const link = `${blogBaseUrl}/${blogSlug}`;

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DGMTS Newsletter <onboarding@resend.dev>", // Change this after domain verification
        to: adminEmail, // Send to admin, BCC to subscribers
        bcc: bccEmails,
        subject: `📰 New Blog Post: ${blogTitle}`,
        text: `
NEW BLOG POST PUBLISHED
========================

A new blog post has been published on DGMTS website.

📝 BLOG DETAILS:
Title: ${blogTitle}
Author: ${blogAuthor}

📖 EXCERPT:
${blogExcerpt}

🔗 Read the full post: ${link}

---
This is an automated newsletter from DGMTS.
If you no longer wish to receive these emails, please unsubscribe.
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
        .blog-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .content-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .label { font-weight: bold; color: #667eea; }
        .highlight { background: #e3f2fd; padding: 2px 6px; border-radius: 4px; }
        .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📰 New Blog Post Published</h1>
        <p>DGMTS Newsletter</p>
    </div>
    
    <div class="content">
        <p>A new blog post has been published on the DGMTS website:</p>
        
        <div class="blog-info">
            <h3>📝 Blog Details</h3>
            <p><span class="label">Title:</span> <span class="highlight">${blogTitle}</span></p>
            <p><span class="label">Author:</span> <span class="highlight">${blogAuthor}</span></p>
        </div>
        
        <div class="content-box">
            <h3>📖 Excerpt</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; font-style: italic;">
                ${blogExcerpt.replace(/\n/g, '<br>')}
            </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="${link}" class="button">📖 Read Full Post</a>
        </div>
    </div>
    
    <div class="footer">
        <p>This email was automatically generated from your DGMTS newsletter subscription.</p>
        <p>If you no longer wish to receive these emails, please <a href="#" style="color: #667eea;">unsubscribe</a>.</p>
    </div>
</body>
</html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorData}`);
    }

    console.log(`Email sent successfully to ${bccEmails.length} subscribers`);

    return new Response(JSON.stringify({ 
      message: `Notification sent to ${bccEmails.length} subscribers`
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
    console.error('Error in notify-subscribers function:', error);
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
