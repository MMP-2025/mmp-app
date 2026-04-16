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
    <Card className="p-10 text-center animate-scale-in shadow-card-elevated border-dashed">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-breathe" />
          <div className="relative bg-gradient-to-br from-primary/15 to-sage-light p-7 rounded-full">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-merriweather font-semibold mb-2 text-foreground">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      
      {motivationalText && (
        <div className="bg-sage-light/60 border border-primary/10 rounded-xl p-4 mb-5 max-w-sm mx-auto">
          <p className="text-sm font-medium text-foreground/70 italic">
            "{motivationalText}"
          </p>
        </div>
      )}
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          size="lg"
          className="mt-1 rounded-xl shadow-card-hover"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
