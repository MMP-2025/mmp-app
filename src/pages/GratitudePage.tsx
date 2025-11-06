import React, { useState, useCallback, useEffect } from 'react';
import { useToastService } from '@/hooks/useToastService';
import { useGratitudeEntries } from '@/hooks/useGratitudeEntries';
import { gratitudeExercises } from '@/data/gratitudeExercises';
import GratitudeHeader from '@/components/gratitude/GratitudeHeader';
import ViewTabs from '@/components/gratitude/ViewTabs';
import ExerciseCard from '@/components/gratitude/ExerciseCard';
import EmptySavedPractices from '@/components/gratitude/EmptySavedPractices';
import ExerciseForm from '@/components/gratitude/ExerciseForm';
import GratitudeEntriesList from '@/components/gratitude/GratitudeEntriesList';
import { GratitudeExercise } from '@/types/gratitude';
const GratitudePage = () => {
  const [selectedExercise, setSelectedExercise] = useState<GratitudeExercise | null>(null);
  const [gratitudeContent, setGratitudeContent] = useState('');
  const [threeGoodThings, setThreeGoodThings] = useState(['', '', '']);
  const [letterRecipient, setLetterRecipient] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [savedExercises, setSavedExercises] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');
  const [displayedExercises, setDisplayedExercises] = useState<GratitudeExercise[]>([]);
  
  const { gratitudeEntries, saveGratitudeEntry } = useGratitudeEntries();
  const { showSuccess, showWarning } = useToastService();
  const shuffleExercises = useCallback(() => {
    const shuffled = [...gratitudeExercises].sort(() => 0.5 - Math.random());
    setDisplayedExercises(shuffled.slice(0, 3));
  }, []);
  useEffect(() => {
    if (currentView === 'all') {
      shuffleExercises();
    }
  }, [currentView, shuffleExercises]);
  const handleThreeGoodThingsChange = (index: number, value: string) => {
    const updated = [...threeGoodThings];
    updated[index] = value;
    setThreeGoodThings(updated);
  };
  const toggleSaved = (exerciseId: number) => {
    setSavedExercises(prev => {
      const isCurrentlySaved = prev.includes(exerciseId);
      if (isCurrentlySaved) {
        showSuccess('Exercise removed from saved');
        return prev.filter(id => id !== exerciseId);
      } else {
        showSuccess('Exercise saved!');
        return [...prev, exerciseId];
      }
    });
  };
  const getDisplayedExercises = () => {
    if (currentView === 'saved') {
      return gratitudeExercises.filter(exercise => savedExercises.includes(exercise.id));
    }
    return displayedExercises;
  };
  const saveGratitude = async () => {
    let content = '';
    if (selectedExercise?.id === 1) {
      if (threeGoodThings.filter(thing => thing.trim()).length < 3) {
        showWarning("Please fill in all three gratitude items");
        return;
      }
      content = threeGoodThings.join('\n\n');
    } else if (selectedExercise?.id === 2) {
      if (!letterRecipient.trim() || !letterContent.trim()) {
        showWarning("Please fill in both recipient and letter content");
        return;
      }
      content = `Dear ${letterRecipient},\n\n${letterContent}`;
    } else {
      if (!gratitudeContent.trim()) {
        showWarning("Please write something you're grateful for");
        return;
      }
      content = gratitudeContent;
    }
    
    try {
      await saveGratitudeEntry(content, 'General');
      
      if (selectedExercise?.id === 1) {
        setThreeGoodThings(['', '', '']);
      } else if (selectedExercise?.id === 2) {
        setLetterRecipient('');
        setLetterContent('');
      } else {
        setGratitudeContent('');
      }
      setSelectedExercise(null);
      showSuccess("Gratitude practice saved");
    } catch (error) {
      showWarning("Failed to save gratitude entry");
    }
  };
  const exercisesToDisplay = getDisplayedExercises();
  return <div className="space-y-6 max-w-4xl mx-auto bg-mental-green">
      <GratitudeHeader />

      <ViewTabs currentView={currentView} setCurrentView={setCurrentView} savedExercisesCount={savedExercises.length} onShuffle={shuffleExercises} />
      
      {selectedExercise ? <ExerciseForm selectedExercise={selectedExercise} threeGoodThings={threeGoodThings} handleThreeGoodThingsChange={handleThreeGoodThingsChange} letterRecipient={letterRecipient} setLetterRecipient={setLetterRecipient} letterContent={letterContent} setLetterContent={setLetterContent} gratitudeContent={gratitudeContent} setGratitudeContent={setGratitudeContent} onSave={saveGratitude} onCancel={() => setSelectedExercise(null)} /> : <>
          {currentView === 'saved' && exercisesToDisplay.length === 0 ? <EmptySavedPractices onBrowse={() => setCurrentView('all')} /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exercisesToDisplay.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} onStartPractice={setSelectedExercise} onToggleSaved={toggleSaved} isSaved={savedExercises.includes(exercise.id)} />)}
            </div>}
        </>}
      
      <GratitudeEntriesList entries={gratitudeEntries} />
    </div>;
};
export default GratitudePage;