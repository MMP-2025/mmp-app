
import { useState } from 'react';
import { GratitudePrompt } from '@/types/provider';

export const useGratitudeData = () => {
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);
  const [newGratitudePrompt, setNewGratitudePrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: GratitudePrompt['difficulty'];
  }>({
    prompt: '',
    category: '',
    difficulty: 'simple'
  });

  return {
    gratitudePrompts,
    setGratitudePrompts,
    newGratitudePrompt,
    setNewGratitudePrompt
  };
};
