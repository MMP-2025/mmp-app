CREATE OR REPLACE FUNCTION public.is_patients_provider(_patient_id uuid, _provider_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT
    COALESCE(current_setting('request.jwt.claims', true)::jsonb ->> 'aal', '') = 'aal2'
    AND EXISTS (
      SELECT 1 FROM public.patient_provider_relationships
      WHERE patient_id = _patient_id AND provider_id = _provider_id AND status = 'active'
    )
$function$;