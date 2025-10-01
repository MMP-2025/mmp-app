
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookmarkPlus } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/common/EnhancedEmptyState';

interface MindfulnessEmptyStateProps {
  onBrowseAll: () => void;
}

const MindfulnessEmptyState: React.FC<MindfulnessEmptyStateProps> = ({ onBrowseAll }) => {
  return (
    <EnhancedEmptyState
      icon={BookmarkPlus}
      title="No Saved Exercises"
      description="You haven't saved any mindfulness exercises yet. Browse our collection and save the ones that resonate with you."
      motivationalText="The present moment is the only time over which we have dominion"
      actionLabel="Browse All Exercises"
      onAction={onBrowseAll}
    />
  );
};

export default MindfulnessEmptyState;
