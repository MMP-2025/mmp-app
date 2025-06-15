
import React from 'react';
import CorrelationCard from './CorrelationCard';

const EmptyCorrelationState: React.FC = () => {
  return (
    <CorrelationCard title="Mood Correlations">
      <p style={{color: '#737373'}}>
        Track more mood entries to see correlations with sleep, exercise, and activities.
      </p>
    </CorrelationCard>
  );
};

export default EmptyCorrelationState;
