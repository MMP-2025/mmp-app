
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface ExerciseCorrelationChartProps {
  moodHistory: MoodEntry[];
}

const ExerciseCorrelationChart: React.FC<ExerciseCorrelationChartProps> = ({ moodHistory }) => {
  const exerciseData = moodHistory.reduce((acc, entry) => {
    const exercised = entry.exercise || entry.factors.includes('Exercise');
    const key = exercised ? 'with_exercise' : 'without_exercise';
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry.intensity);
    return acc;
  }, {} as Record<string, number[]>);

  const exerciseComparison = Object.entries(exerciseData).map(([key, intensities]) => ({
    category: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    avgIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
    count: intensities.length
  }));

  if (exerciseComparison.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Exercise Impact on Mood</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={exerciseComparison}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="avgIntensity" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExerciseCorrelationChart;
