import React from 'react';
import { Button } from '@/components/ui/button';

interface AccessibilityButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

/**
 * Accessible button component with proper ARIA labels and keyboard navigation
 */
export const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({
  onClick,
  children,
  ariaLabel,
  variant = 'default',
  className = ''
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={className}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </Button>
  );
};

export default AccessibilityButton;