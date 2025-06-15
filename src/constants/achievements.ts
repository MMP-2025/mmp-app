
import { Award, Trophy, Star, Target, Calendar, Flame, Heart, Brain } from 'lucide-react';
import { Achievement } from '@/types/achievements';

export const defaultAchievements: Omit<Achievement, 'currentProgress' | 'completed' | 'unlockedDate'>[] = [
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
