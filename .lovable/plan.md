
## Recap — what's already shipped

**Provider security**
- Mandatory MFA (TOTP) for providers via `ProviderMfaGate`, gating `/provider-dashboard`.
- MFA reset edge function (`reset-provider-mfa`).
- Provider idle auto-logout after 30 minutes (`useIdleLogout` on dashboard).
- Provider Audit Log tile reading `phi_audit_log`.

**HIPAA-style audit + access**
- `phi_audit_log` table (append-only, RLS: providers see their patients' trail, patients see their own).
- `log_phi_change()` trigger on 12 PHI tables (INSERT/UPDATE/DELETE).
- Signed-URL TTL for `resource-pdfs` / `meditation-audios` reduced 3600 → 600s.

**Patient rights**
- "Download my data" — client-side JSON export of 14 PHI tables.
- "Delete my account" — `delete-account` edge function (validates caller JWT, wipes PHI, deletes auth user).

**Plus previously**: PWA, scheduled push, role isolation, invitation flow, dark mode, accessibility toolbar, onboarding.

---

## Unclosed loops to close

### Aesthetic / polish
1. **Audit Log table is unstyled** — raw `<table>` with no zebra striping, no row hover, no empty-cell muted treatment. Doesn't match the rest of the dashboard (cards with shadow, peach/blue accents). Should use the shared `Table` shadcn component and add column-icon badges for action type (INSERT green, UPDATE blue, DELETE red).
2. **MFA gate page** uses `bg-gradient-to-b from-sage-light via-background` — `sage-light` isn't in our token system; this renders inconsistently in dark mode. Standardize on existing peach/sage tokens used elsewhere.
3. **DataExportCard buttons stack on mobile** but the parent "Privacy & Data" section now has two stacked cards (the existing description card + the new actions card) with no shared heading — feels duplicative. Merge into one card.
4. **Audit Log tile** uses `bg-mental-gray` — same color as Resources/Toolkit. Should get a distinct treatment (e.g. subtle border accent) so providers notice it.

### Usability
5. **No surfaced indicator that MFA is active** in provider profile — once set up, providers can't see the status or proactively reset it from a settings screen (only via the "lost access" link during challenge). Add a Security section to the provider view of Profile.
6. **"Download my data" gives no progress feedback** for users with lots of data — 14 sequential queries can take 5–10s. Show a per-table progress count.
7. **"Delete my account" confirm uses `window.confirm`** — jarring, not styled, no typed-confirmation safeguard. Replace with shadcn `AlertDialog` requiring the user to type DELETE.
8. **Idle logout fires with no warning** — provider loses unsaved work silently. Add a 60-second "You'll be signed out soon" toast with a "Stay signed in" button before signing out.
9. **Audit log is provider-only in UI** — patients have RLS access to their own audit trail (per policy) but no UI to view it. Add a "Who's accessed my data" section under patient Privacy & Data.
10. **Idle timeout only runs on the dashboard route** — if a provider opens a patient profile or content tab in a new tab, or navigates away mid-session, timer doesn't follow. Move `useIdleLogout` into a provider-scoped layout wrapper or `AuthProvider` gated by `isProvider`.

### Behind the scenes
11. **`delete-account` deletes `user_roles` before `profiles`** but `profiles` has no FK cascade from auth.users — relying on edge function ordering. Add an explicit DB-side cascade (or a `handle_user_deletion` trigger on `auth.users` deletion) so accidental admin deletes don't leave orphan rows.
12. **No DB-level migration for the storage-bucket TTL change** — TTL is enforced only at the call site; if any future code path forgets, links are 1-hour again. Consider a thin `getSignedResourceUrl()` helper and replace direct `createSignedUrl` calls.
13. **`log_phi_change()` does not record `metadata`** (changed columns, before/after) — column exists but is always `{}`. For UPDATE, capture the column diff so the audit trail is actionable.
14. **Provider SELECT reads of PHI are still un-audited** (item #9 from the prior backlog) — open.
15. **No security memory document** — we've made many HIPAA-shaped decisions (intentional public-read on quotes/prompts/reminders, anon access to active content) that future scans will re-flag. Run `security--update_memory` with the accepted-risk inventory.
16. **`useIdleLogout` listeners use `visibilitychange` on window** — should be `document` (the event only fires on document). Currently the visibility reset doesn't work.
17. **Manual Supabase dashboard items still open** — leaked-password protection, OTP expiry ≤10 min, Postgres patch upgrade, BAA, `supabase_admin` default-ACL revoke. These remain user-side.

---

## Proposed scope for this pass

If you say go, I'll close items **1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 15, 16** in one batch (aesthetic + UX + the two behind-the-scenes bug fixes — visibility listener and metadata diff capture, plus the security memory). 

Items **6, 11, 12, 14, 17** are bigger or out-of-scope (DB triggers on `auth.*`, helper refactor, server-side SELECT audit, dashboard toggles) — I'll leave them for a follow-up with their own discussion.

Want me to proceed with that batch, narrow it, or expand it?
