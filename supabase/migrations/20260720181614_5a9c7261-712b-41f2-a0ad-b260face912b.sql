
-- 1. Columns
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS shared_with_provider boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shared_at timestamptz;

-- 2. Provider SELECT policy: only shared entries, only for linked provider
DROP POLICY IF EXISTS "Providers can view shared journal entries" ON public.journal_entries;
CREATE POLICY "Providers can view shared journal entries"
ON public.journal_entries
FOR SELECT
TO authenticated
USING (
  shared_with_provider = true
  AND EXISTS (
    SELECT 1 FROM public.patient_provider_relationships r
    WHERE r.patient_id = journal_entries.user_id
      AND r.provider_id = auth.uid()
      AND r.status = 'active'
  )
);

-- 3. Trigger enforcing one-way sharing + shared_at stamp
DROP TRIGGER IF EXISTS sync_journal_shared_at_trg ON public.journal_entries;
CREATE TRIGGER sync_journal_shared_at_trg
BEFORE INSERT OR UPDATE ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.sync_journal_shared_at();
