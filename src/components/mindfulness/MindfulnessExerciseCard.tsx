
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Heart, BookmarkPlus, BookmarkCheck } from 'lucide-react';

interface MindfulnessExercise {
  id: number;
  title: string;
  duration: string;
  description: string;
  steps: string[];
}

interface MindfulnessExerciseCardProps {
  exercise: MindfulnessExercise;
  isFavorite: boolean;
  isSaved: boolean;
  onStart: (exercise: MindfulnessExercise) => void;
  onToggleFavorite: (exerciseId: number) => void;
  onToggleSaved: (exerciseId: number) => void;
}

const MindfulnessExerciseCard: React.FC<MindfulnessExerciseCardProps> = ({
  exercise,
  isFavorite,
  isSaved,
  onStart,
  onToggleFavorite,
  onToggleSaved,
}) => {
  return (
    <Card className="p-6 bg-mental-green">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{exercise.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSaved(exercise.id)}
            className="p-1"
          >
            {isSaved ? (
              <BookmarkCheck className="h-6 w-6 text-blue-600" />
            ) : (
              <BookmarkPlus className="h-6 w-6 text-gray-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(exercise.id)}
            className="p-1"
          >
            <Heart 
              className={`h-6 w-6 ${
                isFavorite 
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
      <Button onClick={() => onStart(exercise)} className="w-full bg-mental-blue hover:bg-mental-blue/80">
        Start Exercise
      </Button>
    </Card>
  );
};

export default MindfulnessExerciseCard;
