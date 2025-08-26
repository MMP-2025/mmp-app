
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  value: string | number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <Card className="p-4 bg-card">
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
};

export default StatsCard;
