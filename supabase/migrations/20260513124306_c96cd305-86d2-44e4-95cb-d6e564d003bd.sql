
-- Sensitive tables: only authenticated users, scoped by existing RLS policies
DO $$
DECLARE
  t text;
  sensitive text[] := ARRAY[
    'cbt_sessions','crisis_plans','exposure_goals','exposure_sessions',
    'goal_milestones','goals','gratitude_entries','habit_logs',
    'journal_entries','mindfulness_sessions','mood_entries',
    'notification_responses','notifications','patient_invitations',
    'patient_provider_relationships','profiles','progress_photos',
    'push_subscriptions','user_onboarding','user_reminders',
    'user_roles','wellness_score_history'
  ];
  public_read text[] := ARRAY[
    'gratitude_prompts','journal_prompts','mindfulness_exercises',
    'questions','quotes','reminders','resources','toolkit_items'
  ];
BEGIN
  FOREACH t IN ARRAY sensitive LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, public', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
  END LOOP;

  FOREACH t IN ARRAY public_read LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, public', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- Defaults for any future tables created in public schema:
-- new tables won't auto-grant to anon, only to authenticated (RLS still required).
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
