
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  intensity: number;
  entries: number;
}

interface MoodTrendChartProps {
  weeklyTrend: TrendData[];
}

const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ weeklyTrend }) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">7-Day Mood Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weeklyTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="intensity" stroke="#B6D1D9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MoodTrendChart;
