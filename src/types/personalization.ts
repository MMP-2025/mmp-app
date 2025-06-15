
export interface UserBehavior {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  mostUsedFeatures: string[];
  moodPatterns: Array<{ mood: string; time: string; factors: string[] }>;
  engagementLevel: 'low' | 'medium' | 'high';
  streakDays: number;
  lastActiveDate: string;
}

export interface PersonalizedContent {
  quote: string;
  author: string;
  category: string;
  relevanceScore: number;
}

export interface AdaptiveReminder {
  id: string;
  type: 'mood_check' | 'mindfulness' | 'journal' | 'gratitude';
  message: string;
  optimalTime: string;
  frequency: 'daily' | 'weekly' | 'custom';
  enabled: boolean;
}
