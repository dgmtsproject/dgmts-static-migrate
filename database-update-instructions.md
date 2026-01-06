# Database Update Instructions - Add Email to Credentials Table

## Overview
This guide explains how to add the `email` field to the `credentials` table in Supabase to support the new "Forgot Password" feature.

## Required Changes

### 1. Add Email Column to Credentials Table

You need to add an `email` column to your `credentials` table in Supabase.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **Table Editor**
3. Select the `credentials` table
4. Click **"+ New Column"**
5. Configure the column:
   - **Name**: `email`
   - **Type**: `text` or `varchar`
   - **Default value**: Leave empty
   - **Allow nullable**: Checked (optional, but recommended)
6. Click **Save**

#### Option B: Using SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Run the following SQL command:

```sql
-- Add email column to credentials table
ALTER TABLE credentials
ADD COLUMN email text;
```

### 2. Add Email Value for Admin User

After adding the column, you need to set the admin email address:

1. In the Supabase dashboard, go to **Table Editor**
2. Select the `credentials` table
3. Find the row where `user` = `'admin'`
4. Edit the row and add the admin email address in the `email` column
5. Save the changes

**OR** using SQL Editor:

```sql
-- Update admin email (replace 'admin@example.com' with your actual admin email)
UPDATE credentials
SET email = 'admin@example.com'
WHERE user = 'admin';
```

### 3. Verify the Changes

To verify the email was added successfully:

```sql
-- Check the credentials table structure and data
SELECT * FROM credentials WHERE user = 'admin';
```

You should see the admin record with the email field populated.

## Testing the Forgot Password Feature

1. Navigate to the admin dashboard login page
2. Click **"Forgot Password?"** link
3. Enter the admin email address you configured
4. If the email matches, you'll be prompted to enter a new password
5. After successfully resetting, you can log in with the new password

## Important Notes

- Make sure to use a valid email address that the admin knows
- The email is used for verification purposes only (no actual emails are sent in the current implementation)
- This feature is designed to ensure only someone who knows the admin email can reset the password
- Keep the admin email secure and don't share it publicly

## Troubleshooting

### Error: "Invalid admin email address"
- Double-check that the email in the database matches exactly what you're entering (case-insensitive comparison)
- Verify the email column was added successfully
- Check for any extra spaces in the stored email

### Error: Column "email" does not exist
- The email column was not added to the credentials table
- Re-run the ALTER TABLE command from Option B above

### Changes not working
- Clear your browser cache and session storage
- Try logging out and accessing the admin dashboard again

