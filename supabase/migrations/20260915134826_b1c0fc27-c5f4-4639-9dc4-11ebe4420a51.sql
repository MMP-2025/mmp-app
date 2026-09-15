DROP POLICY IF EXISTS "Providers can create relationships" ON public.patient_provider_relationships;

CREATE UNIQUE INDEX IF NOT EXISTS patient_provider_relationships_pair_key
  ON public.patient_provider_relationships (patient_id, provider_id);

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(nullif(auth.jwt() ->> 'email', ''));
  v_inv public.patient_invitations%ROWTYPE;
BEGIN
  IF v_uid IS NULL OR v_email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  SELECT * INTO v_inv
  FROM public.patient_invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now()
    AND lower(patient_email) = v_email
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  INSERT INTO public.patient_provider_relationships (patient_id, provider_id, status)
  VALUES (v_uid, v_inv.provider_id, 'active')
  ON CONFLICT (patient_id, provider_id)
  DO UPDATE SET status = 'active', updated_at = now();

  UPDATE public.patient_invitations
  SET status = 'used', used_at = now(), patient_id = v_uid
  WHERE id = v_inv.id;

  RETURN json_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.accept_invitation(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;