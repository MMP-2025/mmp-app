
import React from 'react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  value: string | number;
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
  <Card className="p-4 bg-white/90">
    <div className="text-center">
      <div className="text-2xl font-bold" style={{color: '#737373'}}>{value}</div>
      <div className="text-sm" style={{color: '#737373'}}>{label}</div>
    </div>
  </Card>
);

interface AnalyticsMetricsRowProps {
  metrics: Array<{ value: string | number; label: string }>;
}

const AnalyticsMetricsRow: React.FC<AnalyticsMetricsRowProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} value={metric.value} label={metric.label} />
      ))}
    </div>
  );
};

export default AnalyticsMetricsRow;
