import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  status: string;
  progress: number;
  target_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<{ [goalId: string]: Milestone[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(data || []);
        
        // Fetch milestones for all goals
        if (data && data.length > 0) {
          const { data: milestonesData } = await supabase
            .from('goal_milestones')
            .select('*')
            .in('goal_id', data.map(g => g.id));

          if (milestonesData) {
            const milestonesMap = milestonesData.reduce((acc, milestone) => {
              if (!acc[milestone.goal_id]) {
                acc[milestone.goal_id] = [];
              }
              acc[milestone.goal_id].push(milestone);
              return acc;
            }, {} as { [goalId: string]: Milestone[] });
            setMilestones(milestonesMap);
          }
        }
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user]);

  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to create goals');
      return;
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        ...goalData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
      return;
    }

    if (data) {
      setGoals(prev => [data, ...prev]);
      toast.success('Goal created successfully');
      return data;
    }
  }, [user]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
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
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
      return;
    }

    setGoals(prev => prev.filter(goal => goal.id !== id));
    setMilestones(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    toast.success('Goal deleted');
  }, [user]);

  const addMilestone = useCallback(async (goalId: string, title: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goal_milestones')
      .insert({
        goal_id: goalId,
        title,
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
      return;
    }

    if (data) {
      setMilestones(prev => ({
        ...prev,
        [goalId]: [...(prev[goalId] || []), data]
      }));
      toast.success('Milestone added');
    }
  }, [user]);

  const toggleMilestone = useCallback(async (goalId: string, milestoneId: string, completed: boolean) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goal_milestones')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
      return;
    }

    if (data) {
      setMilestones(prev => ({
        ...prev,
        [goalId]: prev[goalId].map(m => m.id === milestoneId ? data : m)
      }));
    }
  }, [user]);

  const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('goal_milestones')
      .delete()
      .eq('id', milestoneId);

    if (error) {
      console.error('Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
      return;
    }

    setMilestones(prev => ({
      ...prev,
      [goalId]: prev[goalId].filter(m => m.id !== milestoneId)
    }));
    toast.success('Milestone deleted');
  }, [user]);

  return {
    goals,
    milestones,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone
  };
};
