CREATE OR REPLACE FUNCTION public.has_current_required_consents(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM public.required_consents r
       WHERE r.is_current
         AND NOT EXISTS (
           SELECT 1 FROM public.user_consents c
           WHERE c.user_id = _user_id
             AND c.consent_type = r.consent_type
             AND c.policy_version = r.policy_version
         )
     )
$$;

REVOKE ALL ON FUNCTION public.has_current_required_consents(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_current_required_consents(uuid) TO authenticated, service_role;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'journal_entries','mood_entries','cbt_sessions','crisis_plans',
    'exposure_goals','exposure_sessions','goals','goal_milestones',
    'gratitude_entries','habit_logs','mindfulness_sessions',
    'progress_photos','wellness_score_history','user_reminders',
    'notification_responses'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Requires current consent" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Requires current consent" ON public.%I AS RESTRICTIVE TO authenticated USING (public.has_current_required_consents(auth.uid())) WITH CHECK (public.has_current_required_consents(auth.uid()))',
      t
    );
  END LOOP;
END $$;