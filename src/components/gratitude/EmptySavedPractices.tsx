
import React from 'react';
import { BookmarkPlus } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/common/EnhancedEmptyState';

interface EmptySavedPracticesProps {
  onBrowse: () => void;
}

const EmptySavedPractices: React.FC<EmptySavedPracticesProps> = ({ onBrowse }) => {
  return (
    <EnhancedEmptyState
      icon={BookmarkPlus}
      title="No Saved Practices Yet"
      description="You haven't saved any gratitude practices yet. Start exploring exercises and save your favorites to build your personal collection!"
      motivationalText="Every journey of gratitude begins with a single practice"
      actionLabel="Browse All Practices"
      onAction={onBrowse}
    />
  );
};

export default EmptySavedPractices;
