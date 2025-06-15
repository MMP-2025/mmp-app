
import { useGratitudeData } from './useGratitudeData';
import { useMindfulnessData } from './useMindfulnessData';

export const useWellnessData = () => {
  const gratitudeData = useGratitudeData();
  const mindfulnessData = useMindfulnessData();

  return {
    // Gratitude data
    gratitudePrompts: gratitudeData.gratitudePrompts,
    setGratitudePrompts: gratitudeData.setGratitudePrompts,
    newGratitudePrompt: gratitudeData.newGratitudePrompt,
    setNewGratitudePrompt: gratitudeData.setNewGratitudePrompt,
    
    // Mindfulness data
    mindfulnessPrompts: mindfulnessData.mindfulnessPrompts,
    setMindfulnessPrompts: mindfulnessData.setMindfulnessPrompts,
    newMindfulnessPrompt: mindfulnessData.newMindfulnessPrompt,
    setNewMindfulnessPrompt: mindfulnessData.setNewMindfulnessPrompt
  };
};
