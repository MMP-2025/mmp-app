
import { useState } from 'react';

export const useMoodForm = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number[]>([5]);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState<number[]>([7]);
  const [exerciseMinutes, setExerciseMinutes] = useState<number[]>([30]);
  const [cycleTracking, setCycleTracking] = useState(false);
  const [cycleDay, setCycleDay] = useState<number[]>([1]);
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState('');

  const resetForm = () => {
    setSelectedMood(null);
    setMoodIntensity([5]);
    setMoodNote('');
    setSelectedFactors([]);
    setSleepHours([7]);
    setExerciseMinutes([30]);
    setCycleTracking(false);
    setCycleDay([1]);
    setWeather('');
    setLocation('');
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
    sleepHours,
    setSleepHours,
    exerciseMinutes,
    setExerciseMinutes,
    cycleTracking,
    setCycleTracking,
    cycleDay,
    setCycleDay,
    weather,
    setWeather,
    location,
    setLocation,
    resetForm,
    handleFactorToggle
  };
};
