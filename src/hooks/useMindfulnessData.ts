
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MindfulnessPrompt } from '@/types/provider';

export const useMindfulnessData = () => {
  const [mindfulnessPrompts, setMindfulnessPrompts] = useState<MindfulnessPrompt[]>([]);
  const [newMindfulnessPrompt, setNewMindfulnessPrompt] = useState({
    prompt: '',
    category: '',
    duration: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindfulnessPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('mindfulness_exercises')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMindfulnessPrompts((data || []) as any);
      } catch (error) {
        console.error('Error fetching mindfulness prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindfulnessPrompts();
  }, []);

  return {
    mindfulnessPrompts,
    setMindfulnessPrompts,
    newMindfulnessPrompt,
    setNewMindfulnessPrompt,
    loading
  };
};
