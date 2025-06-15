
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Lightbulb } from 'lucide-react';

interface WellnessInsightsProps {
  improvements: string[];
  strengths: string[];
}

export const WellnessInsights: React.FC<WellnessInsightsProps> = ({ improvements, strengths }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {improvements.length > 0 && (
        <Card className="p-4 bg-destructive/10">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-destructive" />
            <h5 className="font-semibold text-destructive">Areas for Improvement</h5>
          </div>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-destructive">
                • {improvement}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {strengths.length > 0 && (
        <Card className="p-4 bg-mental-green/10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-mental-green" />
            <h5 className="font-semibold text-mental-green">Your Strengths</h5>
          </div>
          <ul className="space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-mental-green">
                • {strength}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
