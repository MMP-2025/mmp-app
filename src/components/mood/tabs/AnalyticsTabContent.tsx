
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MoodAnalytics from '../MoodAnalytics';
import MoodHistoryDisplay from '../MoodHistoryDisplay';

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

interface AnalyticsTabContentProps {
  moodHistory: MoodEntry[];
}

const AnalyticsTabContent: React.FC<AnalyticsTabContentProps> = ({ moodHistory }) => {
  return (
    <>
      <TabsContent value="history" className="space-y-6">
        <MoodHistoryDisplay moodHistory={moodHistory} />
      </TabsContent>

      <TabsContent value="analytics">
        <MoodAnalytics moodHistory={moodHistory} />
      </TabsContent>
    </>
  );
};

export default AnalyticsTabContent;
