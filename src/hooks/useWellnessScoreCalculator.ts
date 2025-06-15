
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WellnessScoreCalculator } from '@/services/wellness/wellnessScoreCalculator';
import type { WellnessScore } from '@/types/wellness';

interface UseWellnessScoreCalculatorProps {
  saveScoreToHistory: (score: WellnessScore) => void;
}

export const useWellnessScoreCalculator = ({ saveScoreToHistory }: UseWellnessScoreCalculatorProps) => {
  const [currentScore, setCurrentScore] = useState<WellnessScore | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = useCallback((isRefresh: boolean) => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const score = WellnessScoreCalculator.performWellnessCalculation();
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
  }, [saveScoreToHistory]);

  useEffect(() => {
    calculate(false);
  }, [calculate]);

  const calculateWellnessScore = useCallback(() => {
    calculate(true);
  }, [calculate]);

  return { currentScore, isCalculating, calculateWellnessScore };
};
