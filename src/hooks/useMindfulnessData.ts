
import { useState } from 'react';
import { MindfulnessPrompt } from '@/types/provider';

export const useMindfulnessData = () => {
  const [mindfulnessPrompts, setMindfulnessPrompts] = useState<MindfulnessPrompt[]>([]);
  const [newMindfulnessPrompt, setNewMindfulnessPrompt] = useState({
    prompt: '',
    category: '',
    duration: '5 minutes'
  });

  return {
    mindfulnessPrompts,
    setMindfulnessPrompts,
    newMindfulnessPrompt,
    setNewMindfulnessPrompt
  };
};
