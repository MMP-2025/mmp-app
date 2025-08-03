import React from 'react';
import { Card } from '@/components/ui/card';
import MoodHistoryHeader from './history/MoodHistoryHeader';
import EmptyHistoryMessage from './history/EmptyHistoryMessage';
import MoodHistoryList from './history/MoodHistoryList';
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
interface MoodHistoryDisplayProps {
  moodHistory: MoodEntry[];
}
const MoodHistoryDisplay: React.FC<MoodHistoryDisplayProps> = ({
  moodHistory
}) => {
  return <Card className="p-6 bg-mental-blue">
      <MoodHistoryHeader />
      {moodHistory.length === 0 ? <EmptyHistoryMessage /> : <MoodHistoryList moodHistory={moodHistory} />}
    </Card>;
};
export default MoodHistoryDisplay;