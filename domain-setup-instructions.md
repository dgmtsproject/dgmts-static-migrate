# Setting Up Your Domain with Resend

## Step 1: Add Domain to Resend
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., dgmts.com)

## Step 2: DNS Configuration
Add these DNS records to your domain:

### TXT Record (for verification):
- Name: @ (or root)
- Value: [Resend will provide this]

### CNAME Records (for sending):
- Name: resend._domainkey
- Value: [Resend will provide this]

## Step 3: Update the Edge Function
Once verified, change the 'from' field in your function:

```typescript
from: "DGMTS Contact <contact@yourdomain.com>", // Your verified domain
```

## Step 4: Benefits
- ✅ Your own domain in sender address
- ✅ Better email deliverability
- ✅ Professional appearance
- ✅ No "via resend.dev" warnings
