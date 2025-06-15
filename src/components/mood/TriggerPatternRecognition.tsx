
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { Brain, AlertTriangle, TrendingDown, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  content: string;
  date: Date;
  mood?: string;
  moodIntensity?: number;
}

interface MoodEntry {
  mood: string;
  intensity: number;
  note: string;
  factors: string[];
  timestamp: number;
}

interface TriggerPattern {
  trigger: string;
  frequency: number;
  averageMoodImpact: number;
  associatedFactors: string[];
  recentOccurrences: number;
  severity: 'low' | 'medium' | 'high';
}

interface TriggerPatternRecognitionProps {
  moodHistory?: MoodEntry[];
  journalEntries?: JournalEntry[];
}

const TriggerPatternRecognition: React.FC<TriggerPatternRecognitionProps> = ({ 
  moodHistory = [], 
  journalEntries = [] 
}) => {
  const [triggers, setTriggers] = useState<TriggerPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const savedTriggers = StorageManager.load<TriggerPattern[]>('trigger_patterns', []);
    setTriggers(savedTriggers);
  }, []);

  // Keywords that might indicate triggers in journal entries
  const triggerKeywords = {
    stress: ['stress', 'stressed', 'pressure', 'overwhelmed', 'anxious', 'worry'],
    work: ['work', 'job', 'boss', 'deadline', 'meeting', 'office', 'colleague'],
    relationships: ['fight', 'argument', 'relationship', 'partner', 'family', 'friend', 'conflict'],
    health: ['sick', 'tired', 'pain', 'headache', 'insomnia', 'fatigue'],
    money: ['money', 'financial', 'bills', 'debt', 'budget', 'expensive'],
    social: ['lonely', 'isolated', 'social media', 'comparison', 'rejection'],
    change: ['change', 'transition', 'moving', 'new', 'uncertain', 'unknown']
  };

  const analyzeTriggerPatterns = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const triggerCounts: Record<string, {
        count: number;
        moodImpacts: number[];
        factors: string[];
        recentCount: number;
      }> = {};

      // Analyze journal entries for trigger keywords
      journalEntries.forEach(entry => {
        const content = entry.content.toLowerCase();
        const entryDate = new Date(entry.date);
        const isRecent = Date.now() - entryDate.getTime() < 30 * 24 * 60 * 60 * 1000; // Last 30 days
        
        Object.entries(triggerKeywords).forEach(([triggerType, keywords]) => {
          const found = keywords.some(keyword => content.includes(keyword));
          if (found) {
            if (!triggerCounts[triggerType]) {
              triggerCounts[triggerType] = { count: 0, moodImpacts: [], factors: [], recentCount: 0 };
            }
            triggerCounts[triggerType].count += 1;
            if (isRecent) triggerCounts[triggerType].recentCount += 1;
            
            // Try to correlate with mood entries from the same day
            const sameDay = moodHistory.find(mood => {
              const moodDate = new Date(mood.timestamp);
              return moodDate.toDateString() === entryDate.toDateString();
            });
            
            if (sameDay) {
              triggerCounts[triggerType].moodImpacts.push(sameDay.intensity);
              triggerCounts[triggerType].factors.push(...sameDay.factors);
            }
          }
        });
      });

      // Analyze mood entries for factor patterns
      moodHistory.forEach(entry => {
        const entryDate = new Date(entry.timestamp);
        const isRecent = Date.now() - entryDate.getTime() < 30 * 24 * 60 * 60 * 1000;
        
        if (entry.intensity <= 4) { // Low mood entries
          entry.factors.forEach(factor => {
            if (!triggerCounts[factor.toLowerCase()]) {
              triggerCounts[factor.toLowerCase()] = { count: 0, moodImpacts: [], factors: [], recentCount: 0 };
            }
            triggerCounts[factor.toLowerCase()].count += 1;
            triggerCounts[factor.toLowerCase()].moodImpacts.push(entry.intensity);
            if (isRecent) triggerCounts[factor.toLowerCase()].recentCount += 1;
          });
        }
      });

      // Convert to trigger patterns
      const patterns: TriggerPattern[] = Object.entries(triggerCounts)
        .filter(([_, data]) => data.count >= 2) // Only include triggers that appear at least twice
        .map(([trigger, data]) => {
          const averageMoodImpact = data.moodImpacts.length > 0 
            ? data.moodImpacts.reduce((sum, impact) => sum + impact, 0) / data.moodImpacts.length
            : 5;
          
          const uniqueFactors = [...new Set(data.factors)];
          
          let severity: 'low' | 'medium' | 'high' = 'low';
          if (data.count >= 5 && averageMoodImpact <= 3) severity = 'high';
          else if (data.count >= 3 && averageMoodImpact <= 4) severity = 'medium';
          
          return {
            trigger: trigger.charAt(0).toUpperCase() + trigger.slice(1),
            frequency: data.count,
            averageMoodImpact,
            associatedFactors: uniqueFactors.slice(0, 3),
            recentOccurrences: data.recentCount,
            severity
          };
        })
        .sort((a, b) => {
          // Sort by severity first, then by frequency
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity] || b.frequency - a.frequency;
        });

      setTriggers(patterns);
      StorageManager.save('trigger_patterns', patterns);
      setIsAnalyzing(false);
      toast.success(`Found ${patterns.length} potential trigger patterns`);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
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

  const getRecommendation = (trigger: TriggerPattern) => {
    switch (trigger.trigger.toLowerCase()) {
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

  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-mental-blue" />
        <h3 className="text-xl font-semibold" style={{color: '#737373'}}>AI Trigger Pattern Recognition</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-sm mb-4" style={{color: '#737373'}}>
          Our AI analyzes your journal entries and mood data to identify personal triggers and patterns.
        </p>
        <Button 
          onClick={analyzeTriggerPatterns} 
          disabled={isAnalyzing || (moodHistory.length < 5 && journalEntries.length < 3)}
          className="w-full"
        >
          {isAnalyzing ? 'Analyzing Patterns...' : 'Analyze My Triggers'}
        </Button>
        {isAnalyzing && (
          <div className="mt-4">
            <Progress value={66} className="w-full" />
            <p className="text-sm text-center mt-2" style={{color: '#737373'}}>
              AI is processing your data...
            </p>
          </div>
        )}
      </div>

      {triggers.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold" style={{color: '#737373'}}>Identified Patterns</h4>
          {triggers.map((trigger, index) => {
            const SeverityIcon = getSeverityIcon(trigger.severity);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(trigger.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SeverityIcon className="h-5 w-5" />
                    <h5 className="font-medium">{trigger.trigger}</h5>
                  </div>
                  <Badge variant="outline" className={`text-xs ${trigger.severity === 'high' ? 'border-red-500' : trigger.severity === 'medium' ? 'border-yellow-500' : 'border-green-500'}`}>
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
                    <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-600" />
                    <p><strong>Recommendation:</strong> {getRecommendation(trigger)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {triggers.length === 0 && !isAnalyzing && (
        <div className="text-center py-8">
          <p style={{color: '#737373'}}>
            {moodHistory.length < 5 && journalEntries.length < 3
              ? 'Keep tracking your mood and writing journal entries to unlock AI trigger analysis.'
              : 'No significant trigger patterns detected yet. Continue tracking to improve accuracy.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default TriggerPatternRecognition;
