
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

const COLORS = [
  'hsl(22, 42%, 80%)',   /* #E5C7B5 warm peach */
  'hsl(91, 24%, 68%)',   /* #AEC29B sage green */
  'hsl(194, 30%, 78%)',  /* #B6D1D9 soft blue */
  'hsl(10, 82%, 91%)',   /* #FADCD6 light peach */
  'hsl(0, 5%, 79%)',     /* #CCC6C6 warm gray */
];

const MoodDistributionChart: React.FC<MoodDistributionChartProps> = ({ moodDistribution }) => {
  return (
    <Card className="p-6 bg-card">
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
            fill="hsl(var(--primary))"
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
