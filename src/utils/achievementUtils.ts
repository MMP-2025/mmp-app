
import { Achievement, UserProgress } from '@/types/achievements';
import { defaultAchievements } from '@/constants/achievements';
import { StorageManager } from '@/utils/storage';
import { toast } from 'sonner';

export const initializeAchievements = (): Achievement[] => {
  const savedAchievements = StorageManager.load<Achievement[]>('achievements', []);
  
  if (savedAchievements.length === 0) {
    const initialAchievements = defaultAchievements.map(achievement => ({
      ...achievement,
      currentProgress: 0,
      completed: false
    }));
    StorageManager.save('achievements', initialAchievements);
    return initialAchievements;
  }
  
  return savedAchievements;
};

export const updateAchievementProgress = (
  achievements: Achievement[],
  userProgress: UserProgress
): Achievement[] => {
  const updatedAchievements = achievements.map(achievement => {
    let currentProgress = 0;

    switch (achievement.id) {
      case 'first_mood':
        currentProgress = userProgress.moodEntries;
        break;
      case 'mood_streak_7':
      case 'mood_streak_30':
        currentProgress = userProgress.currentStreak;
        break;
      case 'journal_entries_10':
        currentProgress = userProgress.journalEntries;
        break;
      case 'mindfulness_sessions_5':
        currentProgress = userProgress.mindfulnessSessions;
        break;
      case 'feature_explorer':
        currentProgress = userProgress.featuresUsed.length;
        break;
      case 'mood_entries_100':
        currentProgress = userProgress.moodEntries;
        break;
      case 'wellness_warrior':
        currentProgress = userProgress.totalDays;
        break;
      default:
        currentProgress = achievement.currentProgress;
    }

    const wasCompleted = achievement.completed;
    const isNowCompleted = currentProgress >= achievement.requirement;

    if (!wasCompleted && isNowCompleted) {
      toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`);
      return {
        ...achievement,
        currentProgress,
        completed: true,
        unlockedDate: new Date().toISOString().split('T')[0]
      };
    }

    return {
      ...achievement,
      currentProgress: Math.min(currentProgress, achievement.requirement)
    };
  });

  StorageManager.save('achievements', updatedAchievements);
  return updatedAchievements;
};
