import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { mindfulnessAudios } from '@/data/mindfulnessAudios';
interface AIGeneratedAudiosProps {
  onComplete?: (audioId: string, duration: number) => void;
}
const AIGeneratedAudios: React.FC<AIGeneratedAudiosProps> = ({
  onComplete
}) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const handlePlayPause = async (audioId: string) => {
    const current = audioRefs.current[audioId];

    // Pause previous audio if different
    if (playingAudio && playingAudio !== audioId) {
      const prev = audioRefs.current[playingAudio];
      prev?.pause();
      prev && (prev.currentTime = 0);
    }

    if (playingAudio === audioId) {
      current?.pause();
      setPlayingAudio(null);
    } else {
      if (current) {
        await current.play();
        setPlayingAudio(audioId);
      }
    }
  };
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'breathing': 'bg-primary/20 text-foreground',
      'body-scan': 'bg-accent/20 text-foreground',
      'meditation': 'bg-secondary/20 text-foreground',
      'sleep': 'bg-muted/50 text-foreground'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };
  return <div className="space-y-4">
      {mindfulnessAudios.map(audio => <Card key={audio.id} className="bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2 text-foreground">
                  {audio.title}
                </CardTitle>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(audio.category)}`}>
                  {audio.category}
                </span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {formatDuration(audio.duration)}
              </div>
            </div>
          </CardHeader>
          {audio.audioUrl && (
            <audio
              ref={(el) => (audioRefs.current[audio.id] = el)}
              src={audio.audioUrl}
              preload="none"
              onEnded={() => {
                setPlayingAudio(null);
                onComplete?.(audio.id, Math.floor(audio.duration));
              }}
            />
          )}
          <CardContent>
            <p className="text-sm mb-4 text-muted-foreground">
              {audio.description}
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => handlePlayPause(audio.id)} size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90" disabled={!audio.audioUrl}>
                {playingAudio === audio.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playingAudio === audio.id ? 'Pause' : (audio.audioUrl ? 'Play' : 'No audio')}
              </Button>
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              {playingAudio === audio.id && <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>}
            </div>
          </CardContent>
        </Card>)}
    </div>;
};
export default AIGeneratedAudios;