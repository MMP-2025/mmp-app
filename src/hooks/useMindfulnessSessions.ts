import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MindfulnessSession {
  id: string;
  type: 'meditation' | 'breathing' | 'body_scan';
  duration: number;
  completedAt: number;
  quality?: 'poor' | 'good' | 'excellent';
  notes?: string;
}

export const useMindfulnessSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MindfulnessSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('mindfulness_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        const formattedSessions: MindfulnessSession[] = (data || []).map(session => ({
          id: session.id,
          type: session.session_type as any,
          duration: session.duration,
          completedAt: new Date(session.completed_at).getTime(),
          quality: session.quality as any,
          notes: session.notes || undefined
        }));

        setSessions(formattedSessions);
      } catch (error) {
        console.error('Error fetching mindfulness sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const saveSession = useCallback(async (
    sessionType: 'meditation' | 'breathing' | 'body_scan',
    duration: number,
    quality?: 'poor' | 'good' | 'excellent',
    notes?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mindfulness_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          duration,
          quality,
          notes,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: MindfulnessSession = {
        id: data.id,
        type: data.session_type as any,
        duration: data.duration,
        completedAt: new Date(data.completed_at).getTime(),
        quality: data.quality as any,
        notes: data.notes || undefined
      };

      setSessions(prev => [newSession, ...prev]);
    } catch (error) {
      console.error('Error saving mindfulness session:', error);
      throw error;
    }
  }, [user]);

  return {
    sessions,
    loading,
    saveSession
  };
};
