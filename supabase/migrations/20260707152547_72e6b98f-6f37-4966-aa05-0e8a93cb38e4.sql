
-- 1. Patient invitations: add provider role check + only pending readable
DROP POLICY IF EXISTS "Providers can create invitations" ON public.patient_invitations;
DROP POLICY IF EXISTS "Providers can update their own invitations" ON public.patient_invitations;
DROP POLICY IF EXISTS "Providers can delete their own invitations" ON public.patient_invitations;
DROP POLICY IF EXISTS "Providers can view their own invitations" ON public.patient_invitations;

CREATE POLICY "Providers can create invitations"
ON public.patient_invitations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role));

CREATE POLICY "Providers can update their own invitations"
ON public.patient_invitations FOR UPDATE TO authenticated
USING (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role))
WITH CHECK (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role));

CREATE POLICY "Providers can delete their own invitations"
ON public.patient_invitations FOR DELETE TO authenticated
USING (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role));

-- Providers only see their own PENDING invitations (used/expired tokens no longer readable)
CREATE POLICY "Providers can view their own pending invitations"
ON public.patient_invitations FOR SELECT TO authenticated
USING (auth.uid() = provider_id AND public.has_role(auth.uid(), 'provider'::app_role) AND status = 'pending');

-- 2. Profiles INSERT restricted to patient role (prevents self-elevation)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id AND role = 'patient'::user_role);

-- 3. Notifications: remove patient direct-update; add RPC path
DROP POLICY IF EXISTS "Patients can mark notifications as read" ON public.notifications;

CREATE OR REPLACE FUNCTION public.mark_notification_read(_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_allowed boolean;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.notifications n
    WHERE n.id = _notification_id
      AND (
        n.patient_id = v_uid
        OR (n.patient_id IS NULL AND EXISTS (
          SELECT 1 FROM public.patient_provider_relationships r
          WHERE r.patient_id = v_uid AND r.provider_id = n.provider_id AND r.status = 'active'
        ))
      )
  ) INTO v_allowed;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  UPDATE public.notifications
     SET status = 'read', read_at = now()
   WHERE id = _notification_id;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_notification_read(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_notification_read(uuid) TO authenticated;

-- 4. Meditation audios: scope by provider folder
DROP POLICY IF EXISTS "Providers can upload meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can update own meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Providers can delete own meditation audios" ON storage.objects;
DROP POLICY IF EXISTS "Patients can read meditation audios from their providers" ON storage.objects;

CREATE POLICY "Providers can upload meditation audios"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'meditation-audios'
  AND public.has_role(auth.uid(), 'provider'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can update own meditation audios"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'meditation-audios'
  AND public.has_role(auth.uid(), 'provider'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Providers can delete own meditation audios"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'meditation-audios'
  AND public.has_role(auth.uid(), 'provider'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Meditation audios readable by owning provider or their patients"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'meditation-audios'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_patients_provider(auth.uid(), ((storage.foldername(name))[1])::uuid)
  )
);

-- 5. Switch helper functions to SECURITY INVOKER (they only read tables the caller can already read via RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_patients_provider(_patient_id uuid, _provider_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = _patient_id AND provider_id = _provider_id AND status = 'active'
  )
$function$;

-- 6. Revoke anonymous SELECT from public tables (GraphQL exposure)
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('REVOKE SELECT ON public.%I FROM anon;', t);
  END LOOP;
END $$;
