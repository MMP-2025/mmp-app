import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import AudioProgress from './AudioProgress';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
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
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    source,
    actions
  } = useAudioPlayer({
    audioUrl,
    onComplete,
    initialDuration
  });
  return <Card className="p-6">
      <audio ref={audioRef} src={source} onLoadedMetadata={actions.handleLoadedMetadata} onTimeUpdate={actions.handleTimeUpdate} onEnded={actions.handleAudioEnded} />
      <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
      
      {!source && <div className="text-center text-[#737373] my-8">
              Audio for this session is not available.
          </div>}

      <AudioProgress currentTime={currentTime} duration={duration} onSeek={actions.seek} disabled={!source} />

      <AudioControls isPlaying={isPlaying} onPlayPause={actions.togglePlayPause} onSkip={actions.skip} disabled={!source} />

      <VolumeControl volume={volume[0]} onVolumeChange={actions.setVolume} disabled={!source} />

      <Button onClick={actions.stop} variant="outline" className="w-full mt-4" disabled={!source}>
        <Square className="h-4 w-4 mr-2" />
        Stop Session
      </Button>
    </Card>;
};
export default AudioMeditation;