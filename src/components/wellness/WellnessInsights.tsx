
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
        <Card className="p-4 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-red-600" />
            <h5 className="font-semibold text-red-800">Areas for Improvement</h5>
          </div>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-red-700">
                • {improvement}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {strengths.length > 0 && (
        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h5 className="font-semibold text-green-800">Your Strengths</h5>
          </div>
          <ul className="space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-green-700">
                • {strength}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
