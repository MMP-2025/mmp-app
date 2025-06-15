
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target } from 'lucide-react';
import { WellnessScoreDisplay } from './WellnessScoreDisplay';
import { WellnessMetricsCard } from './WellnessMetricsCard';
import { WellnessScoreHistory } from './WellnessScoreHistory';
import { WellnessInsights } from './WellnessInsights';
import { useWellnessScoreHistory } from '@/hooks/useWellnessScoreHistory';
import { useWellnessScoreCalculator } from '@/hooks/useWellnessScoreCalculator';

const WellnessScore: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  const { scoreHistory, saveScoreToHistory } = useWellnessScoreHistory();
  const { currentScore, isCalculating, calculateWellnessScore } = useWellnessScoreCalculator({ 
    saveScoreToHistory 
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-neutral-500" />
            <h3 className="text-xl font-semibold text-neutral-500">Wellness Score</h3>
          </div>
          <Button 
            onClick={calculateWellnessScore} 
            disabled={isCalculating}
            size="sm"
          >
            {isCalculating ? 'Calculating...' : 'Refresh Score'}
          </Button>
        </div>
        
        <p className="mb-6 text-neutral-500">
          Your daily wellness score based on mood patterns, consistency, and engagement
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
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50 text-neutral-500" />
            <h4 className="text-lg font-semibold mb-2 text-neutral-500">Calculate Your Wellness Score</h4>
            <p className="mb-4 text-neutral-500">
              Get insights into your mental health patterns and receive personalized recommendations
            </p>
            <Button onClick={calculateWellnessScore}>
              Calculate Score
            </Button>
          </div>
        )}

        {isCalculating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mental-green mx-auto mb-4"></div>
            <h4 className="text-lg font-semibold mb-2 text-neutral-500">Analyzing Your Wellness Data</h4>
            <p className="text-neutral-500">
              Processing your mood patterns, consistency, and engagement metrics...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WellnessScore;
