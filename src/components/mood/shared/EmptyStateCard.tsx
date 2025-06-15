
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <Card className="p-6 bg-white/90 text-center">
      <Icon className="h-12 w-12 mx-auto mb-4" style={{color: '#737373'}} />
      <h3 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>
        {title}
      </h3>
      <p className="mb-4" style={{color: '#737373'}}>
        {description}
      </p>
      {action && action}
    </Card>
  );
};

export default EmptyStateCard;
