
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';

interface EmptySavedPracticesProps {
  onBrowse: () => void;
}

const EmptySavedPractices: React.FC<EmptySavedPracticesProps> = ({ onBrowse }) => {
  return (
    <Card className="p-8 bg-mental-peach/20 text-center">
      <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-mental-peach" />
      <h3 className="text-xl font-semibold mb-2 text-[#737373]">No Saved Practices</h3>
      <p className="text-[#737373] mb-4">
        You haven't saved any practices yet. Browse all practices and save your favorites!
      </p>
      <Button
        onClick={onBrowse}
        className="bg-mental-peach hover:bg-mental-peach/80"
      >
        Browse All Practices
      </Button>
    </Card>
  );
};

export default EmptySavedPractices;
