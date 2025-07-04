
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Target } from 'lucide-react';

interface WellnessScoreDisplayProps {
  score: number;
  calculatedAt: string;
}

export const WellnessScoreDisplay: React.FC<WellnessScoreDisplayProps> = ({ score, calculatedAt }) => {
  const getScoreColor = () => 'text-mental-green';

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Amazing progress!';
    if (score >= 60) return 'Great work!';
    if (score >= 40) return 'Nice efforts!';
    return 'Every step counts!';
  };

  const getProgressIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-6 w-6 text-mental-green" />;
    if (score >= 60) return <Star className="h-6 w-6 text-mental-green" />;
    return <Target className="h-6 w-6 text-mental-green" />;
  };

  return (
    <div className="text-center p-6 bg-gradient-to-br from-mental-blue/20 to-mental-peach/20 rounded-lg">
      <div className="flex items-center justify-center gap-2 mb-4">
        {getProgressIcon(score)}
        <div className={`text-4xl font-bold ${getScoreColor()}`}>
          {score} Points
        </div>
      </div>
      <div className="text-lg font-medium mb-2" style={{color: '#737373'}}>
        {getScoreMessage(score)}
      </div>
      <div className="text-sm mb-4" style={{color: '#737373'}}>
        You've earned points for your wellness activities
      </div>
      <Progress value={Math.min(score, 100)} className="w-48 mx-auto" />
      <p className="text-sm text-gray-500 mt-2">
        Last updated: {new Date(calculatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};
