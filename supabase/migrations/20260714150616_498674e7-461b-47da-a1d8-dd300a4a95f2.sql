
CREATE OR REPLACE FUNCTION public.sync_journal_shared_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.shared_with_provider = true AND NEW.shared_with_provider = false THEN
    RAISE EXCEPTION 'Journal entries cannot be unshared once shared with a therapist.'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.shared_with_provider = true
     AND (TG_OP = 'INSERT' OR OLD.shared_with_provider IS DISTINCT FROM true) THEN
    NEW.shared_at := now();
  END IF;

  RETURN NEW;
END;
$$;
