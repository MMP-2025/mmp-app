
import React from 'react';
import MoodHistoryItem from './MoodHistoryItem';

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

interface MoodHistoryListProps {
  moodHistory: MoodEntry[];
}

const MoodHistoryList: React.FC<MoodHistoryListProps> = ({ moodHistory }) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {moodHistory.slice(0, 20).map(entry => (
        <MoodHistoryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default MoodHistoryList;
