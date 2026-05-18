
-- 1. Audit log table (append-only)
CREATE TABLE public.phi_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_role text,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE','SELECT')),
  table_name text NOT NULL,
  row_id uuid,
  patient_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_phi_audit_patient ON public.phi_audit_log (patient_id, occurred_at DESC);
CREATE INDEX idx_phi_audit_actor ON public.phi_audit_log (actor_id, occurred_at DESC);
CREATE INDEX idx_phi_audit_table ON public.phi_audit_log (table_name, occurred_at DESC);

ALTER TABLE public.phi_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phi_audit_log FORCE ROW LEVEL SECURITY;

-- Providers can read audit entries for their own patients
CREATE POLICY "Providers read audit for their patients"
ON public.phi_audit_log
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'provider'::app_role)
  AND patient_id IS NOT NULL
  AND public.is_patients_provider(patient_id, auth.uid())
);

-- Patients can read their own audit trail
CREATE POLICY "Patients read their own audit"
ON public.phi_audit_log
FOR SELECT
TO authenticated
USING (patient_id = auth.uid() OR actor_id = auth.uid());

-- No UPDATE / DELETE policies => append-only

-- 2. Generic trigger to log row mutations on PHI tables.
CREATE OR REPLACE FUNCTION public.log_phi_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_patient uuid;
  v_row uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_patient := OLD.user_id;
    v_row := OLD.id;
  ELSE
    v_patient := NEW.user_id;
    v_row := NEW.id;
  END IF;

  SELECT role::text INTO v_role FROM public.user_roles WHERE user_id = v_actor LIMIT 1;

  INSERT INTO public.phi_audit_log (actor_id, actor_role, action, table_name, row_id, patient_id)
  VALUES (v_actor, v_role, TG_OP, TG_TABLE_NAME, v_row, v_patient);

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- 3. Attach trigger to all PHI tables
DO $$
DECLARE
  t text;
  phi_tables text[] := ARRAY[
    'mood_entries','journal_entries','cbt_sessions','crisis_plans',
    'exposure_goals','exposure_sessions','mindfulness_sessions',
    'progress_photos','wellness_score_history','habit_logs',
    'gratitude_entries','goals'
  ];
BEGIN
  FOREACH t IN ARRAY phi_tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I;', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.log_phi_change();',
      t, t
    );
  END LOOP;
END$$;
