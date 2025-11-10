import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WellnessScore, ScoreHistory } from '@/types/wellness';

export const useWellnessScoreHistory = () => {
  const { user } = useAuth();
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('wellness_score_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching wellness score history:', error);
        return;
      }

      setScoreHistory((data || []).map(entry => ({
        ...entry,
        breakdown: entry.breakdown as { [key: string]: number }
      })));
    };

    fetchHistory();
  }, [user]);

  const saveScoreToHistory = useCallback(async (newScore: WellnessScore) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const breakdown = newScore.metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value;
      return acc;
    }, {} as { [key: string]: number });

    const { data, error } = await supabase
      .from('wellness_score_history')
      .upsert({
        user_id: user.id,
        date: today,
        score: newScore.overall,
        breakdown
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving wellness score:', error);
      return;
    }

    if (data) {
      const typedData = {
        ...data,
        breakdown: data.breakdown as { [key: string]: number }
      };
      setScoreHistory(prev => {
        const filtered = prev.filter(entry => entry.date !== today);
        return [typedData, ...filtered].slice(0, 30);
      });
    }
  }, [user]);

  return { scoreHistory, saveScoreToHistory };
};
