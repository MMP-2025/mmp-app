import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
interface ViewTabsProps {
  currentView: 'all' | 'saved';
  setCurrentView: (view: 'all' | 'saved') => void;
  savedExercisesCount: number;
  onShuffle: () => void;
}
const ViewTabs: React.FC<ViewTabsProps> = ({
  currentView,
  setCurrentView,
  savedExercisesCount,
  onShuffle
}) => {
  return <div className="flex gap-2 mb-6">
      <Button variant={currentView === 'all' ? 'default' : 'outline'} onClick={() => setCurrentView('all')} className="bg-mental-green">
        All Practices
      </Button>
      <Button variant={currentView === 'saved' ? 'default' : 'outline'} onClick={() => setCurrentView('saved')} className="bg-mental-green hover:bg-mental-green/80">
        Saved Practices ({savedExercisesCount})
      </Button>
      {currentView === 'all' && <Button variant="outline" onClick={onShuffle}>
          <Shuffle className="h-4 w-4 mr-2" />
          New Practices
        </Button>}
    </div>;
};
export default ViewTabs;