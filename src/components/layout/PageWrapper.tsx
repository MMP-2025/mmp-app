import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  const location = useLocation();
  
  const getPageBackgroundClass = (pathname: string) => {
    if (pathname === '/') return 'bg-[hsl(var(--page-home))]';
    if (pathname.startsWith('/mood')) return 'bg-[hsl(var(--page-mood))]';
    if (pathname.startsWith('/journal')) return 'bg-[hsl(var(--page-journal))]';
    if (pathname.startsWith('/mindfulness')) return 'bg-[hsl(var(--page-mindfulness))]';
    if (pathname.startsWith('/planner')) return 'bg-[hsl(var(--page-planner))]';
    if (pathname.startsWith('/reminders')) return 'bg-[hsl(var(--page-reminders))]';
    if (pathname.startsWith('/support-toolkit')) return 'bg-[hsl(var(--page-support))]';
    if (pathname.startsWith('/timer')) return 'bg-[hsl(var(--page-timer))]';
    return 'bg-[hsl(var(--background))]'; // default fallback
  };

  const backgroundClass = getPageBackgroundClass(location.pathname);

  return (
    <div className={`min-h-screen ${backgroundClass} ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;