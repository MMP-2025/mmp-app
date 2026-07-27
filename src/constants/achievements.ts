
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
    title: 'A Week of Check-Ins',
    description: 'Reflected on your mood 7 days in a row',
    icon: Flame,
    category: 'streak',
    requirement: 7,
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'mood_streak_30',
    title: 'A Month of Reflection',
    description: 'Checked in with yourself 30 days in a row',
    icon: Calendar,
    category: 'streak',
    requirement: 30,
    badgeColor: 'bg-red-500'
  },
  {
    id: 'journal_entries_10',
    title: 'Ten Reflections',
    description: 'Written 10 journal entries at your own pace',
    icon: Star,
    category: 'milestone',
    requirement: 10,
    badgeColor: 'bg-green-500'
  },
  {
    id: 'mindfulness_sessions_5',
    title: 'Time for Yourself',
    description: 'Completed 5 mindfulness sessions',
    icon: Brain,
    category: 'milestone',
    requirement: 5,
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'feature_explorer',
    title: 'Finding What Fits',
    description: 'Explored 5 different tools to see what feels helpful',
    icon: Target,
    category: 'engagement',
    requirement: 5,
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'mood_entries_100',
    title: 'One Hundred Check-Ins',
    description: 'Logged 100 mood entries over time',
    icon: Trophy,
    category: 'milestone',
    requirement: 100,
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'wellness_warrior',
    title: 'A Steady Companion',
    description: 'Used the app across 90 days',
    icon: Award,
    category: 'progress',
    requirement: 90,
    badgeColor: 'bg-pink-500'
  }
];
