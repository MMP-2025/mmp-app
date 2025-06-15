
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface MoodIntensitySliderProps {
  intensity: number[];
  onIntensityChange: (intensity: number[]) => void;
}

const MoodIntensitySlider: React.FC<MoodIntensitySliderProps> = ({
  intensity,
  onIntensityChange
}) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        Intensity Level: {intensity[0]}/10
      </Label>
      <Slider
        value={intensity}
        onValueChange={onIntensityChange}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-sm mt-2" style={{color: '#737373'}}>
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default MoodIntensitySlider;
