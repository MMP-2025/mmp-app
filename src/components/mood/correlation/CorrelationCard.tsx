import React from 'react';
import { Card } from '@/components/ui/card';
interface CorrelationCardProps {
  title: string;
  children: React.ReactNode;
}
const CorrelationCard: React.FC<CorrelationCardProps> = ({
  title,
  children
}) => {
  return <Card className="p-6 bg-mental-blue">
      <h3 className="text-lg font-semibold mb-4" style={{
      color: '#737373'
    }}>
        {title}
      </h3>
      {children}
    </Card>;
};
export default CorrelationCard;