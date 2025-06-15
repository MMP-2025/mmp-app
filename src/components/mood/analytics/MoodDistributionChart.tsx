
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MoodDistribution {
  mood: string;
  count: number;
}

interface MoodDistributionChartProps {
  moodDistribution: MoodDistribution[];
}

const COLORS = ['#E5C7B5', '#AEC29B', '#B6D1D9', '#FADCD6', '#CCC6C6'];

const MoodDistributionChart: React.FC<MoodDistributionChartProps> = ({ moodDistribution }) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Mood Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={moodDistribution}
            dataKey="count"
            nameKey="mood"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {moodDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MoodDistributionChart;
