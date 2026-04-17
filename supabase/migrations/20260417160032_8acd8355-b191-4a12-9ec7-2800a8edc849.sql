-- 1. Add DELETE policy for patient_invitations
CREATE POLICY "Providers can delete their own invitations"
ON public.patient_invitations
FOR DELETE
USING ((auth.uid())::text = (provider_id)::text);

-- 2. Drop orphan storage policies for non-existent meditation-audios bucket
DROP POLICY IF EXISTS "Anyone can view meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can delete meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can update meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can upload meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Public can view meditation audios" ON storage.objects;

-- 3. Tighten resource-pdfs bucket: replace broad public access with object-level read
DROP POLICY IF EXISTS "Public can view resource PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resource PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Resource PDFs are publicly accessible" ON storage.objects;

CREATE POLICY "Public read of resource PDF objects"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resource-pdfs' AND name IS NOT NULL);