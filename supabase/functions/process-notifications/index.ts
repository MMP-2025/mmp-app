import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Use service role key for admin access to process all notifications
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();

    // Find all pending notifications that are due to be sent
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching pending notifications:', fetchError);
      throw fetchError;
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      console.log('No pending notifications to process');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending notifications to process',
          processed: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`Found ${pendingNotifications.length} pending notifications to process`);

    // Update all pending notifications to 'sent' status
    const notificationIds = pendingNotifications.map(n => n.id);
    
    const { data: updatedNotifications, error: updateError } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_at: now 
      })
      .in('id', notificationIds)
      .select();

    if (updateError) {
      console.error('Error updating notifications:', updateError);
      throw updateError;
    }

    console.log(`Successfully processed ${updatedNotifications?.length || 0} notifications`);

    // In a real implementation, you might:
    // - Send push notifications via a service like Firebase Cloud Messaging
    // - Send email notifications via a service like Resend or SendGrid
    // - Send SMS notifications via Twilio
    // For now, we just mark them as 'sent' so they appear in the patient's inbox

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${updatedNotifications?.length || 0} notifications`,
        processed: updatedNotifications?.length || 0,
        notifications: updatedNotifications?.map(n => ({
          id: n.id,
          title: n.title,
          patient_id: n.patient_id,
          sent_at: n.sent_at
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing notifications:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
