
import { useState, useEffect } from 'react';
import { StorageManager } from '@/utils/storage';

interface CBTSession {
  id: string;
  date: string;
  module: string;
  thought: string;
  emotion: string;
  evidence: string;
  alternativeThought: string;
  newEmotion: string;
  completed: boolean;
  timestamp: number;
}

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export const useCBTSessions = () => {
  const [sessions, setSessions] = useState<CBTSession[]>([]);

  const modules: CBTModule[] = [
    {
      id: 'thought-challenging',
      title: 'Thought Challenging',
      description: 'Learn to identify and challenge negative thought patterns',
      steps: [
        'Identify the troubling thought',
        'Recognize the emotion it creates',
        'Examine evidence for the thought',
        'Develop a more balanced perspective',
        'Notice how your emotions change'
      ]
    },
    {
      id: 'cognitive-restructuring',
      title: 'Cognitive Restructuring',
      description: 'Replace distorted thoughts with more realistic ones',
      steps: [
        'Catch the negative thought',
        'Identify the cognitive distortion',
        'Challenge the thought with questions',
        'Create a balanced alternative',
        'Practice the new thought pattern'
      ]
    }
  ];

  useEffect(() => {
    const savedSessions = StorageManager.load<CBTSession[]>('cbt_sessions', []);
    setSessions(savedSessions);
  }, []);

  const addSession = (session: CBTSession) => {
    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    StorageManager.save('cbt_sessions', updatedSessions);
  };

  return {
    sessions,
    modules,
    addSession
  };
};
