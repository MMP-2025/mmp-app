
import React from 'react';
import { Slider } from '@/components/ui/slider';
import IntensityLabel from './IntensityLabel';
import IntensityScale from './IntensityScale';

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
      <IntensityLabel intensity={intensity[0]} />
      <Slider
        value={intensity}
        onValueChange={onIntensityChange}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
      <IntensityScale />
    </div>
  );
};

export default MoodIntensitySlider;
