
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MindfulnessExerciseCard from '@/components/mindfulness/MindfulnessExerciseCard';
import MindfulnessExerciseSession from '@/components/mindfulness/MindfulnessExerciseSession';
import MindfulnessBenefits from '@/components/mindfulness/MindfulnessBenefits';
import MindfulnessEmptyState from '@/components/mindfulness/MindfulnessEmptyState';

// Sample mindfulness exercises - in a real app, these would come from your database
const mindfulnessExercises = [{
  id: 1,
  title: "Five Senses Grounding",
  duration: "5 minutes",
  description: "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
  steps: ["Find a comfortable position and take a few deep breaths.", "Look around and name 5 things you can see right now.", "Notice 4 things you can physically feel (texture of clothes, air on skin, etc).", "Listen for 3 distinct sounds in your environment.", "Try to identify 2 different smells around you.", "Finally, notice 1 taste in your mouth.", "Take a few deep breaths to finish."]
}, {
  id: 2,
  title: "Mindful Breathing",
  duration: "3-5 minutes",
  description: "A simple breath awareness practice to help anchor yourself in the present moment.",
  steps: ["Sit comfortably with your back straight but not stiff.", "Close your eyes or lower your gaze.", "Focus your attention on your breath as it enters and leaves your nostrils.", "Notice the sensation of the breath - is it cool or warm?", "When your mind wanders, gently bring your attention back to your breath.", "Continue for 3-5 minutes, allowing your breath to flow naturally."]
}, {
  id: 3,
  title: "Body Scan",
  duration: "10 minutes",
  description: "A practice that involves paying attention to parts of the body and bodily sensations in a gradual sequence.",
  steps: ["Lie down or sit in a comfortable position.", "Bring awareness to your feet, noticing any sensations.", "Slowly move your attention up through your legs, torso, arms, and head.", "Notice any areas of tension, discomfort, or ease.", "Try not to judge these sensations as good or bad.", "When your mind wanders, gently return to the body part you were focusing on.", "End by becoming aware of your body as a whole."]
}];

const MindfulnessPage = () => {
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
    setFavorites(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mindfulness Exercises</h1>
        <p className="text-muted-foreground">Practice being present in the moment</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={currentView === 'all' ? 'default' : 'outline'}
          onClick={() => setCurrentView('all')}
          className="bg-mental-blue hover:bg-mental-blue/80"
        >
          All Exercises
        </Button>
        <Button
          variant={currentView === 'saved' ? 'default' : 'outline'}
          onClick={() => setCurrentView('saved')}
          className="bg-mental-green hover:bg-mental-green/80"
        >
          Saved Exercises ({savedExercises.length})
        </Button>
      </div>
      
      {selectedExercise ? (
        <MindfulnessExerciseSession
          exercise={selectedExercise}
          activeStep={activeStep}
          onNextStep={nextStep}
        />
      ) : (
        <>
          {currentView === 'saved' && savedExercises.length === 0 ? (
            <MindfulnessEmptyState onBrowseAll={() => setCurrentView('all')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getDisplayedExercises().map(exercise => (
                <MindfulnessExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isFavorite={favorites.includes(exercise.id)}
                  isSaved={savedExercises.includes(exercise.id)}
                  onStart={startExercise}
                  onToggleFavorite={toggleFavorite}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      <MindfulnessBenefits />
    </div>
  );
};

export default MindfulnessPage;
