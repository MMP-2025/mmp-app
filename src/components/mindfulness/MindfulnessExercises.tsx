import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MindfulnessExerciseCard from '@/components/mindfulness/MindfulnessExerciseCard';
import MindfulnessExerciseSession from '@/components/mindfulness/MindfulnessExerciseSession';
import MindfulnessBenefits from '@/components/mindfulness/MindfulnessBenefits';
import MindfulnessEmptyState from '@/components/mindfulness/MindfulnessEmptyState';
import { mindfulnessExercises } from '@/data/mindfulnessExercises';
const MindfulnessExercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<typeof mindfulnessExercises[0] | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [savedExercises, setSavedExercises] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');
  const startExercise = (exercise: typeof mindfulnessExercises[0]) => {
    setSelectedExercise(exercise);
    setActiveStep(0);
  };
  const nextStep = () => {
    if (selectedExercise && activeStep < selectedExercise.steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Exercise completed
      setSelectedExercise(null);
      setActiveStep(0);
    }
  };
  const toggleFavorite = (exerciseId: number) => {
    setFavorites(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]);
  };
  const toggleSaved = (exerciseId: number) => {
    setSavedExercises(prev => {
      const isCurrentlySaved = prev.includes(exerciseId);
      if (isCurrentlySaved) {
        toast.success('Exercise removed from saved');
        return prev.filter(id => id !== exerciseId);
      } else {
        toast.success('Exercise saved!');
        return [...prev, exerciseId];
      }
    });
  };
  const getDisplayedExercises = () => {
    if (currentView === 'saved') {
      return mindfulnessExercises.filter(exercise => savedExercises.includes(exercise.id));
    }
    const sorted = [...mindfulnessExercises].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
    return sorted;
  };
  return <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-2">
                <Button variant={currentView === 'all' ? 'default' : 'outline'} onClick={() => setCurrentView('all')} className="bg-mental-gray">
                    All Exercises
                </Button>
                <Button variant={currentView === 'saved' ? 'default' : 'outline'} onClick={() => setCurrentView('saved')} className="bg-mental-gray">
                    Saved Exercises ({savedExercises.length})
                </Button>
            </div>
            
            {selectedExercise ? <MindfulnessExerciseSession exercise={selectedExercise} activeStep={activeStep} onNextStep={nextStep} /> : <>
                    {currentView === 'saved' && savedExercises.length === 0 ? <MindfulnessEmptyState onBrowseAll={() => setCurrentView('all')} /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getDisplayedExercises().map(exercise => <MindfulnessExerciseCard key={exercise.id} exercise={exercise} isFavorite={favorites.includes(exercise.id)} isSaved={savedExercises.includes(exercise.id)} onStart={startExercise} onToggleFavorite={toggleFavorite} onToggleSaved={toggleSaved} />)}
                        </div>}
                </>}
            
            <MindfulnessBenefits />
        </div>;
};
export default MindfulnessExercises;