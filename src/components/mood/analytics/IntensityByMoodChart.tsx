
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IntensityData {
  mood: string;
  avgIntensity: number;
}

interface IntensityByMoodChartProps {
  avgIntensityByMood: IntensityData[];
}

const IntensityByMoodChart: React.FC<IntensityByMoodChartProps> = ({ avgIntensityByMood }) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Average Intensity by Mood</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={avgIntensityByMood}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mood" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="avgIntensity" fill="#AEC29B" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IntensityByMoodChart;
