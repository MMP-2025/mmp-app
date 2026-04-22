
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, X } from 'lucide-react';

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
  onExit?: () => void;
}

const MindfulnessExerciseSession: React.FC<MindfulnessExerciseSessionProps> = ({
  exercise,
  activeStep,
  onNextStep,
  onExit,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setElapsed(0);
  }, [activeStep]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Card className="p-6 bg-mental-blue/20">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl font-semibold">{exercise.title}</h2>
        {onExit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            aria-label="Exit exercise"
            className="-mt-1 -mr-2"
          >
            <X className="h-4 w-4 mr-1" /> Exit
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
        <span>
          <Timer className="inline-block mr-1 h-4 w-4" /> {exercise.duration}
        </span>
        <span aria-live="polite">
          Step {activeStep + 1} of {exercise.steps.length} · {fmt(elapsed)}
        </span>
      </div>
      
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
        
        <Button
          onClick={onNextStep}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {activeStep === exercise.steps.length - 1 ? 'Complete Exercise' : 'Next Step →'}
        </Button>
      </div>
    </Card>
  );
};

export default MindfulnessExerciseSession;
