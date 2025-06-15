
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorageManager } from '@/utils/storage';
import { Target } from 'lucide-react';
import { toast } from 'sonner';
import { WellnessScoreDisplay } from './WellnessScoreDisplay';
import { WellnessMetricsCard } from './WellnessMetricsCard';
import { WellnessScoreHistory } from './WellnessScoreHistory';
import { WellnessInsights } from './WellnessInsights';
import { WellnessScoreCalculator } from './WellnessScoreCalculator';

interface WellnessMetric {
  name: string;
  value: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  suggestion: string;
}

interface WellnessScore {
  overall: number;
  metrics: WellnessMetric[];
  calculatedAt: string;
  improvements: string[];
  strengths: string[];
}

interface ScoreHistory {
  date: string;
  score: number;
  breakdown: { [key: string]: number };
}

const WellnessScore: React.FC = () => {
  const [currentScore, setCurrentScore] = useState<WellnessScore | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadScoreHistory();
    calculateWellnessScore();
  }, []);

  const loadScoreHistory = () => {
    const history = StorageManager.load<ScoreHistory[]>('wellness_score_history', []);
    setScoreHistory(history);
  };

  const saveScoreHistory = (newScore: WellnessScore) => {
    const history = [...scoreHistory];
    const today = new Date().toISOString().split('T')[0];
    
    const breakdown = newScore.metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value;
      return acc;
    }, {} as { [key: string]: number });

    const newEntry: ScoreHistory = {
      date: today,
      score: newScore.overall,
      breakdown
    };

    const filteredHistory = history.filter(entry => entry.date !== today);
    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 30);
    
    setScoreHistory(updatedHistory);
    StorageManager.save('wellness_score_history', updatedHistory);
  };

  const calculateWellnessScore = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const score = WellnessScoreCalculator.performWellnessCalculation();
      setCurrentScore(score);
      saveScoreHistory(score);
      setIsCalculating(false);
      toast.success('Wellness score updated!');
    }, 1500);
  };

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
            <Target className="h-5 w-5" style={{color: '#737373'}} />
            <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Wellness Score</h3>
          </div>
          <Button 
            onClick={calculateWellnessScore} 
            disabled={isCalculating}
            size="sm"
          >
            {isCalculating ? 'Calculating...' : 'Refresh Score'}
          </Button>
        </div>
        
        <p className="mb-6" style={{color: '#737373'}}>
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
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" style={{color: '#737373'}} />
            <h4 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>Calculate Your Wellness Score</h4>
            <p className="mb-4" style={{color: '#737373'}}>
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
            <h4 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>Analyzing Your Wellness Data</h4>
            <p style={{color: '#737373'}}>
              Processing your mood patterns, consistency, and engagement metrics...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WellnessScore;
