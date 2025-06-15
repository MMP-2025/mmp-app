import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Brain, Users, Home, Zap } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  factors: string[];
  intensity: number;
  timestamp: number;
}

interface MoodTriggersAndCopingProps {
  moodHistory: MoodEntry[];
  selectedFactors: string[];
}

const MoodTriggersAndCoping: React.FC<MoodTriggersAndCopingProps> = ({ 
  moodHistory, 
  selectedFactors 
}) => {
  const [identifiedTriggers, setIdentifiedTriggers] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<Array<{ trigger: string; strategies: string[] }>>([]);

  useEffect(() => {
    // Analyze mood history to identify triggers
    const triggerAnalysis = analyzeTriggers(moodHistory);
    setIdentifiedTriggers(triggerAnalysis);
    
    // Generate personalized coping strategies
    const strategies = generateCopingStrategies(triggerAnalysis, selectedFactors);
    setCopingStrategies(strategies);
  }, [moodHistory, selectedFactors]);

  const analyzeTriggers = (history: MoodEntry[]): string[] => {
    const triggerCounts: { [key: string]: { negative: number; total: number } } = {};
    
    history.forEach(entry => {
      const isNegativeMood = ['sad', 'angry', 'anxious', 'stressed'].includes(entry.mood.toLowerCase()) || entry.intensity < 4;
      
      entry.factors.forEach(factor => {
        if (!triggerCounts[factor]) {
          triggerCounts[factor] = { negative: 0, total: 0 };
        }
        triggerCounts[factor].total++;
        if (isNegativeMood) {
          triggerCounts[factor].negative++;
        }
      });
    });

    // Identify factors that correlate with negative moods
    return Object.entries(triggerCounts)
      .filter(([_, counts]) => counts.total >= 3 && counts.negative / counts.total > 0.6)
      .map(([factor, _]) => factor);
  };

  const generateCopingStrategies = (triggers: string[], currentFactors: string[]): Array<{ trigger: string; strategies: string[] }> => {
    const strategyMap: { [key: string]: string[] } = {
      'Work/School': [
        'Take 5-minute breaks every hour',
        'Practice the 4-7-8 breathing technique',
        'Set realistic daily goals',
        'Use time-blocking for tasks'
      ],
      'Relationships': [
        'Practice active listening',
        'Use "I" statements in conversations',
        'Set healthy boundaries',
        'Schedule regular check-ins'
      ],
      'Health': [
        'Maintain consistent sleep schedule',
        'Stay hydrated throughout the day',
        'Practice gentle stretching',
        'Consider short walks for energy'
      ],
      'Sleep': [
        'Create a bedtime routine',
        'Limit screen time before bed',
        'Keep bedroom cool and dark',
        'Try progressive muscle relaxation'
      ],
      'Exercise': [
        'Start with 10-minute walks',
        'Try desk exercises during work',
        'Join group fitness classes',
        'Use movement as stress relief'
      ],
      'Stress': [
        'Practice mindfulness meditation',
        'Try journaling your thoughts',
        'Use grounding techniques (5-4-3-2-1)',
        'Listen to calming music'
      ],
      'Social Media': [
        'Set specific usage times',
        'Unfollow accounts that cause stress',
        'Use "Do Not Disturb" features',
        'Replace scrolling with meaningful activities'
      ],
      'Weather': [
        'Use light therapy for mood boost',
        'Plan indoor activities for bad weather',
        'Practice acceptance of weather changes',
        'Dress appropriately for conditions'
      ]
    };

    const allTriggers = [...new Set([...triggers, ...currentFactors])];
    
    return allTriggers.map(trigger => ({
      trigger,
      strategies: strategyMap[trigger] || [
        'Practice deep breathing exercises',
        'Talk to a trusted friend or counselor',
        'Engage in a favorite hobby',
        'Take a short break from the situation'
      ]
    }));
  };

  const getTriggerIcon = (trigger: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Work/School': <Brain className="h-4 w-4" />,
      'Relationships': <Heart className="h-4 w-4" />,
      'Health': <Zap className="h-4 w-4" />,
      'Social Media': <Users className="h-4 w-4" />,
      'Home': <Home className="h-4 w-4" />
    };
    
    return iconMap[trigger] || <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-mental-peach">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-500">
          <AlertTriangle className="h-5 w-5" />
          Identified Triggers
        </h3>
        
        {identifiedTriggers.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm mb-3 text-neutral-500">
              Based on your mood history, these factors often correlate with lower mood:
            </p>
            <div className="flex flex-wrap gap-2">
              {identifiedTriggers.map(trigger => (
                <Badge 
                  key={trigger} 
                  variant="destructive" 
                  className="flex items-center gap-1"
                >
                  {getTriggerIcon(trigger)}
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Track your mood for a few more entries to identify potential triggers.
          </p>
        )}
      </Card>

      <Card className="p-6 bg-mental-green">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-500">
          <Heart className="h-5 w-5" />
          Personalized Coping Strategies
        </h3>
        
        <div className="space-y-4">
          {copingStrategies.map(({ trigger, strategies }) => (
            <div key={trigger} className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-neutral-500">
                {getTriggerIcon(trigger)}
                {trigger}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                {strategies.map((strategy, index) => (
                  <div 
                    key={index} 
                    className="text-sm p-2 bg-white/50 rounded border-l-2 border-green-400 text-neutral-500"
                  >
                    {strategy}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MoodTriggersAndCoping;
