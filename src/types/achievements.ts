
import { LucideIcon } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'streak' | 'milestone' | 'engagement' | 'progress';
  requirement: number;
  currentProgress: number;
  completed: boolean;
  unlockedDate?: string;
  badgeColor: string;
}

export interface UserProgress {
  moodEntries: number;
  journalEntries: number;
  mindfulnessSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  featuresUsed: string[];
}
