
import { useState } from 'react';

export const useMoodForm = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number[]>([5]);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const resetForm = () => {
    setSelectedMood(null);
    setMoodIntensity([5]);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return {
    selectedMood,
    setSelectedMood,
    moodIntensity,
    setMoodIntensity,
    moodNote,
    setMoodNote,
    selectedFactors,
    setSelectedFactors,
    resetForm,
    handleFactorToggle
  };
};
