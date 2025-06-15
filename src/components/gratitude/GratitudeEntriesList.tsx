
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { GratitudeEntry } from '@/types/gratitude';

interface GratitudeEntriesListProps {
  entries: GratitudeEntry[];
}

const GratitudeEntriesList: React.FC<GratitudeEntriesListProps> = ({ entries }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#737373]">Your Gratitude Collection</h2>
      
      {entries.length === 0 ? (
        <p className="text-center text-[#737373]">Your gratitude entries will appear here</p>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="border border-mental-gray/20 rounded-md p-4">
              <div className="flex items-center gap-1 mb-2 text-sm text-[#737373]">
                <Check className="h-4 w-4 text-mental-green" />
                <span>{formatDate(entry.date)}</span>
              </div>
              <p className="whitespace-pre-wrap text-[#737373]">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GratitudeEntriesList;
