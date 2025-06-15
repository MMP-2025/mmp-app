
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: (amount: number) => void;
  disabled: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkip,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSkip(-30)}
        disabled={disabled}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={onPlayPause}
        size="lg"
        className="rounded-full w-16 h-16 bg-mental-blue hover:bg-mental-blue/80"
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-[#737373]" />
        ) : (
          <Play className="h-8 w-8 text-[#737373]" />
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSkip(30)}
        disabled={disabled}
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AudioControls;
