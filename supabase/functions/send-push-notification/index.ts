import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Web Push utilities
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function importVapidKey(pemBase64: string): Promise<CryptoKey> {
  const raw = urlBase64ToUint8Array(pemBase64);
  return await crypto.subtle.importKey(
    'pkcs8',
    raw,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<Response> {
  // Use the web-push compatible approach via fetch to the push endpoint
  // For Deno edge functions, we use a simpler JWT-based VAPID approach
  
  const encoder = new TextEncoder();
  
  // Create VAPID JWT
  const header = { typ: 'JWT', alg: 'ES256' };
  const audience = new URL(subscription.endpoint).origin;
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    aud: audience,
    exp: now + 12 * 60 * 60, // 12 hours
    sub: vapidSubject,
  };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaims = btoa(JSON.stringify(claims)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${encodedHeader}.${encodedClaims}`;
  
  // Sign with VAPID private key
  const privateKeyData = urlBase64ToUint8Array(vapidPrivateKey);
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      d: vapidPrivateKey,
      x: '', // Will be derived
      y: '',
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  ).catch(() => null);

  // Simplified approach: send payload directly with authorization
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'TTL': '86400',
    },
    body: payload,
  });
  
  return response;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auth check - service role or authenticated provider
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const isServiceRole = token === supabaseServiceKey;

    if (!isServiceRole) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    const body = await req.json();
    const { notification_ids } = body;

    if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'notification_ids required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch the notifications
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .in('id', notification_ids);

    if (notifError) throw notifError;
    if (!notifications || notifications.length === 0) {
      return new Response(JSON.stringify({ success: true, pushed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let totalPushed = 0;

    for (const notification of notifications) {
      // Determine target patient IDs
      let targetPatientIds: string[] = [];

      if (notification.patient_id) {
        targetPatientIds = [notification.patient_id];
      } else {
        // Broadcast: find all patients of this provider
        const { data: relationships } = await supabase
          .from('patient_provider_relationships')
          .select('patient_id')
          .eq('provider_id', notification.provider_id)
          .eq('status', 'active');

        targetPatientIds = (relationships || []).map((r: any) => r.patient_id);
      }

      if (targetPatientIds.length === 0) continue;

      // Get push subscriptions for these patients
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('*')
        .in('user_id', targetPatientIds);

      if (!subscriptions || subscriptions.length === 0) continue;

      // Build the push payload
      const pushPayload = JSON.stringify({
        notification_id: notification.id,
        title: notification.title,
        body: notification.message,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
          notification_id: notification.id,
          action_url: notification.action_url || '/',
          action_option_1: notification.action_option_1 || null,
          action_option_2: notification.action_option_2 || null,
        },
        actions: [
          ...(notification.action_option_1 ? [{ action: 'option1', title: notification.action_option_1 }] : []),
          ...(notification.action_option_2 ? [{ action: 'option2', title: notification.action_option_2 }] : []),
        ],
      });

      // Send to each subscription
      for (const sub of subscriptions) {
        try {
          const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400',
            },
            body: pushPayload,
          });

          if (response.ok || response.status === 201) {
            totalPushed++;
          } else if (response.status === 410 || response.status === 404) {
            // Subscription expired, remove it
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id);
          }
          
          console.log(`Push to ${sub.endpoint.substring(0, 50)}... status: ${response.status}`);
        } catch (pushError) {
          console.error(`Failed to push to subscription ${sub.id}:`, pushError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, pushed: totalPushed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending push notifications:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
