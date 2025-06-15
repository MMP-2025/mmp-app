
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';

interface MindfulnessExercise {
  id: number;
  title: string;
  duration: string;
  description: string;
  steps: string[];
}

interface MindfulnessExerciseSessionProps {
  exercise: MindfulnessExercise;
  activeStep: number;
  onNextStep: () => void;
}

const MindfulnessExerciseSession: React.FC<MindfulnessExerciseSessionProps> = ({
  exercise,
  activeStep,
  onNextStep,
}) => {
  return (
    <Card className="p-6 bg-mental-blue/20">
      <h2 className="text-2xl font-semibold mb-2">{exercise.title}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        <Timer className="inline-block mr-1 h-4 w-4" /> {exercise.duration}
      </p>
      
      <div className="mb-8">
        <div className="w-full bg-mental-gray/30 h-2 rounded-full mb-4">
          <div 
            className="bg-mental-blue h-2 rounded-full transition-all duration-500" 
            style={{
              width: `${(activeStep + 1) / exercise.steps.length * 100}%`
            }}
          ></div>
        </div>
        
        <p className="text-xl mb-8">{exercise.steps[activeStep]}</p>
        
        <Button onClick={onNextStep} className="w-full bg-mental-green hover:bg-mental-green/80">
          {activeStep === exercise.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
        </Button>
      </div>
    </Card>
  );
};

export default MindfulnessExerciseSession;
