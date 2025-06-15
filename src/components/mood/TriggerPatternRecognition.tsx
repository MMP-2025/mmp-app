import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StorageManager } from '@/utils/storage';
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import TriggerAnalysisButton from './triggers/TriggerAnalysisButton';
import TriggerPatternCard from './triggers/TriggerPatternCard';

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

  const triggerKeywords = {
    stress: ['stress', 'stressed', 'pressure', 'overwhelmed', 'anxious', 'worry'],
    work: ['work', 'job', 'boss', 'deadline', 'meeting', 'office', 'colleague'],
    relationships: ['fight', 'argument', 'relationship', 'partner', 'family', 'friend', 'conflict'],
    health: ['sick', 'tired', 'pain', 'headache', 'insomnia', 'fatigue'],
    money: ['money', 'financial', 'bills', 'debt', 'budget', 'expensive'],
    social: ['lonely', 'isolated', 'social media', 'comparison', 'rejection'],
    change: ['change', 'transition', 'moving', 'new', 'uncertain', 'unknown']
  };

  useEffect(() => {
    const savedTriggers = StorageManager.load<TriggerPattern[]>('trigger_patterns', []);
    setTriggers(savedTriggers);
  }, []);

  const analyzeTriggerPatterns = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const triggerCounts: Record<string, {
        count: number;
        moodImpacts: number[];
        factors: string[];
        recentCount: number;
      }> = {};

      journalEntries.forEach(entry => {
        const content = entry.content.toLowerCase();
        const entryDate = new Date(entry.date);
        const isRecent = Date.now() - entryDate.getTime() < 30 * 24 * 60 * 60 * 1000;
        
        Object.entries(triggerKeywords).forEach(([triggerType, keywords]) => {
          const found = keywords.some(keyword => content.includes(keyword));
          if (found) {
            if (!triggerCounts[triggerType]) {
              triggerCounts[triggerType] = { count: 0, moodImpacts: [], factors: [], recentCount: 0 };
            }
            triggerCounts[triggerType].count += 1;
            if (isRecent) triggerCounts[triggerType].recentCount += 1;
            
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

      moodHistory.forEach(entry => {
        const entryDate = new Date(entry.timestamp);
        const isRecent = Date.now() - entryDate.getTime() < 30 * 24 * 60 * 60 * 1000;
        
        if (entry.intensity <= 4) {
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

      const patterns: TriggerPattern[] = Object.entries(triggerCounts)
        .filter(([_, data]) => data.count >= 2)
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
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity] || b.frequency - a.frequency;
        });

      setTriggers(patterns);
      StorageManager.save('trigger_patterns', patterns);
      setIsAnalyzing(false);
      toast.success(`Found ${patterns.length} potential trigger patterns`);
    }, 2000);
  };

  const canAnalyze = moodHistory.length >= 5 || journalEntries.length >= 3;

  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-mental-blue" />
        <h3 className="text-xl font-semibold" style={{color: '#737373'}}>AI Trigger Pattern Recognition</h3>
      </div>
      
      <TriggerAnalysisButton
        onAnalyze={analyzeTriggerPatterns}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
      />

      {triggers.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold" style={{color: '#737373'}}>Identified Patterns</h4>
          {triggers.map((trigger, index) => (
            <TriggerPatternCard key={index} trigger={trigger} />
          ))}
        </div>
      )}

      {triggers.length === 0 && !isAnalyzing && (
        <div className="text-center py-8">
          <p style={{color: '#737373'}}>
            {!canAnalyze
              ? 'Keep tracking your mood and writing journal entries to unlock AI trigger analysis.'
              : 'No significant trigger patterns detected yet. Continue tracking to improve accuracy.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default TriggerPatternRecognition;
