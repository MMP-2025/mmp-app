
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Heart, MessageSquare } from 'lucide-react';

// Sample mindfulness exercises - in a real app, these would come from your database
const mindfulnessExercises = [
  {
    id: 1,
    title: "Five Senses Grounding",
    duration: "5 minutes",
    description: "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    steps: [
      "Find a comfortable position and take a few deep breaths.",
      "Look around and name 5 things you can see right now.",
      "Notice 4 things you can physically feel (texture of clothes, air on skin, etc).",
      "Listen for 3 distinct sounds in your environment.",
      "Try to identify 2 different smells around you.",
      "Finally, notice 1 taste in your mouth.",
      "Take a few deep breaths to finish."
    ]
  },
  {
    id: 2,
    title: "Mindful Breathing",
    duration: "3-5 minutes",
    description: "A simple breath awareness practice to help anchor yourself in the present moment.",
    steps: [
      "Sit comfortably with your back straight but not stiff.",
      "Close your eyes or lower your gaze.",
      "Focus your attention on your breath as it enters and leaves your nostrils.",
      "Notice the sensation of the breath - is it cool or warm?",
      "When your mind wanders, gently bring your attention back to your breath.",
      "Continue for 3-5 minutes, allowing your breath to flow naturally."
    ]
  },
  {
    id: 3,
    title: "Body Scan",
    duration: "10 minutes",
    description: "A practice that involves paying attention to parts of the body and bodily sensations in a gradual sequence.",
    steps: [
      "Lie down or sit in a comfortable position.",
      "Bring awareness to your feet, noticing any sensations.",
      "Slowly move your attention up through your legs, torso, arms, and head.",
      "Notice any areas of tension, discomfort, or ease.",
      "Try not to judge these sensations as good or bad.",
      "When your mind wanders, gently return to the body part you were focusing on.",
      "End by becoming aware of your body as a whole."
    ]
  }
];

const MindfulnessPage = () => {
  const [selectedExercise, setSelectedExercise] = useState<typeof mindfulnessExercises[0] | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  
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
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mindfulness Exercises</h1>
        <p className="text-muted-foreground">Practice being present in the moment</p>
      </div>
      
      {selectedExercise ? (
        <Card className="p-6 bg-mental-blue/20">
          <h2 className="text-2xl font-semibold mb-2">{selectedExercise.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            <Timer className="inline-block mr-1 h-4 w-4" /> {selectedExercise.duration}
          </p>
          
          <div className="mb-8">
            <div className="w-full bg-mental-gray/30 h-2 rounded-full mb-4">
              <div 
                className="bg-mental-blue h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((activeStep + 1) / selectedExercise.steps.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-xl mb-8">{selectedExercise.steps[activeStep]}</p>
            
            <Button onClick={nextStep} className="w-full bg-mental-green hover:bg-mental-green/80">
              {activeStep === selectedExercise.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mindfulnessExercises.map(exercise => (
            <Card key={exercise.id} className="p-6">
              <h2 className="text-xl font-semibold mb-2">{exercise.title}</h2>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Timer className="mr-1 h-4 w-4" /> 
                <span>{exercise.duration}</span>
              </div>
              <p className="mb-4">{exercise.description}</p>
              <Button
                onClick={() => startExercise(exercise)}
                className="w-full bg-mental-blue hover:bg-mental-blue/80"
              >
                Start Exercise
              </Button>
            </Card>
          ))}
        </div>
      )}
      
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
    </div>
  );
};

export default MindfulnessPage;
