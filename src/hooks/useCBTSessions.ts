import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CBTSession {
  id: string;
  user_id: string;
  date: string;
  module_type: string;
  situation?: string;
  thoughts?: string;
  emotions?: string;
  behaviors?: string;
  alternative_thoughts?: string;
  outcome?: string;
  notes?: string;
  created_at: string;
}

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export const useCBTSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CBTSession[]>([]);
  const [loading, setLoading] = useState(true);

  const modules: CBTModule[] = [
    {
      id: 'thought-challenging',
      title: 'Thought Challenging',
      description: 'Learn to identify and challenge negative thought patterns',
      steps: [
        'Identify the troubling thought',
        'Recognize the emotion it creates',
        'Examine evidence for the thought',
        'Develop a more balanced perspective',
        'Notice how your emotions change'
      ]
    },
    {
      id: 'cognitive-restructuring',
      title: 'Cognitive Restructuring',
      description: 'Replace distorted thoughts with more realistic ones',
      steps: [
        'Catch the negative thought',
        'Identify the cognitive distortion',
        'Challenge the thought with questions',
        'Create a balanced alternative',
        'Practice the new thought pattern'
      ]
    }
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('cbt_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching CBT sessions:', error);
        toast.error('Failed to load CBT sessions');
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user]);

  const addSession = useCallback(async (sessionData: Omit<CBTSession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Please sign in to save CBT sessions');
      return;
    }

    const { data, error } = await supabase
      .from('cbt_sessions')
      .insert({
        user_id: user.id,
        ...sessionData
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving CBT session:', error);
      toast.error('Failed to save CBT session');
      return;
    }

    if (data) {
      setSessions(prev => [data, ...prev]);
      toast.success('CBT session saved successfully');
    }
  }, [user]);

  return {
    sessions,
    modules,
    addSession,
    loading
  };
};
