
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MoodTrackerHeaderProps {
  onExportData: () => void;
}

const MoodTrackerHeader: React.FC<MoodTrackerHeaderProps> = ({ onExportData }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="flex items-center gap-2" style={{color: '#737373'}}>
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Mood Tracker</h1>
          <p style={{color: '#737373'}}>Track and understand your emotional patterns</p>
        </div>
      </div>
      <Button onClick={onExportData} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};

export default MoodTrackerHeader;
