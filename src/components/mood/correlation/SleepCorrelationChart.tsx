
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface SleepCorrelationChartProps {
  moodHistory: MoodEntry[];
}

const SleepCorrelationChart: React.FC<SleepCorrelationChartProps> = ({ moodHistory }) => {
  const sleepData = moodHistory
    .filter(entry => entry.sleepHours !== undefined)
    .map(entry => ({
      sleep: entry.sleepHours!,
      intensity: entry.intensity,
      mood: entry.mood
    }));

  if (sleepData.length <= 5) {
    return null;
  }

  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Sleep vs Mood Intensity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart data={sleepData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sleep" label={{ value: 'Hours of Sleep', position: 'insideBottom', offset: -5 }} />
          <YAxis dataKey="intensity" label={{ value: 'Mood Intensity', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Scatter dataKey="intensity" fill="#B6D1D9" />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SleepCorrelationChart;
