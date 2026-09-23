CREATE POLICY "Providers can create relationships only from accepted invitations"
ON public.patient_provider_relationships
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = provider_id
  AND public.is_verified_provider(auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.patient_invitations i
    WHERE i.provider_id = patient_provider_relationships.provider_id
      AND i.patient_id = patient_provider_relationships.patient_id
      AND i.status = 'used'
  )
);