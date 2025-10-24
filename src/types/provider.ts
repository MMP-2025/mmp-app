export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  provider_id?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type JournalPromptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: JournalPromptDifficulty;
  provider_id?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export interface Question {
  id: string;
  question: string;
  category?: string;
  type: 'reflection' | 'assessment' | 'screening';
  provider_id?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  duration: string;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  targetUser?: string;
}

export interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'simple' | 'moderate' | 'deep';
  provider_id?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MindfulnessPrompt {
  id: string;
  prompt: string;
  category: string;
  duration: string;
}
