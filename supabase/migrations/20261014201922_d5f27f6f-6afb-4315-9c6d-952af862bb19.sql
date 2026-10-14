CREATE OR REPLACE FUNCTION public.get_my_notification_responses(p_limit integer DEFAULT 50)
RETURNS TABLE(id uuid, notification_id uuid, patient_id uuid, response text, responded_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_provider uuid := auth.uid();
BEGIN
  IF v_provider IS NULL
     OR NOT public.is_verified_provider(v_provider)
     OR NOT public.has_current_required_consents(v_provider) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  WITH rows AS (
    SELECT r.id AS rid, r.notification_id AS nid, r.patient_id AS pid, r.response AS resp, r.responded_at AS rat
    FROM public.notification_responses r
    JOIN public.notifications n ON n.id = r.notification_id
    WHERE n.provider_id = v_provider
      AND public.is_patients_provider(r.patient_id, v_provider)
    ORDER BY r.responded_at DESC
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 200)
  ), logged AS (
    INSERT INTO public.phi_audit_log (actor_id, actor_role, action, table_name, row_id, patient_id, metadata)
    SELECT v_provider, 'provider', 'SELECT', 'notification_responses', rows.rid, rows.pid,
           jsonb_build_object('source', 'get_my_notification_responses')
    FROM rows
    RETURNING 1
  )
  SELECT rows.rid, rows.nid, rows.pid, rows.resp, rows.rat
  FROM rows
  WHERE (SELECT count(*) FROM logged) >= 0
  ORDER BY rows.rat DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_notification_responses(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_notification_responses(integer) TO authenticated;

DROP POLICY IF EXISTS "Providers can view responses to their notifications" ON public.notification_responses;