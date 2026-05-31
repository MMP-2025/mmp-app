import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// HIPAA right-to-erasure. Deletes the caller's auth user; cascading
// foreign keys / triggers remove their PHI rows. Caller must be
// authenticated; we never accept a user id from the client.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Validate caller JWT with anon client.
    const anon = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await anon.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // PHI tables — wipe explicitly in case FKs aren't configured.
    const tables = [
      'mood_entries', 'journal_entries', 'cbt_sessions', 'crisis_plans',
      'exposure_goals', 'exposure_sessions', 'mindfulness_sessions',
      'progress_photos', 'wellness_score_history', 'habit_logs',
      'gratitude_entries', 'goals', 'user_reminders', 'user_onboarding',
      'push_subscriptions', 'notification_responses', 'user_roles',
    ];
    for (const t of tables) {
      const col = t === 'notification_responses' ? 'patient_id' : 'user_id';
      await admin.from(t).delete().eq(col, userId);
    }
    await admin.from('patient_provider_relationships').delete().eq('patient_id', userId);
    await admin.from('profiles').delete().eq('id', userId);

    // Finally, delete the auth user.
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});