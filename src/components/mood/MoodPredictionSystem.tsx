
import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import EarlyWarningSystem from './prediction/EarlyWarningSystem';
import PredictionHeader from './prediction/PredictionHeader';
import PredictionsList from './prediction/PredictionsList';
import PredictionExplanation from './prediction/PredictionExplanation';
import { usePredictionAnalytics } from './prediction/PredictionAnalytics';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  sleepHours?: number;
  exercise?: boolean;
}

interface MoodPredictionSystemProps {
  moodHistory: MoodEntry[];
}

const MoodPredictionSystem: React.FC<MoodPredictionSystemProps> = ({ moodHistory }) => {
  const predictions = usePredictionAnalytics(moodHistory);

  if (moodHistory.length < 7) {
    return (
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold" style={{color: '#737373'}}>Mood Predictions</h3>
        </div>
        <p style={{color: '#737373'}}>
          Track your mood for at least 7 days to unlock AI-powered predictions and early warning systems.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EarlyWarningSystem moodHistory={moodHistory} />

      <Card className="p-6 bg-white/90">
        <PredictionHeader />
        <PredictionsList predictions={predictions} />
      </Card>

      <PredictionExplanation />
    </div>
  );
};

export default MoodPredictionSystem;
