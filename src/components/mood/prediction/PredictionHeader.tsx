
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

const PredictionHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Brain className="h-5 w-5 text-mental-blue" />
      <h3 className="text-lg font-semibold" style={{color: '#737373'}}>AI Mood Predictions</h3>
      <Badge variant="outline" className="text-xs">Powered by pattern analysis</Badge>
    </div>
  );
};

export default PredictionHeader;
