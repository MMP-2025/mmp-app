
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  sleepHours?: number;
  exercise?: boolean;
}

interface EarlyWarning {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  action: string;
}

interface EarlyWarningSystemProps {
  moodHistory: MoodEntry[];
}

const EarlyWarningSystem: React.FC<EarlyWarningSystemProps> = ({ moodHistory }) => {
  const getEarlyWarnings = (): EarlyWarning[] => {
    if (moodHistory.length < 5) return [];
    
    const recent5Days = moodHistory.slice(0, 5);
    const warnings: EarlyWarning[] = [];

    // Consecutive low mood days
    const consecutiveLow = recent5Days.filter(entry => entry.intensity <= 4).length;
    if (consecutiveLow >= 3) {
      warnings.push({
        type: 'Persistent Low Mood',
        severity: 'high',
        message: `${consecutiveLow} consecutive days with mood intensity ≤ 4/10`,
        action: 'Consider reaching out to a mental health professional'
      });
    }

    // Rapid mood decline
    if (recent5Days.length >= 3) {
      const intensities = recent5Days.map(e => e.intensity);
      const decline = intensities[0] - intensities[intensities.length - 1];
      if (decline >= 3) {
        warnings.push({
          type: 'Rapid Mood Decline',
          severity: 'medium',
          message: `Mood intensity dropped ${decline} points in ${intensities.length} days`,
          action: 'Focus on stress management and self-care activities'
        });
      }
    }

    return warnings;
  };

  const earlyWarnings = getEarlyWarnings();

  if (earlyWarnings.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-destructive/10 border-destructive/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold text-destructive">Early Warning System</h3>
      </div>
      <div className="space-y-3">
        {earlyWarnings.map((warning, index) => (
          <div key={index} className="p-3 bg-white/80 rounded-md border border-destructive/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-destructive">{warning.type}</h4>
              <Badge variant={warning.severity === 'high' ? 'destructive' : 'outline'}>
                {warning.severity} priority
              </Badge>
            </div>
            <p className="text-sm text-destructive mb-2">{warning.message}</p>
            <p className="flex items-center text-xs font-medium text-destructive">
              <Lightbulb className="h-4 w-4 mr-1.5 text-mental-blue" />
              {warning.action}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EarlyWarningSystem;
