
-- 1. Close the CDN bypass on resource PDFs
UPDATE storage.buckets SET public = false WHERE id = 'resource-pdfs';

-- 2. Create the missing meditation-audios bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meditation-audios', 'meditation-audios', false, 20971520,
  ARRAY['audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/webm','audio/mp4','audio/aac']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Providers can upload meditation audios" ON storage.objects;
CREATE POLICY "Providers can upload meditation audios"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'meditation-audios'
  AND public.has_role(auth.uid(), 'provider'::app_role)
);

DROP POLICY IF EXISTS "Providers can update own meditation audios" ON storage.objects;
CREATE POLICY "Providers can update own meditation audios"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'meditation-audios' AND public.has_role(auth.uid(), 'provider'::app_role));

DROP POLICY IF EXISTS "Providers can delete own meditation audios" ON storage.objects;
CREATE POLICY "Providers can delete own meditation audios"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'meditation-audios' AND public.has_role(auth.uid(), 'provider'::app_role));

DROP POLICY IF EXISTS "Patients can read meditation audios from their providers" ON storage.objects;
CREATE POLICY "Patients can read meditation audios from their providers"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'meditation-audios'
  AND (
    public.has_role(auth.uid(), 'provider'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.patient_provider_relationships
      WHERE patient_id = auth.uid() AND status = 'active'
    )
  )
);
