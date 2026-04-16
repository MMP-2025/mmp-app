import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  hover?: boolean;
  elevated?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  hover = true,
  elevated = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "opacity-0 animate-fade-in-up rounded-xl border bg-card text-card-foreground transition-all duration-200",
        elevated ? "shadow-card-elevated" : "shadow-card",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      {...props}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  baseDelay?: number;
  increment?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  baseDelay = 0,
  increment = 80,
  className,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${baseDelay + index * increment}ms`,
            animationFillMode: 'forwards',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
};
