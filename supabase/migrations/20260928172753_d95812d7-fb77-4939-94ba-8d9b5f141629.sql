-- Adapter for audited tables that do not have a user_id column.
-- Mirrors public.log_phi_change() exactly (same phi_audit_log schema, same changed_columns metadata),
-- resolving the patient id from user_id / patient_id, or via goals for goal_milestones.
-- The existing public.log_phi_change() is NOT modified.
CREATE OR REPLACE FUNCTION public.log_phi_change_mapped()
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
    v_old := to_jsonb(OLD);
  ELSE
    v_new := to_jsonb(NEW);
  END IF;

  v_row := COALESCE(v_new ->> 'id', v_old ->> 'id')::uuid;

  v_patient := COALESCE(
    (v_new ->> 'user_id')::uuid,
    (v_new ->> 'patient_id')::uuid,
    (v_old ->> 'user_id')::uuid,
    (v_old ->> 'patient_id')::uuid
  );

  IF v_patient IS NULL AND TG_TABLE_NAME = 'goal_milestones' THEN
    SELECT g.user_id INTO v_patient
    FROM public.goals g
    WHERE g.id = COALESCE((v_new ->> 'goal_id')::uuid, (v_old ->> 'goal_id')::uuid);
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_changed := ARRAY[]::text[];
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF v_old -> k IS DISTINCT FROM v_new -> k THEN
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

REVOKE EXECUTE ON FUNCTION public.log_phi_change_mapped() FROM PUBLIC, anon, authenticated;

-- user_reminders has user_id: use the existing trigger function unchanged, same pattern as other audited tables
CREATE TRIGGER trg_audit_user_reminders
AFTER INSERT OR UPDATE OR DELETE ON public.user_reminders
FOR EACH ROW EXECUTE FUNCTION public.log_phi_change();

-- Tables without user_id use the adapter
CREATE TRIGGER trg_audit_goal_milestones
AFTER INSERT OR UPDATE OR DELETE ON public.goal_milestones
FOR EACH ROW EXECUTE FUNCTION public.log_phi_change_mapped();

CREATE TRIGGER trg_audit_notifications
AFTER INSERT OR UPDATE OR DELETE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.log_phi_change_mapped();

CREATE TRIGGER trg_audit_notification_responses
AFTER INSERT OR UPDATE OR DELETE ON public.notification_responses
FOR EACH ROW EXECUTE FUNCTION public.log_phi_change_mapped();