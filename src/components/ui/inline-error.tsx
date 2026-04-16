import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm animate-fade-in",
      className
    )}>
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <p className="flex-1 text-foreground/80">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
};
