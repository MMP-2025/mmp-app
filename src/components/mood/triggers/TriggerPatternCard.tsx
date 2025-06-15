
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Lightbulb, Target } from 'lucide-react';

interface TriggerPattern {
  trigger: string;
  frequency: number;
  averageMoodImpact: number;
  associatedFactors: string[];
  recentOccurrences: number;
  severity: 'low' | 'medium' | 'high';
}

interface TriggerPatternCardProps {
  trigger: TriggerPattern;
}

const TriggerPatternCard: React.FC<TriggerPatternCardProps> = ({ trigger }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'low': return 'text-secondary bg-secondary/10 border-secondary/20';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return TrendingDown;
      case 'low': return Target;
      default: return Lightbulb;
    }
  };

  const getRecommendation = (triggerName: string) => {
    switch (triggerName.toLowerCase()) {
      case 'stress':
        return 'Try deep breathing exercises or progressive muscle relaxation when you notice stress building up.';
      case 'work':
        return 'Consider setting boundaries at work and practicing time management techniques.';
      case 'relationships':
        return 'Practice active listening and consider couples or family therapy if conflicts persist.';
      case 'health':
        return 'Prioritize sleep, nutrition, and regular medical check-ups. Consider speaking with a healthcare provider.';
      case 'money':
        return 'Create a budget and consider speaking with a financial advisor about managing money stress.';
      case 'social':
        return 'Try to engage in social activities and limit social media if it triggers comparison.';
      default:
        return 'Consider developing coping strategies specific to this trigger and track when it occurs.';
    }
  };

  const SeverityIcon = getSeverityIcon(trigger.severity);

  return (
    <div className={`p-4 rounded-lg border ${getSeverityColor(trigger.severity)}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <SeverityIcon className="h-5 w-5" />
          <h5 className="font-medium">{trigger.trigger}</h5>
        </div>
        <Badge variant="outline" className={`text-xs ${trigger.severity === 'high' ? 'border-destructive' : trigger.severity === 'medium' ? 'border-orange-500' : 'border-secondary'}`}>
          {trigger.severity} priority
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="font-medium">Frequency:</span> {trigger.frequency} times
        </div>
        <div>
          <span className="font-medium">Recent:</span> {trigger.recentOccurrences} in last 30 days
        </div>
        <div>
          <span className="font-medium">Avg Mood Impact:</span> {trigger.averageMoodImpact.toFixed(1)}/10
        </div>
        <div>
          <span className="font-medium">Associated:</span> {trigger.associatedFactors.slice(0, 2).join(', ')}
        </div>
      </div>
      
      <div className="bg-white/50 p-3 rounded text-sm">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 mt-0.5 text-mental-blue" />
          <p><strong>Recommendation:</strong> {getRecommendation(trigger.trigger)}</p>
        </div>
      </div>
    </div>
  );
};

export default TriggerPatternCard;
