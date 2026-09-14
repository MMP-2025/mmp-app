import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Provider MFA recovery.
 *
 * Password alone can NEVER remove an MFA factor. The caller must present a
 * session that was (re)authenticated out-of-band via an email one-time code
 * (Supabase Auth `signInWithOtp` + `verifyOtp`), proving control of the
 * mailbox. We check the JWT's `amr` claim for a recent `otp` / `magiclink`
 * factor before the service role touches any TOTP factor.
 *
 * Responses are intentionally uniform so the endpoint cannot be used to probe
 * whether an address exists or belongs to a provider.
 */

const MAX_VERIFICATION_AGE_SECONDS = 10 * 60;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }
    const token = authHeader.replace('Bearer ', '');

    const authed = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: claimsData, error: claimsErr } = await authed.auth.getClaims(token);
    const claims = claimsData?.claims as
      | { sub?: string; amr?: Array<{ method?: string; timestamp?: number }> }
      | undefined;
    if (claimsErr || !claims?.sub) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // Require a recent out-of-band email verification on this session.
    const nowSec = Math.floor(Date.now() / 1000);
    const emailVerified = (claims.amr ?? []).some(
      (entry) =>
        (entry?.method === 'otp' || entry?.method === 'magiclink') &&
        typeof entry?.timestamp === 'number' &&
        nowSec - entry.timestamp <= MAX_VERIFICATION_AGE_SECONDS,
    );
    if (!emailVerified) {
      return json({ error: 'Email verification required' }, 401);
    }

    const userId = claims.sub;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    // Only provider accounts have enforced MFA — but the response is uniform
    // either way so the endpoint reveals nothing about the account.
    const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', userId);
    const isProvider = (roles ?? []).some((r: { role: string }) => r.role === 'provider');

    if (isProvider) {
      const { data: factors, error: listErr } = await admin.auth.admin.mfa.listFactors({ userId });
      if (listErr) throw listErr;
      for (const f of factors?.factors ?? []) {
        await admin.auth.admin.mfa.deleteFactor({ userId, id: f.id });
      }
    }

    return json({ ok: true });
  } catch (_e) {
    return json({ error: 'Unable to complete request' }, 500);
  }
});
