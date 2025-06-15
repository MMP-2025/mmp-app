
import React from 'react';
import CorrelationInsights from './correlation/CorrelationInsights';
import ExerciseCorrelationChart from './correlation/ExerciseCorrelationChart';
import SleepCorrelationChart from './correlation/SleepCorrelationChart';
import FactorAnalysisDisplay from './correlation/FactorAnalysisDisplay';
import EmptyCorrelationState from './correlation/EmptyCorrelationState';

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
    return <EmptyCorrelationState />;
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
