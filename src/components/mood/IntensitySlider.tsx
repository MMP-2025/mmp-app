
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface IntensitySliderProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
}

const IntensitySlider: React.FC<IntensitySliderProps> = ({ intensity, onIntensityChange }) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="intensity-slider" className="text-sm font-medium text-[#737373]">
          Intensity Level
        </Label>
        <span className="text-sm font-bold text-[#737373]">{intensity}/10</span>
      </div>
      <Slider
        id="intensity-slider"
        min={1}
        max={10}
        step={1}
        value={[intensity]}
        onValueChange={(value) => onIntensityChange(value[0])}
        className="w-full"
      />
    </div>
  );
};

export default IntensitySlider;
