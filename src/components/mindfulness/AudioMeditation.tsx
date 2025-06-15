
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioMeditationProps {
  title: string;
  duration: number; // in seconds
  audioUrl?: string; // For future audio file integration
  onComplete: () => void;
}

const AudioMeditation: React.FC<AudioMeditationProps> = ({
  title,
  duration,
  audioUrl,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([70]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            onComplete();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <Card className="p-6 bg-mental-green">
      <h3 className="text-xl font-semibold mb-4 text-neutral-500">{title}</h3>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-neutral-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Seek Slider */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          onValueChange={handleSeek}
          max={duration}
          step={1}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          size="lg"
          className="rounded-full w-16 h-16 bg-mental-blue hover:bg-mental-blue/80"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-neutral-500" />
          ) : (
            <Play className="h-8 w-8 text-neutral-500" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentTime(Math.min(duration, currentTime + 30))}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-neutral-500" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-neutral-500">{volume[0]}%</span>
      </div>

      {/* Stop Button */}
      <Button
        onClick={handleStop}
        variant="outline"
        className="w-full mt-4"
      >
        <Square className="h-4 w-4 mr-2" />
        Stop Session
      </Button>
    </Card>
  );
};

export default AudioMeditation;
