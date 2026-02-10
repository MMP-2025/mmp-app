
-- Fix 1: Allow providers to view their patients' profiles
CREATE POLICY "Providers can view their patients profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = profiles.id
    AND provider_id = auth.uid()
    AND status = 'active'
  )
);

-- Fix 4: Fix notification RLS policies with inverted is_patients_provider logic
DROP POLICY IF EXISTS "Patients can view their notifications" ON public.notifications;
CREATE POLICY "Patients can view their notifications"
ON public.notifications FOR SELECT
USING (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = auth.uid()
    AND provider_id = notifications.provider_id
    AND status = 'active'
  ))
);

DROP POLICY IF EXISTS "Patients can mark notifications as read" ON public.notifications;
CREATE POLICY "Patients can mark notifications as read"
ON public.notifications FOR UPDATE
USING (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = auth.uid()
    AND provider_id = notifications.provider_id
    AND status = 'active'
  ))
)
WITH CHECK (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = auth.uid()
    AND provider_id = notifications.provider_id
    AND status = 'active'
  ))
);
