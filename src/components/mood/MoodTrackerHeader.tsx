
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MoodTrackerHeaderProps {
  onExportData: () => void;
}

const MoodTrackerHeader: React.FC<MoodTrackerHeaderProps> = ({ onExportData }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Mood Tracker</h1>
        <p className="text-muted-foreground">Track and understand your emotional patterns</p>
      </div>
      <Button onClick={onExportData} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};

export default MoodTrackerHeader;
