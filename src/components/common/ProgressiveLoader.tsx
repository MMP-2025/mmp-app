import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  delay?: number;
  loadingMessage?: string;
}

/**
 * Progressive loader that shows loading state before revealing content
 * Improves perceived performance for heavy components
 */
export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  delay = 300,
  loadingMessage = 'Loading...'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isLoaded) {
    return (
      <Card className="p-6 bg-card text-center">
        <LoadingSpinner />
        <p className="text-muted-foreground mt-2">{loadingMessage}</p>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ProgressiveLoader;