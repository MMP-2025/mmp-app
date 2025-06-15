
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';

interface MindfulnessEmptyStateProps {
  onBrowseAll: () => void;
}

const MindfulnessEmptyState: React.FC<MindfulnessEmptyStateProps> = ({ onBrowseAll }) => {
  return (
    <Card className="p-8 bg-mental-peach/20 text-center">
      <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-mental-peach" />
      <h3 className="text-xl font-semibold mb-2">No Saved Exercises</h3>
      <p className="text-muted-foreground mb-4">
        You haven't saved any exercises yet. Browse all exercises and save your favorites!
      </p>
      <Button 
        onClick={onBrowseAll} 
        className="bg-mental-blue hover:bg-mental-blue/80"
      >
        Browse All Exercises
      </Button>
    </Card>
  );
};

export default MindfulnessEmptyState;
