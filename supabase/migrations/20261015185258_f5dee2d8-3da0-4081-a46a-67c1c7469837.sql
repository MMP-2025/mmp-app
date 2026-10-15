DROP POLICY "Providers can update their relationships" ON public.patient_provider_relationships;
CREATE POLICY "Providers can update their relationships"
ON public.patient_provider_relationships
FOR UPDATE TO authenticated
USING ((auth.uid() = provider_id) AND public.is_verified_provider(auth.uid()))
WITH CHECK ((auth.uid() = provider_id) AND public.is_verified_provider(auth.uid()));

CREATE OR REPLACE FUNCTION public.prevent_relationship_party_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.patient_id IS DISTINCT FROM OLD.patient_id
     OR NEW.provider_id IS DISTINCT FROM OLD.provider_id THEN
    RAISE EXCEPTION 'patient_id and provider_id cannot be changed on a relationship'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_relationship_party_change
BEFORE UPDATE ON public.patient_provider_relationships
FOR EACH ROW EXECUTE FUNCTION public.prevent_relationship_party_change();