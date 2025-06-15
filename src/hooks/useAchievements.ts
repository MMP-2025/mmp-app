
import { useState, useCallback } from 'react';
import { Achievement, UserProgress } from '@/types/achievements';
import { loadUserProgress } from '@/utils/progressCalculations';
import { initializeAchievements, updateAchievementProgress } from '@/utils/achievementUtils';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const loadProgress = useCallback(() => {
    const progress = loadUserProgress();
    setUserProgress(progress);
  }, []);

  const initAchievements = useCallback(() => {
    const initialAchievements = initializeAchievements();
    setAchievements(initialAchievements);
    loadProgress();
  }, [loadProgress]);

  const checkAndUpdateAchievements = useCallback(() => {
    if (!userProgress) return;

    const updatedAchievements = updateAchievementProgress(achievements, userProgress);
    setAchievements(updatedAchievements);
  }, [userProgress, achievements]);

  return {
    achievements,
    userProgress,
    loadUserProgress: loadProgress,
    initializeAchievements: initAchievements,
    checkAndUpdateAchievements
  };
};
