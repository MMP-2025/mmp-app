
-- Logged provider read: caseload list
CREATE OR REPLACE FUNCTION public.get_my_patients()
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_provider uuid := auth.uid();
BEGIN
  IF v_provider IS NULL OR NOT public.is_verified_provider(v_provider) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  WITH pats AS (
    SELECT p.id AS pid, p.name AS pname
    FROM public.patient_provider_relationships r
    JOIN public.profiles p ON p.id = r.patient_id
    WHERE r.provider_id = v_provider
      AND r.status = 'active'
  ), logged AS (
    INSERT INTO public.phi_audit_log (actor_id, actor_role, action, table_name, row_id, patient_id, metadata)
    SELECT v_provider, 'provider', 'SELECT', 'profiles', pats.pid, pats.pid,
           jsonb_build_object('source', 'get_my_patients')
    FROM pats
    RETURNING 1
  )
  SELECT pats.pid, pats.pname FROM pats WHERE (SELECT count(*) FROM logged) >= 0;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_patients() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_patients() TO authenticated;

-- Logged provider read: a patient's shared journal entries
CREATE OR REPLACE FUNCTION public.get_shared_patient_journal(p_patient_id uuid)
RETURNS TABLE (
  id uuid,
  content text,
  title text,
  prompt_id uuid,
  created_at timestamptz,
  shared_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_provider uuid := auth.uid();
BEGIN
  IF v_provider IS NULL
     OR NOT public.is_verified_provider(v_provider)
     OR NOT public.is_patients_provider(p_patient_id, v_provider) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  INSERT INTO public.phi_audit_log (actor_id, actor_role, action, table_name, row_id, patient_id, metadata)
  VALUES (v_provider, 'provider', 'SELECT', 'journal_entries', NULL, p_patient_id,
          jsonb_build_object('source', 'get_shared_patient_journal'));

  RETURN QUERY
  SELECT j.id, j.content, j.title, j.prompt_id, j.created_at, j.shared_at
  FROM public.journal_entries j
  WHERE j.user_id = p_patient_id
    AND j.shared_with_provider = true
  ORDER BY j.shared_at DESC NULLS LAST;
END;
$$;

REVOKE ALL ON FUNCTION public.get_shared_patient_journal(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_shared_patient_journal(uuid) TO authenticated;

-- Close the unlogged direct-read paths for providers
DROP POLICY IF EXISTS "Providers can view shared journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Providers can view their patients profiles" ON public.profiles;
