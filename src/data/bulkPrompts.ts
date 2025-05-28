export interface Prompt {
  id: string;
  text: string;
  category: 'journal' | 'gratitude' | 'mindfulness' | 'other';
}

export const bulkPrompts: Prompt[] = [
  // Journal Prompts
  {
    id: '1',
    text: 'What three things am I most grateful for today?',
    category: 'journal'
  },
  {
    id: '2',
    text: 'What challenged me today and how did I overcome it?',
    category: 'journal'
  },
  {
    id: '3',
    text: 'Describe a moment today when I felt truly happy.',
    category: 'journal'
  },
  {
    id: '4',
    text: 'What did I learn about myself today?',
    category: 'journal'
  },
  {
    id: '5',
    text: 'If I could change one thing about today, what would it be and why?',
    category: 'journal'
  },
  {
    id: '6',
    text: 'What are three words that describe how I feel right now?',
    category: 'journal'
  },
  {
    id: '7',
    text: 'What progress did I make toward my goals today?',
    category: 'journal'
  },
  {
    id: '8',
    text: 'Who or what inspired me today?',
    category: 'journal'
  },

  // Gratitude Prompts
  {
    id: '9',
    text: 'Name someone who made a positive impact on your life this week.',
    category: 'gratitude'
  },
  {
    id: '10',
    text: 'What small pleasure brought you joy today?',
    category: 'gratitude'
  },
  {
    id: '11',
    text: 'Describe a skill or ability you have that you are thankful for.',
    category: 'gratitude'
  },
  {
    id: '12',
    text: 'What aspect of your home environment are you most grateful for?',
    category: 'gratitude'
  },
  {
    id: '13',
    text: 'Think of a difficult experience that ultimately led to growth. What are you grateful for about that experience?',
    category: 'gratitude'
  },
  {
    id: '14',
    text: 'What food or meal are you most grateful for today?',
    category: 'gratitude'
  },
  {
    id: '15',
    text: 'Name three things about your body that you are thankful for.',
    category: 'gratitude'
  },
  {
    id: '16',
    text: 'What technology or modern convenience are you most grateful for?',
    category: 'gratitude'
  },

  // Mindfulness Prompts
  {
    id: '17',
    text: 'Take five deep breaths. How does your body feel right now?',
    category: 'mindfulness'
  },
  {
    id: '18',
    text: 'What sounds can you hear around you at this moment?',
    category: 'mindfulness'
  },
  {
    id: '19',
    text: 'Notice your thoughts without judgment. What patterns do you observe?',
    category: 'mindfulness'
  },
  {
    id: '20',
    text: 'Focus on one object near you. Describe it in detail using all your senses.',
    category: 'mindfulness'
  },
  {
    id: '21',
    text: 'What emotions are you experiencing right now? Where do you feel them in your body?',
    category: 'mindfulness'
  },
  {
    id: '22',
    text: 'Take a moment to appreciate the present. What makes this moment special?',
    category: 'mindfulness'
  },
  {
    id: '23',
    text: 'Notice your breathing. How does it feel to focus only on your breath?',
    category: 'mindfulness'
  },
  {
    id: '24',
    text: 'What physical sensations are you aware of in your body right now?',
    category: 'mindfulness'
  },

  // Other Prompts
  {
    id: '25',
    text: 'What would you do if you knew you could not fail?',
    category: 'other'
  },
  {
    id: '26',
    text: 'Describe your ideal day from start to finish.',
    category: 'other'
  },
  {
    id: '27',
    text: 'What advice would you give to your younger self?',
    category: 'other'
  },
  {
    id: '28',
    text: 'If you could have dinner with anyone, living or dead, who would it be and why?',
    category: 'other'
  },
  {
    id: '29',
    text: 'What does success mean to you personally?',
    category: 'other'
  },
  {
    id: '30',
    text: 'Describe a time when you felt most proud of yourself.',
    category: 'other'
  }
];

export const getPromptsByCategory = (category: string): Prompt[] => {
  return bulkPrompts.filter(prompt => prompt.category === category);
};

export const getRandomPrompt = (category?: string): Prompt => {
  const prompts = category ? getPromptsByCategory(category) : bulkPrompts;
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
};
