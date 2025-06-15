
import React from 'react';
import { Card } from '@/components/ui/card';
import CorrelationInsights from './correlation/CorrelationInsights';
import ExerciseCorrelationChart from './correlation/ExerciseCorrelationChart';
import SleepCorrelationChart from './correlation/SleepCorrelationChart';
import FactorAnalysisDisplay from './correlation/FactorAnalysisDisplay';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  sleepHours?: number;
  weatherCondition?: string;
  exercise?: boolean;
}

interface MoodCorrelationTrackerProps {
  moodHistory: MoodEntry[];
}

const MoodCorrelationTracker: React.FC<MoodCorrelationTrackerProps> = ({ moodHistory }) => {
  if (moodHistory.length === 0) {
    return (
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Mood Correlations</h3>
        <p style={{color: '#737373'}}>Track more mood entries to see correlations with sleep, exercise, and activities.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CorrelationInsights moodHistory={moodHistory} />
      <ExerciseCorrelationChart moodHistory={moodHistory} />
      <SleepCorrelationChart moodHistory={moodHistory} />
      <FactorAnalysisDisplay moodHistory={moodHistory} />
    </div>
  );
};

export default MoodCorrelationTracker;
