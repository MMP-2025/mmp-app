
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MoodTrackingForm from './MoodTrackingForm';
import MoodHistoryDisplay from './MoodHistoryDisplay';
import MoodAnalytics from './MoodAnalytics';
import MoodCorrelationTracker from './MoodCorrelationTracker';
import AIInsights from '../personalization/AIInsights';
import MoodPredictionSystem from './MoodPredictionSystem';
import AdvancedAnalytics from '../analytics/AdvancedAnalytics';
import HabitTracker from '../habits/HabitTracker';
import WeatherCorrelation from './WeatherCorrelation';
import TriggerPatternRecognition from './TriggerPatternRecognition';
import ProgressPhotography from '../photography/ProgressPhotography';
import CBTModules from '../therapy/CBTModules';
import ExposureTherapyTracker from '../therapy/ExposureTherapyTracker';
import CopingSkillsLibrary from '../therapy/CopingSkillsLibrary';

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

interface MoodTrackerContentProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodHistory: MoodEntry[];
  moodFactors: string[];
  userBehavior: any;
  onMoodSelection: (mood: string) => void;
  onIntensityChange: (intensity: number[]) => void;
  onNoteChange: (note: string) => void;
  onFactorToggle: (factor: string) => void;
  onSaveMood: () => void;
}

const MoodTrackerContent: React.FC<MoodTrackerContentProps> = ({
  selectedMood,
  moodIntensity,
  moodNote,
  selectedFactors,
  moodHistory,
  moodFactors,
  userBehavior,
  onMoodSelection,
  onIntensityChange,
  onNoteChange,
  onFactorToggle,
  onSaveMood
}) => {
  return (
    <>
      <TabsContent value="track" className="space-y-6">
        <MoodTrackingForm
          selectedMood={selectedMood}
          moodIntensity={moodIntensity}
          moodNote={moodNote}
          selectedFactors={selectedFactors}
          moodFactors={moodFactors}
          onMoodSelection={onMoodSelection}
          onIntensityChange={onIntensityChange}
          onNoteChange={onNoteChange}
          onFactorToggle={onFactorToggle}
          onSaveMood={onSaveMood}
        />
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <MoodHistoryDisplay moodHistory={moodHistory} />
      </TabsContent>

      <TabsContent value="analytics">
        <MoodAnalytics moodHistory={moodHistory} />
      </TabsContent>

      <TabsContent value="advanced">
        <AdvancedAnalytics />
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

      <TabsContent value="photography">
        <ProgressPhotography />
      </TabsContent>

      <TabsContent value="cbt">
        <div className="space-y-6">
          <CBTModules />
          <ExposureTherapyTracker />
        </div>
      </TabsContent>

      <TabsContent value="coping">
        <CopingSkillsLibrary />
      </TabsContent>
    </>
  );
};

export default MoodTrackerContent;
