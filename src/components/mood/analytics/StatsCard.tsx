
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  value: string | number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <Card className="p-4 bg-white/90">
      <div className="text-center">
        <div className="text-2xl font-bold" style={{color: '#737373'}}>{value}</div>
        <div className="text-sm" style={{color: '#737373'}}>{label}</div>
      </div>
    </Card>
  );
};

export default StatsCard;
