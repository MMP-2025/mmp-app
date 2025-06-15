
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  location?: string;
  sleepHours?: number;
  exercise?: boolean;
}

interface MoodHistoryItemProps {
  entry: MoodEntry;
}

const MoodHistoryItem: React.FC<MoodHistoryItemProps> = ({ entry }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Ecstatic': return Laugh;
      case 'Happy': return Smile;
      case 'Neutral': return Meh;
      case 'Sad': return Frown;
      case 'Angry': return Angry;
      default: return Meh;
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-red-500';
    if (intensity <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const MoodIcon = getMoodIcon(entry.mood);

  return (
    <div className="flex items-start gap-3 p-4 bg-mental-peach/20 rounded-md">
      <MoodIcon className="h-6 w-6 mt-1" style={{color: '#737373'}} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{color: '#737373'}}>{entry.mood}</span>
            <Badge variant="outline" className={getIntensityColor(entry.intensity)}>
              {entry.intensity}/10
            </Badge>
          </div>
          <span className="text-sm" style={{color: '#737373'}}>{formatDate(entry.timestamp)}</span>
        </div>
        {entry.factors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {entry.factors.map(factor => (
              <Badge key={factor} variant="secondary" className="text-xs">
                {factor}
              </Badge>
            ))}
          </div>
        )}
        {entry.note && (
          <p className="text-sm" style={{color: '#737373'}}>{entry.note}</p>
        )}
      </div>
    </div>
  );
};

export default MoodHistoryItem;
