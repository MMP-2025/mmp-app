import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MoodCorrelationTracker from '../MoodCorrelationTracker';
import MoodPredictionSystem from '../MoodPredictionSystem';
import WeatherCorrelation from '../WeatherCorrelation';
import TriggerPatternRecognition from '../TriggerPatternRecognition';
import AIInsights from '../../personalization/AIInsights';
import HabitTracker from '../../habits/HabitTracker';
import { Card } from '@/components/ui/card';
interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}
interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  location?: string;
  weather?: WeatherData;
  sleepHours?: number;
  exercise?: boolean;
}
interface AdvancedTabContentProps {
  moodHistory: MoodEntry[];
  userBehavior: any;
}
const AdvancedTabContent: React.FC<AdvancedTabContentProps> = ({
  moodHistory,
  userBehavior
}) => {
  return <>
      <TabsContent value="advanced">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground">Advanced Analytics</h3>
          <p className="text-muted-foreground">
            More advanced analytics are coming soon!
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="correlations">
        <MoodCorrelationTracker moodHistory={moodHistory} />
      </TabsContent>

      <TabsContent value="insights">
        <AIInsights moodHistory={moodHistory} userBehavior={userBehavior} />
      </TabsContent>

      <TabsContent value="predictions">
        <MoodPredictionSystem moodHistory={moodHistory} />
      </TabsContent>

      <TabsContent value="habits">
        <HabitTracker />
      </TabsContent>

      <TabsContent value="environment">
        <div className="space-y-6">
          <WeatherCorrelation moodHistory={moodHistory} />
          <TriggerPatternRecognition moodHistory={moodHistory} />
        </div>
      </TabsContent>
    </>;
};
export default AdvancedTabContent;