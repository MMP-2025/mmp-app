
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MoodTrackerHeaderProps {
  onExportData: () => void;
}

const MoodTrackerHeader: React.FC<MoodTrackerHeaderProps> = ({ onExportData }) => {
  return (
    <div className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
      <div>
        <h1 className="text-2xl font-merriweather font-bold mb-1 text-foreground">Mood Tracker</h1>
        <p className="text-sm text-muted-foreground">Track and understand your emotional patterns</p>
      </div>
      <Button onClick={onExportData} variant="outline" className="flex items-center gap-2 rounded-xl">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default MoodTrackerHeader;
