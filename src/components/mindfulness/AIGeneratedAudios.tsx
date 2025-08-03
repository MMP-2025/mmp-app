import React, { useState } from 'react';
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
  const handlePlayPause = (audioId: string) => {
    if (playingAudio === audioId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioId);
      // Simulate audio completion after duration
      const audio = mindfulnessAudios.find(a => a.id === audioId);
      if (audio && onComplete) {
        setTimeout(() => {
          setPlayingAudio(null);
          onComplete(audioId, Math.floor(audio.duration / 60));
        }, audio.duration * 1000);
      }
    }
  };
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const getCategoryColor = (category: string) => {
    const colors = {
      'breathing': 'bg-blue-100 text-blue-800',
      'body-scan': 'bg-green-100 text-green-800',
      'meditation': 'bg-purple-100 text-purple-800',
      'sleep': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  return <div className="space-y-4">
      {mindfulnessAudios.map(audio => <Card key={audio.id} className="bg-white/90">
          <CardHeader className="pb-3 bg-mental-gray">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2" style={{
              color: '#737373'
            }}>
                  {audio.title}
                </CardTitle>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(audio.category)}`}>
                  {audio.category}
                </span>
              </div>
              <div className="text-sm font-medium" style={{
            color: '#737373'
          }}>
                {formatDuration(audio.duration)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-mental-gray">
            <p className="text-sm mb-4" style={{
          color: '#737373'
        }}>
              {audio.description}
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => handlePlayPause(audio.id)} size="sm" className="flex items-center gap-2 bg-mental-blue hover:bg-mental-blue/80">
                {playingAudio === audio.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playingAudio === audio.id ? 'Pause' : 'Play'}
              </Button>
              <Volume2 className="h-4 w-4" style={{
            color: '#737373'
          }} />
              {playingAudio === audio.id && <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-mental-blue h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>}
            </div>
          </CardContent>
        </Card>)}
    </div>;
};
export default AIGeneratedAudios;