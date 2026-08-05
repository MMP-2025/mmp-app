import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'Not authenticated' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Identify the caller from their bearer token (never trust a user_id in the body).
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: 'Not authenticated' }, 401);
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const requested: string[] = Array.isArray(body?.consent_types)
      ? body.consent_types.filter((t: unknown) => typeof t === 'string')
      : [];
    if (requested.length === 0) {
      return json({ error: 'No consent types supplied' }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // The SERVER decides which versions are current — the client cannot choose them.
    const { data: required, error: reqError } = await admin
      .from('required_consents')
      .select('consent_type, policy_version')
      .eq('is_current', true);

    if (reqError) throw reqError;

    const rows = (required ?? [])
      .filter((r) => requested.includes(r.consent_type))
      .map((r) => ({
        user_id: userId,
        consent_type: r.consent_type,
        policy_version: r.policy_version,
        accepted_at: new Date().toISOString(),
        ip_address:
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('cf-connecting-ip') ||
          null,
        user_agent: req.headers.get('user-agent') || null,
      }));

    if (rows.length === 0) {
      return json({ error: 'No matching current documents' }, 400);
    }

    const { error: insertError } = await admin
      .from('user_consents')
      .upsert(rows, { onConflict: 'user_id,consent_type,policy_version', ignoreDuplicates: true });

    if (insertError) throw insertError;

    return json({ recorded: rows.map((r) => r.consent_type) });
  } catch (error) {
    console.error('record-consent error:', error);
    return json({ error: 'Failed to record consent' }, 500);
  }
});