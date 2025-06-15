
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { GratitudeExercise } from '@/types/gratitude';

interface ExerciseCardProps {
  exercise: GratitudeExercise;
  onStartPractice: (exercise: GratitudeExercise) => void;
  onToggleSaved: (exerciseId: number) => void;
  isSaved: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onStartPractice, onToggleSaved, isSaved }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#7e868b]">
          {exercise.title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleSaved(exercise.id)}
          className="p-1"
        >
          {isSaved ? (
            <BookmarkCheck className="h-6 w-6 text-neutral-500" />
          ) : (
            <BookmarkPlus className="h-6 w-6 text-gray-400" />
          )}
        </Button>
      </div>
      <p className="mb-4 text-[#7e868b]">{exercise.description}</p>
      <Button onClick={() => onStartPractice(exercise)} className="w-full bg-mental-peach hover:bg-mental-peach/80">
        Start Practice
      </Button>
    </Card>
  );
};

export default ExerciseCard;
