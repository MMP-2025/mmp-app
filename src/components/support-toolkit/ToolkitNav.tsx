
import React from 'react';
import { Button } from '@/components/ui/button';

interface ToolkitNavProps {
  currentView: 'all' | 'saved';
  setCurrentView: (view: 'all' | 'saved') => void;
  savedResourcesCount: number;
}

const ToolkitNav: React.FC<ToolkitNavProps> = ({ currentView, setCurrentView, savedResourcesCount }) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={currentView === 'all' ? 'default' : 'outline'}
        onClick={() => setCurrentView('all')}
        className="bg-mental-blue hover:bg-mental-blue/80"
      >
        All Resources
      </Button>
      <Button
        variant={currentView === 'saved' ? 'default' : 'outline'}
        onClick={() => setCurrentView('saved')}
        className="bg-mental-green hover:bg-mental-green/80"
      >
        Saved Resources ({savedResourcesCount})
      </Button>
    </div>
  );
};

export default ToolkitNav;
