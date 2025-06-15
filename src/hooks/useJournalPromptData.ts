
import { useState } from 'react';
import { JournalPrompt, JournalPromptDifficulty } from '@/types/provider';

export const useJournalPromptData = () => {
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [newPrompt, setNewPrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: JournalPromptDifficulty;
  }>({
    prompt: '',
    category: '',
    difficulty: 'beginner'
  });

  return {
    journalPrompts,
    setJournalPrompts,
    newPrompt,
    setNewPrompt
  };
};
