-- Capture changed-column diff in phi_audit_log.metadata for UPDATE events.
-- INSERT and DELETE keep an empty metadata object (the row_id is already recorded).
CREATE OR REPLACE FUNCTION public.log_phi_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_patient uuid;
  v_row uuid;
  v_meta jsonb := '{}'::jsonb;
  v_old jsonb;
  v_new jsonb;
  v_changed text[];
  k text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_patient := OLD.user_id;
    v_row := OLD.id;
  ELSE
    v_patient := NEW.user_id;
    v_row := NEW.id;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_changed := ARRAY[]::text[];
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF v_old->k IS DISTINCT FROM v_new->k THEN
        v_changed := array_append(v_changed, k);
      END IF;
    END LOOP;
    v_meta := jsonb_build_object('changed_columns', v_changed);
  END IF;

  SELECT role::text INTO v_role FROM public.user_roles WHERE user_id = v_actor LIMIT 1;

  INSERT INTO public.phi_audit_log (actor_id, actor_role, action, table_name, row_id, patient_id, metadata)
  VALUES (v_actor, v_role, TG_OP, TG_TABLE_NAME, v_row, v_patient, v_meta);

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$function$;