DROP FUNCTION IF EXISTS public.validate_invitation(text);

CREATE FUNCTION public.validate_invitation(p_token text, p_email text)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (SELECT json_build_object('valid', true, 'provider_name', p.name)
     FROM public.patient_invitations i
     JOIN public.profiles p ON p.id = i.provider_id
     WHERE i.token = p_token
       AND i.status = 'pending'
       AND i.expires_at > now()
       AND nullif(btrim(p_email), '') IS NOT NULL
       AND lower(btrim(i.patient_email)) = lower(btrim(p_email))
     LIMIT 1),
    json_build_object('valid', false)
  );
$function$;

REVOKE ALL ON FUNCTION public.validate_invitation(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_invitation(text, text) TO anon, authenticated, service_role;