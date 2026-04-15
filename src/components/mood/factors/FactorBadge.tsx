
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
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'hover:bg-mental-peach text-foreground'
      }`}
      onClick={() => onToggle(factor)}
    >
      {factor}
    </Badge>
  );
};

export default FactorBadge;
