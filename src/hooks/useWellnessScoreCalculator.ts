
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WellnessScoreCalculator } from '@/services/wellness/wellnessScoreCalculator';
import { StorageManager } from '@/utils/storage';
import type { WellnessScore } from '@/types/wellness';

interface UseWellnessScoreCalculatorProps {
  saveScoreToHistory: (score: WellnessScore) => void;
  moodEntries: any[];
  journalEntries: any[];
  mindfulnessSessions: any[];
}

export const useWellnessScoreCalculator = ({ 
  saveScoreToHistory,
  moodEntries,
  journalEntries,
  mindfulnessSessions
}: UseWellnessScoreCalculatorProps) => {
  const [currentScore, setCurrentScore] = useState<WellnessScore | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = useCallback((isRefresh: boolean) => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const userBehavior = StorageManager.load('user_behavior', null);
        const score = WellnessScoreCalculator.performWellnessCalculation({
          moodEntries,
          journalEntries,
          mindfulnessSessions,
          userBehavior
        });
        setCurrentScore(score);
        saveScoreToHistory(score);
        if (isRefresh) {
          toast.success('Wellness score updated!');
        }
      } catch (error) {
        console.error("Failed to calculate wellness score:", error);
        toast.error('Could not calculate wellness score.');
      } finally {
        setIsCalculating(false);
      }
    }, 1500);
  }, [saveScoreToHistory, moodEntries, journalEntries, mindfulnessSessions]);

  useEffect(() => {
    calculate(false);
  }, [calculate]);

  const calculateWellnessScore = useCallback(() => {
    calculate(true);
  }, [calculate]);

  return { currentScore, isCalculating, calculateWellnessScore };
};
