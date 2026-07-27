
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
        type: 'A stretch of lower days',
        severity: 'high',
        message: `${consecutiveLow} days in a row with a lower mood rating (4 or below).`,
        action: 'This may be worth bringing up with your therapist. If you\'re in crisis, the Crisis Resources page has immediate support options.'
      });
    }

    // Rapid mood decline
    if (recent5Days.length >= 3) {
      const intensities = recent5Days.map(e => e.intensity);
      const decline = intensities[0] - intensities[intensities.length - 1];
      if (decline >= 3) {
        warnings.push({
          type: 'A noticeable dip',
          severity: 'medium',
          message: `Your mood ratings have dropped ${decline} points over the last ${intensities.length} days.`,
          action: 'A pattern like this can be a useful thing to share in your next session.'
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
    <Card className="p-6 bg-mental-peach/20 border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Patterns to Notice</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        These are observations from your own entries — not a diagnosis or a clinical assessment.
      </p>
      <div className="space-y-3">
        {earlyWarnings.map((warning, index) => (
          <div key={index} className="p-3 bg-card rounded-md border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{warning.type}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{warning.message}</p>
            <p className="flex items-center text-xs font-medium text-foreground">
              <Lightbulb className="h-4 w-4 mr-1.5 text-mental-blue shrink-0" />
              {warning.action}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EarlyWarningSystem;
