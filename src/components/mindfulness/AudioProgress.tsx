
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity || seconds < 0) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface AudioProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
  disabled: boolean;
}

const AudioProgress: React.FC<AudioProgressProps> = ({ currentTime, duration, onSeek, disabled }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="mb-6">
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-[#737373]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          onValueChange={onSeek}
          max={duration || 1}
          step={1}
          className="w-full"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default AudioProgress;
