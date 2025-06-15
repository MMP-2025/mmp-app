
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  disabled: boolean;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange, disabled }) => {
  return (
    <div className="flex items-center gap-3">
      <Volume2 className="h-4 w-4 text-[#737373]" />
      <Slider
        value={[volume]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="flex-1"
        disabled={disabled}
      />
      <span className="text-sm text-[#737373]">{volume}%</span>
    </div>
  );
};

export default VolumeControl;
