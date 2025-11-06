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
}

export const useJournalEntries = () => {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
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
          wordCount: entry.content.trim().split(/\s+/).length
        }));

        setJournalEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, [user]);

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
        wordCount
      };

      setJournalEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }, [user]);

  return {
    journalEntries,
    loading,
    saveJournalEntry
  };
};
