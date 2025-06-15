
import { useState, useCallback } from 'react';
import { StorageManager } from '@/utils/storage';
import { Award, Trophy, Star, Target, Calendar, Flame, Heart, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  category: 'streak' | 'milestone' | 'engagement' | 'progress';
  requirement: number;
  currentProgress: number;
  completed: boolean;
  unlockedDate?: string;
  badgeColor: string;
}

interface UserProgress {
  moodEntries: number;
  journalEntries: number;
  mindfulnessSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  featuresUsed: string[];
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const defaultAchievements: Omit<Achievement, 'currentProgress' | 'completed' | 'unlockedDate'>[] = [
    {
      id: 'first_mood',
      title: 'First Steps',
      description: 'Log your first mood entry',
      icon: Heart,
      category: 'milestone',
      requirement: 1,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'mood_streak_7',
      title: 'Week Warrior',
      description: 'Track your mood for 7 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 7,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'mood_streak_30',
      title: 'Monthly Master',
      description: 'Track your mood for 30 days in a row',
      icon: Calendar,
      category: 'streak',
      requirement: 30,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'journal_entries_10',
      title: 'Thoughtful Writer',
      description: 'Write 10 journal entries',
      icon: Star,
      category: 'milestone',
      requirement: 10,
      badgeColor: 'bg-green-500'
    },
    {
      id: 'mindfulness_sessions_5',
      title: 'Mindful Beginner',
      description: 'Complete 5 mindfulness sessions',
      icon: Brain,
      category: 'milestone',
      requirement: 5,
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'feature_explorer',
      title: 'Explorer',
      description: 'Try 5 different app features',
      icon: Target,
      category: 'engagement',
      requirement: 5,
      badgeColor: 'bg-indigo-500'
    },
    {
      id: 'mood_entries_100',
      title: 'Dedication Champion',
      description: 'Log 100 mood entries',
      icon: Trophy,
      category: 'milestone',
      requirement: 100,
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'wellness_warrior',
      title: 'Wellness Warrior',
      description: 'Use the app for 90 days total',
      icon: Award,
      category: 'progress',
      requirement: 90,
      badgeColor: 'bg-pink-500'
    }
  ];

  const loadUserProgress = useCallback(() => {
    const moodEntries = StorageManager.load('mood_entries', []).length;
    const journalEntries = StorageManager.load('journal_entries', []).length;
    const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
    const userBehavior = StorageManager.load('user_behavior', null);

    const progress: UserProgress = {
      moodEntries,
      journalEntries,
      mindfulnessSessions: mindfulnessProgress.sessions?.length || 0,
      currentStreak: calculateCurrentStreak(),
      longestStreak: calculateLongestStreak(),
      totalDays: calculateTotalDays(),
      featuresUsed: userBehavior?.mostUsedFeatures || []
    };

    setUserProgress(progress);
  }, []);

  const calculateCurrentStreak = (): number => {
    const moodEntries = StorageManager.load('mood_entries', []);
    if (moodEntries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const sortedEntries = moodEntries.sort((a: any, b: any) => b.timestamp - a.timestamp);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (): number => {
    return calculateCurrentStreak();
  };

  const calculateTotalDays = (): number => {
    const moodEntries = StorageManager.load('mood_entries', []);
    const uniqueDates = new Set(moodEntries.map((entry: any) => entry.date));
    return uniqueDates.size;
  };

  const initializeAchievements = useCallback(() => {
    const savedAchievements = StorageManager.load<Achievement[]>('achievements', []);
    
    if (savedAchievements.length === 0) {
      const initialAchievements = defaultAchievements.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        completed: false
      }));
      setAchievements(initialAchievements);
      StorageManager.save('achievements', initialAchievements);
    } else {
      setAchievements(savedAchievements);
    }
    loadUserProgress();
  }, [loadUserProgress]);

  const checkAndUpdateAchievements = useCallback(() => {
    if (!userProgress) return;

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

    setAchievements(updatedAchievements);
    StorageManager.save('achievements', updatedAchievements);
  }, [userProgress, achievements]);

  return {
    achievements,
    userProgress,
    loadUserProgress,
    initializeAchievements,
    checkAndUpdateAchievements
  };
};
