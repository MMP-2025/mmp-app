
import React from 'react';
import FactorBadge from './FactorBadge';

interface FactorsGridProps {
  factors: string[];
  selectedFactors: string[];
  onFactorToggle: (factor: string) => void;
}

const FactorsGrid: React.FC<FactorsGridProps> = ({
  factors,
  selectedFactors,
  onFactorToggle
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {factors.map(factor => (
        <FactorBadge
          key={factor}
          factor={factor}
          isSelected={selectedFactors.includes(factor)}
          onToggle={onFactorToggle}
        />
      ))}
    </div>
  );
};

export default FactorsGrid;
