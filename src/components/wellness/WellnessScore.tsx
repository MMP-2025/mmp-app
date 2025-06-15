
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorageManager } from '@/utils/storage';
import { TrendingUp, TrendingDown, Target, Lightbulb, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

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

    // Remove today's entry if it exists and add the new one
    const filteredHistory = history.filter(entry => entry.date !== today);
    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 30); // Keep last 30 days
    
    setScoreHistory(updatedHistory);
    StorageManager.save('wellness_score_history', updatedHistory);
  };

  const calculateWellnessScore = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const score = performWellnessCalculation();
      setCurrentScore(score);
      saveScoreHistory(score);
      setIsCalculating(false);
      toast.success('Wellness score updated!');
    }, 1500);
  };

  const performWellnessCalculation = (): WellnessScore => {
    const moodEntries = StorageManager.load('mood_entries', []);
    const journalEntries = StorageManager.load('journal_entries', []);
    const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
    const userBehavior = StorageManager.load('user_behavior', null);

    // Calculate individual metrics
    const moodScore = calculateMoodScore(moodEntries);
    const consistencyScore = calculateConsistencyScore(moodEntries);
    const engagementScore = calculateEngagementScore(userBehavior);
    const mindfulnessScore = calculateMindfulnessScore(mindfulnessProgress);
    const journalingScore = calculateJournalingScore(journalEntries);

    const metrics: WellnessMetric[] = [
      {
        name: 'Mood Stability',
        value: moodScore.value,
        weight: 0.3,
        trend: moodScore.trend,
        suggestion: moodScore.suggestion
      },
      {
        name: 'Consistency',
        value: consistencyScore.value,
        weight: 0.25,
        trend: consistencyScore.trend,
        suggestion: consistencyScore.suggestion
      },
      {
        name: 'App Engagement',
        value: engagementScore.value,
        weight: 0.2,
        trend: engagementScore.trend,
        suggestion: engagementScore.suggestion
      },
      {
        name: 'Mindfulness Practice',
        value: mindfulnessScore.value,
        weight: 0.15,
        trend: mindfulnessScore.trend,
        suggestion: mindfulnessScore.suggestion
      },
      {
        name: 'Self-Reflection',
        value: journalingScore.value,
        weight: 0.1,
        trend: journalingScore.trend,
        suggestion: journalingScore.suggestion
      }
    ];

    // Calculate weighted overall score
    const overallScore = metrics.reduce((total, metric) => {
      return total + (metric.value * metric.weight);
    }, 0);

    // Generate improvements and strengths
    const improvements = metrics
      .filter(metric => metric.value < 70)
      .sort((a, b) => a.value - b.value)
      .slice(0, 3)
      .map(metric => metric.suggestion);

    const strengths = metrics
      .filter(metric => metric.value >= 80)
      .map(metric => `Strong ${metric.name.toLowerCase()}`);

    return {
      overall: Math.round(overallScore),
      metrics,
      calculatedAt: new Date().toISOString(),
      improvements,
      strengths
    };
  };

  const calculateMoodScore = (moodEntries: any[]) => {
    const recentEntries = moodEntries.slice(0, 7); // Last 7 entries
    if (recentEntries.length === 0) {
      return {
        value: 50,
        trend: 'stable' as const,
        suggestion: 'Start tracking your mood daily to build awareness'
      };
    }

    const moodValues = recentEntries.map(entry => {
      const moodMap: { [key: string]: number } = {
        'Ecstatic': 100,
        'Happy': 80,
        'Neutral': 60,
        'Sad': 30,
        'Angry': 20
      };
      return moodMap[entry.mood] || 50;
    });

    const average = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    const trend = moodValues.length > 3 ? 
      (moodValues.slice(0, 3).reduce((a, b) => a + b, 0) / 3) > 
      (moodValues.slice(-3).reduce((a, b) => a + b, 0) / 3) ? 'up' : 'down' : 'stable';

    return {
      value: Math.round(average),
      trend,
      suggestion: average < 60 ? 
        'Consider mindfulness exercises or speaking with someone you trust' :
        'Great mood stability! Keep maintaining your positive habits'
    };
  };

  const calculateConsistencyScore = (moodEntries: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const trackedDays = last7Days.filter(date => 
      moodEntries.some(entry => entry.date === date)
    ).length;

    const percentage = (trackedDays / 7) * 100;

    return {
      value: Math.round(percentage),
      trend: percentage > 70 ? 'up' : percentage > 40 ? 'stable' : 'down' as const,
      suggestion: percentage < 50 ? 
        'Try setting daily reminders to track your mood consistently' :
        'Excellent consistency in mood tracking!'
    };
  };

  const calculateEngagementScore = (userBehavior: any) => {
    if (!userBehavior) {
      return {
        value: 30,
        trend: 'stable' as const,
        suggestion: 'Explore different app features to enhance your wellness journey'
      };
    }

    const featureUsage = userBehavior.mostUsedFeatures?.length || 0;
    const engagementLevel = userBehavior.engagementLevel;
    
    let score = 40;
    if (engagementLevel === 'high') score = 90;
    else if (engagementLevel === 'medium') score = 70;
    
    score += Math.min(featureUsage * 5, 20); // Bonus for feature diversity

    return {
      value: Math.min(score, 100),
      trend: featureUsage > 3 ? 'up' : 'stable' as const,
      suggestion: score < 60 ? 
        'Try exploring journaling, mindfulness, or gratitude features' :
        'Great engagement with the app features!'
    };
  };

  const calculateMindfulnessScore = (mindfulnessProgress: any) => {
    const sessions = mindfulnessProgress.sessions || [];
    const recentSessions = sessions.filter((session: any) => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const score = Math.min(recentSessions.length * 20, 100);

    return {
      value: score,
      trend: recentSessions.length > 2 ? 'up' : recentSessions.length > 0 ? 'stable' : 'down' as const,
      suggestion: score < 40 ? 
        'Regular mindfulness practice can significantly improve wellbeing' :
        'Wonderful mindfulness practice! Keep up the great work'
    };
  };

  const calculateJournalingScore = (journalEntries: any[]) => {
    const recentEntries = journalEntries.filter((entry: any) => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const score = Math.min(recentEntries.length * 25, 100);

    return {
      value: score,
      trend: recentEntries.length > 2 ? 'up' : recentEntries.length > 0 ? 'stable' : 'down' as const,
      suggestion: score < 50 ? 
        'Journaling helps process emotions and track progress' :
        'Excellent self-reflection through journaling!'
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilteredHistory = () => {
    if (selectedPeriod === 'week') {
      return scoreHistory.slice(0, 7);
    }
    return scoreHistory.slice(0, 30);
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
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-mental-blue/20 to-mental-peach/20 rounded-lg">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(currentScore.overall)}`}>
                  {currentScore.overall}/100
                </div>
                <div className="text-lg font-medium mb-2" style={{color: '#737373'}}>
                  {getScoreLabel(currentScore.overall)}
                </div>
                <Progress value={currentScore.overall} className="w-48 mx-auto" />
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {new Date(currentScore.calculatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Metric Breakdown */}
              <div>
                <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Detailed Breakdown</h4>
                <div className="space-y-3">
                  {currentScore.metrics.map(metric => (
                    <div key={metric.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium" style={{color: '#737373'}}>{metric.name}</span>
                          {getTrendIcon(metric.trend)}
                          <Badge variant="outline" className="text-xs">
                            {Math.round(metric.weight * 100)}% weight
                          </Badge>
                        </div>
                        <Progress value={metric.value} className="mb-2" />
                        <p className="text-xs text-gray-600">{metric.suggestion}</p>
                      </div>
                      <div className={`text-xl font-bold ml-4 ${getScoreColor(metric.value)}`}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements and Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScore.improvements.length > 0 && (
                  <Card className="p-4 bg-red-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-red-600" />
                      <h5 className="font-semibold text-red-800">Areas for Improvement</h5>
                    </div>
                    <ul className="space-y-1">
                      {currentScore.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-red-700">
                          • {improvement}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {currentScore.strengths.length > 0 && (
                  <Card className="p-4 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <h5 className="font-semibold text-green-800">Your Strengths</h5>
                    </div>
                    <ul className="space-y-1">
                      {currentScore.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="month" className="space-y-6">
              {/* Score History */}
              <div>
                <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Score History</h4>
                {getFilteredHistory().length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredHistory().map(entry => (
                      <div key={entry.date} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4" style={{color: '#737373'}} />
                          <span style={{color: '#737373'}}>{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={entry.score} className="w-24" />
                          <span className={`font-semibold ${getScoreColor(entry.score)}`}>
                            {entry.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{color: '#737373'}}>No historical data available yet. Keep using the app to see your progress!</p>
                )}
              </div>
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
