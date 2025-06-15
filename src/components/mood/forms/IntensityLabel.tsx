
import React from 'react';
import { Label } from '@/components/ui/label';

interface IntensityLabelProps {
  intensity: number;
}

const IntensityLabel: React.FC<IntensityLabelProps> = ({ intensity }) => {
  return (
    <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
      Intensity Level: {intensity}/10
    </Label>
  );
};

export default IntensityLabel;
