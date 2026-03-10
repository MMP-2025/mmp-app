
import React from 'react';
import PredictionCard from './PredictionCard';

interface Prediction {
  type: 'risk' | 'improvement' | 'maintenance';
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
  description: string;
}

interface PredictionsListProps {
  predictions: Prediction[];
}

const PredictionsList: React.FC<PredictionsListProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No strong patterns detected yet. Continue tracking to improve prediction accuracy.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction, index) => (
        <PredictionCard key={index} prediction={prediction} />
      ))}
    </div>
  );
};

export default PredictionsList;
