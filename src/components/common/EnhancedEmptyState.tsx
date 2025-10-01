import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  motivationalText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  motivationalText,
  actionLabel,
  onAction
}) => {
  return (
    <Card className="p-8 text-center animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-primary/10 p-6 rounded-full">
            <Icon className="h-12 w-12 text-primary" />
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-foreground">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {description}
      </p>
      
      {motivationalText && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 max-w-md mx-auto">
          <p className="text-sm font-medium text-primary italic">
            "{motivationalText}"
          </p>
        </div>
      )}
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          size="lg"
          className="mt-2 hover-scale"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
