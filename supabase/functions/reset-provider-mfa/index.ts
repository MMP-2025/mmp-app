import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, password } = await req.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return new Response(JSON.stringify({ error: 'email and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify password by attempting password sign-in (in an isolated client).
    const verifier = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
    const { data: signIn, error: signInErr } = await verifier.auth.signInWithPassword({ email, password });
    if (signInErr || !signIn.user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = signIn.user.id;
    await verifier.auth.signOut();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    // Confirm the user is actually a provider before resetting MFA.
    const { data: roles, error: rolesErr } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    if (rolesErr) throw rolesErr;
    const isProvider = (roles ?? []).some((r: { role: string }) => r.role === 'provider');
    if (!isProvider) {
      return new Response(JSON.stringify({ error: 'MFA reset only available for provider accounts' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: factors, error: listErr } = await admin.auth.admin.mfa.listFactors({ userId });
    if (listErr) throw listErr;
    for (const f of factors?.factors ?? []) {
      await admin.auth.admin.mfa.deleteFactor({ userId, id: f.id });
    }

    return new Response(JSON.stringify({ ok: true, removed: factors?.factors?.length ?? 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});