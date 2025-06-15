
import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerProps {
  audioUrl?: string;
  onComplete: () => void;
  initialDuration?: number;
}

export const useAudioPlayer = ({ audioUrl, onComplete, initialDuration = 0 }: UseAudioPlayerProps) => {
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const seek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const skip = (amount: number) => {
    if(audioRef.current) {
      if (duration === 0) return;
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    source,
    actions: {
      togglePlayPause,
      stop,
      seek,
      skip,
      setVolume,
      handleLoadedMetadata,
      handleTimeUpdate,
      handleAudioEnded,
    },
  };
};
