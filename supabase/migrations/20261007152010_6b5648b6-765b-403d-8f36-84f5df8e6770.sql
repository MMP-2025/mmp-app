DROP POLICY IF EXISTS "Providers can view their patients' progress photos" ON storage.objects;
CREATE POLICY "Providers can view their patients' progress photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'progress-photos'
  AND public.is_verified_provider(auth.uid())
  AND public.is_patients_provider(((storage.foldername(name))[1])::uuid, auth.uid())
);