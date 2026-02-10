
-- Fix 3: Add server-side file validation for storage uploads

-- Drop existing INSERT policies to replace with validated ones
DROP POLICY IF EXISTS "Providers can upload meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can upload resource PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own progress photos" ON storage.objects;

-- Meditation audios: provider only, max 20MB, audio MIME types only
CREATE POLICY "Providers can upload meditation audios"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'meditation-audios'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'provider'::user_role
  )
  AND (storage.extension(name) IN ('mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'webm'))
  AND ((metadata->>'size')::bigint <= 20971520)
);

-- Resource PDFs: provider only, max 20MB, pdf extension only
CREATE POLICY "Providers can upload resource PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-pdfs'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'provider'::user_role
  )
  AND (storage.extension(name) = 'pdf')
  AND ((metadata->>'size')::bigint <= 20971520)
);

-- Progress photos: user owns folder, max 5MB, image extensions only
CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'progress-photos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
  AND ((metadata->>'size')::bigint <= 5242880)
);
