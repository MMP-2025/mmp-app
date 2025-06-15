
import React from 'react';
import StatsCard from './StatsCard';

interface Metric {
  value: string | number;
  label: string;
}

interface StatsGridProps {
  metrics: Metric[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <StatsCard key={index} value={metric.value} label={metric.label} />
      ))}
    </div>
  );
};

export default StatsGrid;
