
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface WellnessScoreDisplayProps {
  score: number;
  calculatedAt: string;
}

export const WellnessScoreDisplay: React.FC<WellnessScoreDisplayProps> = ({ score, calculatedAt }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="text-center p-6 bg-gradient-to-br from-mental-blue/20 to-mental-peach/20 rounded-lg">
      <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
        {score}/100
      </div>
      <div className="text-lg font-medium mb-2" style={{color: '#737373'}}>
        {getScoreLabel(score)}
      </div>
      <Progress value={score} className="w-48 mx-auto" />
      <p className="text-sm text-gray-500 mt-2">
        Last updated: {new Date(calculatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};
