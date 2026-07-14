import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SharedJournalEntry {
  id: string;
  content: string;
  title: string | null;
  createdAt: Date;
  sharedAt: Date | null;
  prompted: boolean;
}

export function useSharedPatientJournal(patientId: string | undefined) {
  const [entries, setEntries] = useState<SharedJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, title, prompt_id, created_at, shared_at')
        .eq('user_id', patientId)
        .eq('shared_with_provider', true)
        .order('shared_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setEntries([]);
      } else {
        setEntries(
          (data || []).map((e: any) => ({
            id: e.id,
            content: e.content,
            title: e.title,
            createdAt: new Date(e.created_at),
            sharedAt: e.shared_at ? new Date(e.shared_at) : null,
            prompted: !!e.prompt_id,
          }))
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  return { entries, loading, error };
}