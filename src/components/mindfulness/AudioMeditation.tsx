import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioMeditationProps {
  title: string;
  duration: number; // in seconds, as a fallback
  audioUrl?: string;
  onComplete: () => void;
}

const AudioMeditation: React.FC<AudioMeditationProps> = ({
  title,
  duration: initialDuration,
  audioUrl,
  onComplete
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [volume, setVolume] = useState([70]);

  const placeholderAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const source = audioUrl || placeholderAudio;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    onComplete();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleSkip = (amount: number) => {
    if(audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount));
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="p-6 bg-mental-green">
      <audio
        ref={audioRef}
        src={source}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />
      <h3 className="text-xl font-semibold mb-4 text-neutral-500">{title}</h3>
      
      {!source && (
          <div className="text-center text-neutral-500 my-8">
              Audio for this session is not available.
          </div>
      )}

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
          disabled={!source}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSkip(-30)}
          disabled={!source}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          size="lg"
          className="rounded-full w-16 h-16 bg-mental-blue hover:bg-mental-blue/80"
          disabled={!source}
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
          onClick={() => handleSkip(30)}
          disabled={!source}
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
          disabled={!source}
        />
        <span className="text-sm text-neutral-500">{volume[0]}%</span>
      </div>

      {/* Stop Button */}
      <Button
        onClick={handleStop}
        variant="outline"
        className="w-full mt-4"
        disabled={!source}
      >
        <Square className="h-4 w-4 mr-2" />
        Stop Session
      </Button>
    </Card>
  );
};

export default AudioMeditation;
