
import React from 'react';
import PredictionCard from './PredictionCard';

interface Prediction {
  // Add prediction interface based on actual usage
  id?: string;
  type?: string;
  confidence?: number;
  description?: string;
}

interface PredictionsListProps {
  predictions: Prediction[];
}

const PredictionsList: React.FC<PredictionsListProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <p style={{color: '#737373'}}>
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
