
export interface MindfulnessAudio {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  category: 'breathing' | 'body-scan' | 'meditation' | 'sleep';
  audioUrl?: string; // We'll use placeholder for now
}

export const mindfulnessAudios: MindfulnessAudio[] = [
  {
    id: 'guided-breathing-5min',
    title: '5-Minute Guided Breathing',
    duration: 300,
    description: 'A gentle breathing exercise to center yourself and reduce stress',
    category: 'breathing'
  },
  {
    id: 'body-scan-meditation',
    title: 'Full Body Scan Meditation',
    duration: 900,
    description: 'Progressive relaxation through mindful body awareness',
    category: 'body-scan'
  },
  {
    id: 'mindful-morning',
    title: 'Mindful Morning Start',
    duration: 600,
    description: 'Begin your day with intention and peaceful awareness',
    category: 'meditation'
  },
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief Meditation',
    duration: 720,
    description: 'Calming techniques to manage anxiety and worry',
    category: 'meditation'
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation Meditation',
    duration: 1080,
    description: 'Gentle guidance to prepare your mind and body for restful sleep',
    category: 'sleep'
  },
  {
    id: 'stress-release',
    title: 'Stress Release Session',
    duration: 480,
    description: 'Let go of tension and find your calm center',
    category: 'meditation'
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness Meditation',
    duration: 540,
    description: 'Cultivate compassion for yourself and others',
    category: 'meditation'
  },
  {
    id: 'focus-concentration',
    title: 'Focus & Concentration',
    duration: 420,
    description: 'Enhance your ability to concentrate and stay present',
    category: 'meditation'
  }
];
