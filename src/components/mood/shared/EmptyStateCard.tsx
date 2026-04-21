
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
    <Card className="p-6 bg-card text-center card-elevated">
      <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="mb-4 text-muted-foreground">
        {description}
      </p>
      {action && action}
    </Card>
  );
};

export default EmptyStateCard;
