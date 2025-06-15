
import { useState, useEffect, useCallback } from 'react';
import { StorageManager } from '@/utils/storage';
import type { WellnessScore, ScoreHistory } from '@/types/wellness';

export const useWellnessScoreHistory = () => {
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);

  useEffect(() => {
    const history = StorageManager.load<ScoreHistory[]>('wellness_score_history', []);
    setScoreHistory(history);
  }, []);

  const saveScoreToHistory = useCallback((newScore: WellnessScore) => {
    const today = new Date().toISOString().split('T')[0];
    
    const breakdown = newScore.metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value;
      return acc;
    }, {} as { [key: string]: number });

    const newEntry: ScoreHistory = {
      date: today,
      score: newScore.overall,
      breakdown
    };

    setScoreHistory(prevHistory => {
        const filteredHistory = prevHistory.filter(entry => entry.date !== today);
        const updatedHistory = [newEntry, ...filteredHistory].slice(0, 30);
        StorageManager.save('wellness_score_history', updatedHistory);
        return updatedHistory;
    });
  }, []);

  return { scoreHistory, saveScoreToHistory };
};
