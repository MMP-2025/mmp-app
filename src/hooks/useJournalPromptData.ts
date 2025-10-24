
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JournalPrompt, JournalPromptDifficulty } from '@/types/provider';

export const useJournalPromptData = () => {
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [newPrompt, setNewPrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: JournalPromptDifficulty;
  }>({
    prompt: '',
    category: '',
    difficulty: 'beginner'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_prompts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJournalPrompts((data || []) as any);
      } catch (error) {
        console.error('Error fetching journal prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  return {
    journalPrompts,
    setJournalPrompts,
    newPrompt,
    setNewPrompt,
    loading
  };
};
