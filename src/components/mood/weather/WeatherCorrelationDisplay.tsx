
import React from 'react';
import WeatherCorrelationChart from './WeatherCorrelationChart';
import WeatherAnalysisDisplay from './WeatherAnalysisDisplay';

interface WeatherCorrelationDisplayProps {
  correlations: any[] | null;
  dataCount: number;
}

const WeatherCorrelationDisplay: React.FC<WeatherCorrelationDisplayProps> = ({
  correlations,
  dataCount
}) => {
  if (correlations && correlations.length > 0) {
    return <WeatherCorrelationChart correlations={correlations} />;
  }

  return (
    <WeatherAnalysisDisplay 
      correlations={correlations} 
      dataCount={dataCount} 
    />
  );
};

export default WeatherCorrelationDisplay;
