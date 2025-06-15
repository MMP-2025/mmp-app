
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Heart, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

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

  return <div className="space-y-6 max-w-4xl mx-auto">
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
      
      {selectedExercise ? <Card className="p-6 bg-mental-blue/20">
          <h2 className="text-2xl font-semibold mb-2">{selectedExercise.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            <Timer className="inline-block mr-1 h-4 w-4" /> {selectedExercise.duration}
          </p>
          
          <div className="mb-8">
            <div className="w-full bg-mental-gray/30 h-2 rounded-full mb-4">
              <div className="bg-mental-blue h-2 rounded-full transition-all duration-500" style={{
            width: `${(activeStep + 1) / selectedExercise.steps.length * 100}%`
          }}></div>
            </div>
            
            <p className="text-xl mb-8">{selectedExercise.steps[activeStep]}</p>
            
            <Button onClick={nextStep} className="w-full bg-mental-green hover:bg-mental-green/80">
              {activeStep === selectedExercise.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
            </Button>
          </div>
        </Card> : <>
          {currentView === 'saved' && savedExercises.length === 0 ? (
            <Card className="p-8 bg-mental-peach/20 text-center">
              <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-mental-peach" />
              <h3 className="text-xl font-semibold mb-2">No Saved Exercises</h3>
              <p className="text-muted-foreground mb-4">
                You haven't saved any exercises yet. Browse all exercises and save your favorites!
              </p>
              <Button 
                onClick={() => setCurrentView('all')} 
                className="bg-mental-blue hover:bg-mental-blue/80"
              >
                Browse All Exercises
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getDisplayedExercises().map(exercise => <Card key={exercise.id} className="p-6 bg-mental-green">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{exercise.title}</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaved(exercise.id)}
                        className="p-1"
                      >
                        {savedExercises.includes(exercise.id) ? (
                          <BookmarkCheck className="h-6 w-6 text-blue-600" />
                        ) : (
                          <BookmarkPlus className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(exercise.id)}
                        className="p-1"
                      >
                        <Heart 
                          className={`h-6 w-6 ${
                            favorites.includes(exercise.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Timer className="mr-1 h-4 w-4" /> 
                    <span>{exercise.duration}</span>
                  </div>
                  <p className="mb-4 font-normal text-neutral-500">{exercise.description}</p>
                  <Button onClick={() => startExercise(exercise)} className="w-full bg-mental-blue hover:bg-mental-blue/80">
                    Start Exercise
                  </Button>
                </Card>)}
            </div>
          )}
        </>}
      
      <Card className="p-6 bg-mental-peach/20">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-mental-peach" />
          <h2 className="text-xl font-semibold">Benefits of Mindfulness</h2>
        </div>
        <ul className="space-y-2 list-disc list-inside">
          <li>Reduces stress and anxiety</li>
          <li>Improves focus and attention</li>
          <li>Enhances emotional regulation</li>
          <li>Promotes better sleep</li>
          <li>Boosts immune system function</li>
          <li>Increases self-awareness and compassion</li>
        </ul>
      </Card>
    </div>;
};

export default MindfulnessPage;
