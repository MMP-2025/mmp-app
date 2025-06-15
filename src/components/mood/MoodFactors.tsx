
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface MoodFactorsProps {
  factors: string[];
  selectedFactors: string[];
  onFactorToggle: (factor: string) => void;
}

const MoodFactors = ({ factors, selectedFactors, onFactorToggle }: MoodFactorsProps) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        What might be influencing your mood? (Select all that apply)
      </Label>
      <div className="flex flex-wrap gap-2">
        {factors.map(factor => (
          <Badge
            key={factor}
            variant={selectedFactors.includes(factor) ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedFactors.includes(factor) 
                ? 'bg-mental-peach text-gray-700 border-gray-400' 
                : 'hover:bg-mental-peach/40'
            }`}
            onClick={() => onFactorToggle(factor)}
          >
            {factor}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MoodFactors;
