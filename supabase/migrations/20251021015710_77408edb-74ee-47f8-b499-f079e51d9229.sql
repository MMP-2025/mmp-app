-- Create storage buckets for meditation audios and resource PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('meditation-audios', 'meditation-audios', true),
  ('resource-pdfs', 'resource-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for meditation-audios bucket
CREATE POLICY "Public can view meditation audios"
ON storage.objects FOR SELECT
USING (bucket_id = 'meditation-audios');

CREATE POLICY "Providers can upload meditation audios"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'meditation-audios' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);

CREATE POLICY "Providers can update meditation audios"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'meditation-audios'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);

CREATE POLICY "Providers can delete meditation audios"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'meditation-audios'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);

-- Create RLS policies for resource-pdfs bucket
CREATE POLICY "Public can view resource PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-pdfs');

CREATE POLICY "Providers can upload resource PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-pdfs'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);

CREATE POLICY "Providers can update resource PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resource-pdfs'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);

CREATE POLICY "Providers can delete resource PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resource-pdfs'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.role = 'provider'
  )
);