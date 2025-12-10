
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { WellnessScoreDisplay } from './WellnessScoreDisplay';
import { WellnessMetricsCard } from './WellnessMetricsCard';
import { WellnessScoreHistory } from './WellnessScoreHistory';
import { WellnessInsights } from './WellnessInsights';
import { useWellnessScoreHistory } from '@/hooks/useWellnessScoreHistory';
import { useWellnessScoreCalculator } from '@/hooks/useWellnessScoreCalculator';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useGratitudeEntries } from '@/hooks/useGratitudeEntries';
import { useMindfulnessSessions } from '@/hooks/useMindfulnessSessions';

const WellnessScore: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  const { scoreHistory, saveScoreToHistory } = useWellnessScoreHistory();
  const { moodHistory } = useMoodEntries();
  const { journalEntries } = useJournalEntries();
  const { gratitudeEntries } = useGratitudeEntries();
  const { sessions: mindfulnessSessions } = useMindfulnessSessions();
  
  const { currentScore, isCalculating, calculateWellnessScore } = useWellnessScoreCalculator({ 
    saveScoreToHistory,
    moodEntries: moodHistory,
    journalEntries,
    mindfulnessSessions
  });

  const getScoreColor = (score: number) => 'text-mental-green';

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-mental-green" />
            <h3 className="text-xl font-semibold text-muted-foreground">Wellness Points</h3>
          </div>
          <Button 
            onClick={calculateWellnessScore} 
            disabled={isCalculating}
            size="sm"
          >
            {isCalculating ? 'Calculating...' : 'Update Points'}
          </Button>
        </div>
        
        <p className="mb-6 text-muted-foreground">
          Earn points for your wellness activities and track your positive habits
        </p>

        {currentScore && (
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'week' | 'month')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-6">
              <WellnessScoreDisplay 
                score={currentScore.overall} 
                calculatedAt={currentScore.calculatedAt} 
              />
              
              <WellnessMetricsCard metrics={currentScore.metrics} />
              
              <WellnessInsights 
                improvements={currentScore.improvements}
                strengths={currentScore.strengths}
              />
            </TabsContent>

            <TabsContent value="month" className="space-y-6">
              <WellnessScoreHistory 
                scoreHistory={scoreHistory}
                selectedPeriod={selectedPeriod}
                getScoreColor={getScoreColor}
              />
            </TabsContent>
          </Tabs>
        )}

        {!currentScore && !isCalculating && (
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto mb-4 text-mental-green" />
            <h4 className="text-lg font-semibold mb-2 text-muted-foreground">Start Earning Wellness Points</h4>
            <p className="mb-4 text-muted-foreground">
              Track your mental health activities and earn points for your progress
            </p>
            <Button onClick={calculateWellnessScore}>
              Calculate My Points
            </Button>
          </div>
        )}

        {isCalculating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mental-green mx-auto mb-4"></div>
            <h4 className="text-lg font-semibold mb-2 text-muted-foreground">Calculating Your Wellness Points</h4>
            <p className="text-muted-foreground">
              Reviewing your activities and awarding points for your progress...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WellnessScore;
