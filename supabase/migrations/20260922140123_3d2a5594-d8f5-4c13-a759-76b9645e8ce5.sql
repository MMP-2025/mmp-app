
-- Server-side AAL2 (MFA) enforcement for provider access
CREATE OR REPLACE FUNCTION public.is_verified_provider(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL
     AND _user_id = auth.uid()
     AND public.has_role(_user_id, 'provider'::app_role)
     AND coalesce(
           (current_setting('request.jwt.claims', true)::jsonb ->> 'aal'),
           ''
         ) = 'aal2'
$$;

REVOKE ALL ON FUNCTION public.is_verified_provider(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_verified_provider(uuid) TO authenticated, service_role;

-- journal_entries: route provider reads through AAL2-aware helper
DROP POLICY IF EXISTS "Providers can view shared journal entries" ON public.journal_entries;
CREATE POLICY "Providers can view shared journal entries"
ON public.journal_entries FOR SELECT TO authenticated
USING (shared_with_provider = true AND public.is_patients_provider(user_id, auth.uid()));

-- profiles: provider view of patient profiles
DROP POLICY IF EXISTS "Providers can view their patients profiles" ON public.profiles;
CREATE POLICY "Providers can view their patients profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_patients_provider(id, auth.uid()));

-- notification_responses
DROP POLICY IF EXISTS "Providers can view responses to their notifications" ON public.notification_responses;
CREATE POLICY "Providers can view responses to their notifications"
ON public.notification_responses FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.notifications n
  WHERE n.id = notification_responses.notification_id
    AND n.provider_id = auth.uid()
    AND public.is_verified_provider(auth.uid())
));

-- notifications
DROP POLICY IF EXISTS "Providers can create notifications" ON public.notifications;
CREATE POLICY "Providers can create notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can view their own notifications" ON public.notifications;
CREATE POLICY "Providers can view their own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can update their own notifications" ON public.notifications;
CREATE POLICY "Providers can update their own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can delete their own notifications" ON public.notifications;
CREATE POLICY "Providers can delete their own notifications"
ON public.notifications FOR DELETE TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

-- patient_invitations
DROP POLICY IF EXISTS "Providers can create invitations" ON public.patient_invitations;
CREATE POLICY "Providers can create invitations"
ON public.patient_invitations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can view their own pending invitations" ON public.patient_invitations;
CREATE POLICY "Providers can view their own pending invitations"
ON public.patient_invitations FOR SELECT TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()) AND status = 'pending');

DROP POLICY IF EXISTS "Providers can update their own invitations" ON public.patient_invitations;
CREATE POLICY "Providers can update their own invitations"
ON public.patient_invitations FOR UPDATE TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()))
WITH CHECK (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can delete their own invitations" ON public.patient_invitations;
CREATE POLICY "Providers can delete their own invitations"
ON public.patient_invitations FOR DELETE TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

-- patient_provider_relationships: provider-side status updates
DROP POLICY IF EXISTS "Providers can update their relationships" ON public.patient_provider_relationships;
CREATE POLICY "Providers can update their relationships"
ON public.patient_provider_relationships FOR UPDATE TO authenticated
USING (auth.uid() = provider_id AND public.is_verified_provider(auth.uid()));

-- Provider-authored content tables: writes require AAL2
DROP POLICY IF EXISTS "Providers can insert questions" ON public.questions;
CREATE POLICY "Providers can insert questions" ON public.questions FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own questions" ON public.questions;
CREATE POLICY "Providers can update own questions" ON public.questions FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own questions" ON public.questions;
CREATE POLICY "Providers can delete own questions" ON public.questions FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert quotes" ON public.quotes;
CREATE POLICY "Providers can insert quotes" ON public.quotes FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own quotes" ON public.quotes;
CREATE POLICY "Providers can update own quotes" ON public.quotes FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own quotes" ON public.quotes;
CREATE POLICY "Providers can delete own quotes" ON public.quotes FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert reminders" ON public.reminders;
CREATE POLICY "Providers can insert reminders" ON public.reminders FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own reminders" ON public.reminders;
CREATE POLICY "Providers can update own reminders" ON public.reminders FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own reminders" ON public.reminders;
CREATE POLICY "Providers can delete own reminders" ON public.reminders FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert resources" ON public.resources;
CREATE POLICY "Providers can insert resources" ON public.resources FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own resources" ON public.resources;
CREATE POLICY "Providers can update own resources" ON public.resources FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own resources" ON public.resources;
CREATE POLICY "Providers can delete own resources" ON public.resources FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert toolkit items" ON public.toolkit_items;
CREATE POLICY "Providers can insert toolkit items" ON public.toolkit_items FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own toolkit items" ON public.toolkit_items;
CREATE POLICY "Providers can update own toolkit items" ON public.toolkit_items FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own toolkit items" ON public.toolkit_items;
CREATE POLICY "Providers can delete own toolkit items" ON public.toolkit_items FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert journal prompts" ON public.journal_prompts;
CREATE POLICY "Providers can insert journal prompts" ON public.journal_prompts FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own journal prompts" ON public.journal_prompts;
CREATE POLICY "Providers can update own journal prompts" ON public.journal_prompts FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own journal prompts" ON public.journal_prompts;
CREATE POLICY "Providers can delete own journal prompts" ON public.journal_prompts FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert gratitude prompts" ON public.gratitude_prompts;
CREATE POLICY "Providers can insert gratitude prompts" ON public.gratitude_prompts FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own gratitude prompts" ON public.gratitude_prompts;
CREATE POLICY "Providers can update own gratitude prompts" ON public.gratitude_prompts FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own gratitude prompts" ON public.gratitude_prompts;
CREATE POLICY "Providers can delete own gratitude prompts" ON public.gratitude_prompts FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));

DROP POLICY IF EXISTS "Providers can insert mindfulness exercises" ON public.mindfulness_exercises;
CREATE POLICY "Providers can insert mindfulness exercises" ON public.mindfulness_exercises FOR INSERT TO authenticated
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can update own mindfulness exercises" ON public.mindfulness_exercises;
CREATE POLICY "Providers can update own mindfulness exercises" ON public.mindfulness_exercises FOR UPDATE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()))
WITH CHECK (public.is_verified_provider(auth.uid()));
DROP POLICY IF EXISTS "Providers can delete own mindfulness exercises" ON public.mindfulness_exercises;
CREATE POLICY "Providers can delete own mindfulness exercises" ON public.mindfulness_exercises FOR DELETE TO authenticated
USING (provider_id = auth.uid() AND public.is_verified_provider(auth.uid()));
