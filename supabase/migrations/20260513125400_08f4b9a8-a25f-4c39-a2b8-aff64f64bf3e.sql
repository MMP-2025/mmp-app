
-- 1. Restrict patient UPDATE on notifications to only read_at/status fields via trigger.
CREATE OR REPLACE FUNCTION public.restrict_patient_notification_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the updater is the provider who owns the notification, allow all changes.
  IF auth.uid() = OLD.provider_id THEN
    RETURN NEW;
  END IF;

  -- Otherwise (patient acting on their own/broadcast notification), only read_at and status may change.
  NEW.provider_id      := OLD.provider_id;
  NEW.patient_id       := OLD.patient_id;
  NEW.title            := OLD.title;
  NEW.message          := OLD.message;
  NEW.type             := OLD.type;
  NEW.priority         := OLD.priority;
  NEW.action_url       := OLD.action_url;
  NEW.action_option_1  := OLD.action_option_1;
  NEW.action_option_2  := OLD.action_option_2;
  NEW.scheduled_at     := OLD.scheduled_at;
  NEW.sent_at          := OLD.sent_at;
  NEW.created_at       := OLD.created_at;

  -- Patients may only set status to 'read'
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'read' THEN
    NEW.status := OLD.status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restrict_patient_notification_update ON public.notifications;
CREATE TRIGGER trg_restrict_patient_notification_update
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.restrict_patient_notification_update();

-- 2. Restrict resource-pdfs storage SELECT to patients of the owning provider (or the provider themselves).
DROP POLICY IF EXISTS "Public read of resource PDF objects" ON storage.objects;

CREATE POLICY "Patients can read PDFs from their providers"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resource-pdfs'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.is_active = true
      AND r.url LIKE '%' || storage.objects.name
      AND (
        r.provider_id = auth.uid()
        OR public.is_patients_provider(auth.uid(), r.provider_id)
      )
  )
);
