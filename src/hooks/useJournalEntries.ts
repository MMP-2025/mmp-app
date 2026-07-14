import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  content: string;
  date: Date;
  hasPrompt: boolean;
  prompt?: string;
  wordCount: number;
  sharedWithProvider: boolean;
  sharedAt?: Date;
}

export const useJournalEntries = () => {
  const { user, isGuest } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || isGuest) {
      setJournalEntries([]);
      setLoading(false);
      return;
    }

    const fetchJournalEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedEntries: JournalEntry[] = (data || []).map(entry => ({
          id: entry.id,
          content: entry.content,
          date: new Date(entry.created_at),
          hasPrompt: !!entry.prompt_id,
          prompt: entry.title !== entry.content ? entry.title : undefined,
          wordCount: entry.content.trim().split(/\s+/).length,
          sharedWithProvider: !!(entry as any).shared_with_provider,
          sharedAt: (entry as any).shared_at ? new Date((entry as any).shared_at) : undefined,
        }));

        setJournalEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, [user, isGuest]);

  const saveJournalEntry = useCallback(async (
    content: string,
    prompt?: string
  ) => {
    if (!user) {
      throw new Error('You must be logged in to save journal entries');
    }

    try {
      const wordCount = content.trim().split(/\s+/).length;
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          title: prompt || content.substring(0, 100),
          mood: null,
          tags: []
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: JournalEntry = {
        id: data.id,
        content: data.content,
        date: new Date(data.created_at),
        hasPrompt: !!prompt,
        prompt,
        wordCount,
        sharedWithProvider: false,
      };

      setJournalEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }, [user]);

  const shareJournalEntry = useCallback(async (entryId: string) => {
    if (!user) throw new Error('You must be logged in to share journal entries');

    const { data, error } = await supabase
      .from('journal_entries')
      .update({ shared_with_provider: true } as any)
      .eq('id', entryId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setJournalEntries(prev =>
      prev.map(e =>
        e.id === entryId
          ? {
              ...e,
              sharedWithProvider: true,
              sharedAt: (data as any)?.shared_at ? new Date((data as any).shared_at) : new Date(),
            }
          : e
      )
    );
  }, [user]);

  return {
    journalEntries,
    loading,
    saveJournalEntry,
    shareJournalEntry,
  };
};
