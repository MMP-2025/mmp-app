# Fix: provider-patient relationship creation

Goal: a relationship row can only exist because a specific patient accepted a specific pending invitation addressed to them.

## Approach

Use a **SECURITY DEFINER RPC** (`public.accept_invitation(p_token text)`), not an Edge Function and not a looser RLS rule.

Why: the check is pure database logic (token lookup, expiry, email match, insert) and must run atomically. An RPC keeps it server-authoritative without a new deployed function or service-role key. The relationship table then needs **no INSERT policy at all** for providers or patients — only the definer function writes to it.

## Changes

Database (one migration):

1. Drop the current permissive INSERT policy on `public.patient_provider_relationships` that lets a provider insert any `patient_id`. No replacement INSERT policy — direct inserts from `authenticated` become impossible.
2. Create `public.accept_invitation(p_token text)` (SECURITY DEFINER, `search_path = public`). It must, in a single transaction:
   - Require `auth.uid()`; resolve the caller's email from `auth.jwt()`.
   - Load the invitation by token where `status = 'pending'` and `expires_at > now()`.
   - Require the invitation's `patient_email` to match the caller's verified email (case-insensitive). This is the binding to the patient; `provider_id` on the invitation is the binding to the provider.
   - Insert `(patient_id = auth.uid(), provider_id = invitation.provider_id, status = 'active')`, `ON CONFLICT DO NOTHING` on the patient/provider pair.
   - Mark the invitation `status = 'used'`, `used_at = now()`, `patient_id = auth.uid()`.
   - Return a generic JSON result; never reveal whether a token exists vs. is expired beyond a single generic failure.
3. `GRANT EXECUTE` on the new function to `authenticated` only (revoke from `anon`, `public`).
4. Leave `is_patients_provider()`, consent policies, AAL2 enforcement, and all SELECT/UPDATE policies untouched.

Application (one file):

- `src/contexts/AuthContext.tsx` — the signup path around lines 150 and 279 currently calls `validate_invitation` for pre-checks and then marks `patient_invitations` used directly. Replace the direct table update with a single `supabase.rpc('accept_invitation', { p_token: token })` call, made after the session exists (post sign-in / post email confirmation), so `auth.uid()` and the email claim are available. Keep `validate_invitation` for the pre-signup display check only.

## Preventing arbitrary provider inserts

- No INSERT policy on the relationship table for `authenticated`.
- Only the definer RPC inserts, and it always uses `auth.uid()` as `patient_id` — a provider calling it can never create a row for someone else.
- `service_role` retains access for edge functions and admin paths.

## Targeted verification

1. Provider attempts a direct insert of a relationship for an arbitrary patient → denied.
2. Patient calls `accept_invitation` with a valid pending invitation sent to their email → active relationship created, invitation marked used.
3. Same token replayed → no second row, generic failure.
4. Patient calls it with a token addressed to a different email → denied, no row.
5. Expired invitation → denied, no row.
6. After a real acceptance, provider with AAL2 can read that patient's data; provider without AAL2 still cannot (confirms `is_patients_provider()` behaviour unchanged).

Out of scope: relationship termination/revocation (tracked separately).
