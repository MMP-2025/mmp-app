
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export type JournalPromptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: JournalPromptDifficulty;
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
  category: string;
  type: 'reflection' | 'assessment' | 'screening';
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
}

export interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'simple' | 'moderate' | 'deep';
}

export interface MindfulnessPrompt {
  id: string;
  prompt: string;
  category: string;
  duration: string;
}
