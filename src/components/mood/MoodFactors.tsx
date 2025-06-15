
import React from 'react';
import { Label } from '@/components/ui/label';
import FactorsGrid from './factors/FactorsGrid';

interface MoodFactorsProps {
  factors: string[];
  selectedFactors: string[];
  onFactorToggle: (factor: string) => void;
}

const MoodFactors: React.FC<MoodFactorsProps> = ({ 
  factors, 
  selectedFactors, 
  onFactorToggle 
}) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        What might be influencing your mood? (Select all that apply)
      </Label>
      <FactorsGrid
        factors={factors}
        selectedFactors={selectedFactors}
        onFactorToggle={onFactorToggle}
      />
    </div>
  );
};

export default MoodFactors;
