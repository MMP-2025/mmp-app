import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ExposureGoal {
  id: string;
  user_id: string;
  goal: string;
  description?: string;
  difficulty_level: number;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface ExposureSession {
  id: string;
  user_id: string;
  goal_id?: string;
  anxiety_before: number;
  anxiety_after: number;
  duration?: number;
  notes?: string;
  date: string;
  created_at: string;
}

export const useExposureTherapy = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<ExposureGoal[]>([]);
  const [sessions, setSessions] = useState<ExposureSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('exposure_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) {
        console.error('Error fetching exposure goals:', goalsError);
      } else {
        setGoals(goalsData || []);
      }

      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('exposure_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching exposure sessions:', sessionsError);
      } else {
        setSessions(sessionsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const addGoal = useCallback(async (goalData: Omit<ExposureGoal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    if (!user) {
      toast.error('Please sign in to create exposure goals');
      return;
    }

    const { data, error } = await supabase
      .from('exposure_goals')
      .insert({
        user_id: user.id,
        ...goalData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating exposure goal:', error);
      toast.error('Failed to create goal');
      return;
    }

    if (data) {
      setGoals(prev => [data, ...prev]);
      toast.success('Exposure goal created');
      return data;
    }
  }, [user]);

  const updateGoal = useCallback(async (id: string, updates: Partial<ExposureGoal>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('exposure_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating exposure goal:', error);
      toast.error('Failed to update goal');
      return;
    }

    if (data) {
      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast.success('Goal updated');
    }
  }, [user]);

  const deleteGoal = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('exposure_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting exposure goal:', error);
      toast.error('Failed to delete goal');
      return;
    }

    setGoals(prev => prev.filter(goal => goal.id !== id));
    toast.success('Goal deleted');
  }, [user]);

  const addSession = useCallback(async (sessionData: Omit<ExposureSession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Please sign in to log exposure sessions');
      return;
    }

    const { data, error } = await supabase
      .from('exposure_sessions')
      .insert({
        user_id: user.id,
        ...sessionData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating exposure session:', error);
      toast.error('Failed to log session');
      return;
    }

    if (data) {
      setSessions(prev => [data, ...prev]);
      toast.success('Session logged successfully');
      return data;
    }
  }, [user]);

  const updateSession = useCallback(async (id: string, updates: Partial<ExposureSession>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('exposure_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating exposure session:', error);
      toast.error('Failed to update session');
      return;
    }

    if (data) {
      setSessions(prev => prev.map(session => session.id === id ? data : session));
      toast.success('Session updated');
    }
  }, [user]);

  const deleteSession = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('exposure_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting exposure session:', error);
      toast.error('Failed to delete session');
      return;
    }

    setSessions(prev => prev.filter(session => session.id !== id));
    toast.success('Session deleted');
  }, [user]);

  return {
    goals,
    sessions,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addSession,
    updateSession,
    deleteSession
  };
};
