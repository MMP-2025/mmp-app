ALTER TABLE public.user_consents
  ADD COLUMN IF NOT EXISTS ip_address text,
  ADD COLUMN IF NOT EXISTS user_agent text;

CREATE TABLE IF NOT EXISTS public.required_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_type text NOT NULL,
  policy_version text NOT NULL,
  title text NOT NULL,
  route text NOT NULL,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS required_consents_type_version_key
  ON public.required_consents (consent_type, policy_version);

CREATE UNIQUE INDEX IF NOT EXISTS required_consents_one_current_per_type
  ON public.required_consents (consent_type) WHERE is_current;

GRANT SELECT ON public.required_consents TO authenticated;
GRANT ALL ON public.required_consents TO service_role;

ALTER TABLE public.required_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read required consents" ON public.required_consents;
CREATE POLICY "Authenticated users can read required consents"
  ON public.required_consents FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage required consents" ON public.required_consents;
CREATE POLICY "Admins manage required consents"
  ON public.required_consents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_required_consents_updated_at ON public.required_consents;
CREATE TRIGGER update_required_consents_updated_at
  BEFORE UPDATE ON public.required_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.required_consents (consent_type, policy_version, title, route)
VALUES
  ('terms_of_service', 'tos-v1.0', 'Terms of Service', '/terms-of-service'),
  ('privacy_policy', 'privacy-v1.0', 'Privacy Policy', '/privacy-policy'),
  ('notice_of_privacy_practices', 'npp-v1.0', 'Notice of Privacy Practices', '/notice-of-privacy-practices')
ON CONFLICT (consent_type, policy_version) DO NOTHING;

CREATE OR REPLACE FUNCTION public.missing_consents()
RETURNS TABLE (consent_type text, policy_version text, title text, route text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.consent_type, r.policy_version, r.title, r.route
  FROM public.required_consents r
  WHERE r.is_current
    AND auth.uid() IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_consents c
      WHERE c.user_id = auth.uid()
        AND c.consent_type = r.consent_type
        AND c.policy_version = r.policy_version
    )
$$;

REVOKE ALL ON FUNCTION public.missing_consents() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.missing_consents() TO authenticated;