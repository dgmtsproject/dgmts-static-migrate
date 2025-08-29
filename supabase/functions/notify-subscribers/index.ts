// supabase/functions/notify-subscribers/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"

// Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // service role for DB reads
)

serve(async (req) => {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response("Invalid JSON in request body", { status: 400 });
    }

    const { blogTitle, blogId } = body;
    if (!blogTitle || !blogId) {
      return new Response("Missing blogTitle or blogId in request body", { status: 400 });
    }

    const blogUrl = `${Deno.env.get("WEBSITE_URL")}/blog/${blogId}`
    // Fetch all active subscribers
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email")
      .eq("is_active", true)

    if (error) throw error
    if (!subscribers || subscribers.length === 0) {
      return new Response("No active subscribers", { status: 200 })
    }

    const emails = subscribers.map((s) => s.email)

    // Setup SMTP (Gmail)
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("SMTP_USERNAME") ?? "",
      password: Deno.env.get("SMTP_PASSWORD") ?? "", // App password recommended
    })

    // Send email
    await client.send({
      from: Deno.env.get("SMTP_FROM") ?? "DGMTS Newsletter",
      to: Deno.env.get("SMTP_USERNAME") ?? "", // visible "To" (yourself)
      bcc: emails, // all subscribers in BCC
      subject: `📢 New Blog Published: ${blogTitle}`,
      content: `Hi there,

We just published a new blog post: ${blogTitle}
Read it here: ${blogUrl}

Thanks for subscribing!
`,
    })

    await client.close()

    return new Response("Notification sent successfully", { status: 200 })
  } catch (err) {
    console.error("Error:", err)
    return new Response("Failed to notify subscribers", { status: 500 })
  }
})
