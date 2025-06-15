
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FactorBadgeProps {
  factor: string;
  isSelected: boolean;
  onToggle: (factor: string) => void;
}

const FactorBadge: React.FC<FactorBadgeProps> = ({
  factor,
  isSelected,
  onToggle
}) => {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected 
          ? 'bg-mental-peach text-gray-700 border-gray-400' 
          : 'hover:bg-mental-peach/40'
      }`}
      onClick={() => onToggle(factor)}
    >
      {factor}
    </Badge>
  );
};

export default FactorBadge;
