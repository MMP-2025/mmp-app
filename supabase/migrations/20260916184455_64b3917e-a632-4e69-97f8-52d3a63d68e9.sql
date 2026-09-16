CREATE OR REPLACE FUNCTION public.end_provider_relationship(p_relationship_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_rel public.patient_provider_relationships%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO v_rel
  FROM public.patient_provider_relationships
  WHERE id = p_relationship_id
    AND (patient_id = v_uid OR provider_id = v_uid);

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_rel.status <> 'active' THEN
    RETURN json_build_object('success', true, 'status', v_rel.status);
  END IF;

  UPDATE public.patient_provider_relationships
  SET status = 'inactive', updated_at = now()
  WHERE id = v_rel.id;

  RETURN json_build_object('success', true, 'status', 'inactive');
END;
$$;

REVOKE ALL ON FUNCTION public.end_provider_relationship(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.end_provider_relationship(uuid) TO authenticated;