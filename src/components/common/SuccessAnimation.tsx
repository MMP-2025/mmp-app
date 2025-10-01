import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  message = "Saved successfully!",
  onComplete 
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-xl animate-scale-in">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-scale-in" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};
