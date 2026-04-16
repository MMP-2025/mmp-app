import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Smile, FileText, Brain, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const tabs = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Smile, label: 'Mood', path: '/mood' },
  { icon: FileText, label: 'Journal', path: '/journal' },
  { icon: Brain, label: 'Mindfulness', path: '/mindfulness' },
  { icon: Phone, label: 'Crisis', path: '/crisis' },
];

const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-card-elevated" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] min-h-[44px] no-underline",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className={cn("text-[10px] font-medium leading-none", isActive && "font-semibold")}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
