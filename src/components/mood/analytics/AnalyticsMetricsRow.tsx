
import React from 'react';
import StatsGrid from './StatsGrid';

interface AnalyticsMetricsRowProps {
  metrics: Array<{ value: string | number; label: string }>;
}

const AnalyticsMetricsRow: React.FC<AnalyticsMetricsRowProps> = ({ metrics }) => {
  return <StatsGrid metrics={metrics} />;
};

export default AnalyticsMetricsRow;
