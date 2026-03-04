

## Plan: Set Demo Account Passwords

The passwords for `provider@demo.com` and `patient@demo.com` cannot be set via SQL (the `auth` schema is reserved). The approach is to create a temporary edge function that uses the Supabase Admin API to update both passwords to `Password123`.

### Steps

1. **Query existing user IDs** from `auth.users` via a read query to get the UUIDs for both accounts
2. **Create a one-time edge function** (`reset-demo-passwords`) that uses `SUPABASE_SERVICE_ROLE_KEY` to call `supabase.auth.admin.updateUserById()` for both accounts, setting password to `Password123`
3. **Deploy and invoke** the edge function to apply the password changes
4. **Delete the edge function** immediately after use (security best practice -- service-role password reset endpoints should not persist)

### Result
- `provider@demo.com` / `Password123`
- `patient@demo.com` / `Password123`

