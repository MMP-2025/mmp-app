
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Calendar, Brain, Target, Clock } from 'lucide-react';

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

interface MoodPredictionSystemProps {
  moodHistory: MoodEntry[];
}

interface Prediction {
  type: 'risk' | 'improvement' | 'maintenance';
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
  description: string;
}

const MoodPredictionSystem: React.FC<MoodPredictionSystemProps> = ({ moodHistory }) => {
  const predictions = useMemo(() => {
    if (moodHistory.length < 7) return [];

    const recent7Days = moodHistory.slice(0, 7);
    const recent14Days = moodHistory.slice(0, 14);
    const predictions: Prediction[] = [];

    // Calculate trends
    const recentAvg = recent7Days.reduce((sum, entry) => sum + entry.intensity, 0) / recent7Days.length;
    const previousAvg = recent14Days.slice(7).reduce((sum, entry) => sum + entry.intensity, 0) / Math.max(recent14Days.slice(7).length, 1);
    const trend = recentAvg - previousAvg;

    // Risk prediction based on declining mood
    if (trend < -1.5 && recentAvg < 5) {
      predictions.push({
        type: 'risk',
        confidence: Math.min(90, Math.abs(trend) * 30),
        timeframe: 'Next 3-5 days',
        factors: getTopFactors(recent7Days.filter(e => e.intensity < 5)),
        recommendation: 'Consider increasing mindfulness practice and reaching out for support',
        description: 'Your mood has been declining consistently. Early intervention recommended.'
      });
    }

    // Improvement prediction
    if (trend > 1 && recentAvg > 6) {
      predictions.push({
        type: 'improvement',
        confidence: Math.min(85, trend * 25),
        timeframe: 'Continuing trend',
        factors: getTopFactors(recent7Days.filter(e => e.intensity > 6)),
        recommendation: 'Continue current positive practices and build on this momentum',
        description: 'Your mood is showing positive improvement. Keep up the great work!'
      });
    }

    // Maintenance prediction for stable moods
    if (Math.abs(trend) < 0.5 && recentAvg >= 5 && recentAvg <= 7) {
      predictions.push({
        type: 'maintenance',
        confidence: 75,
        timeframe: 'Short term',
        factors: getTopFactors(recent7Days),
        recommendation: 'Maintain current routine while exploring new wellness activities',
        description: 'Your mood is stable. This is a good time to try new wellness strategies.'
      });
    }

    // Pattern-based predictions
    const dayOfWeekPattern = analyzeDayOfWeekPattern(moodHistory);
    if (dayOfWeekPattern) {
      predictions.push(dayOfWeekPattern);
    }

    return predictions;
  }, [moodHistory]);

  const getTopFactors = (entries: MoodEntry[]): string[] => {
    const factorCounts = entries.reduce((acc, entry) => {
      entry.factors.forEach(factor => {
        acc[factor] = (acc[factor] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([factor]) => factor);
  };

  const analyzeDayOfWeekPattern = (history: MoodEntry[]): Prediction | null => {
    if (history.length < 14) return null;

    const dayAverages = history.reduce((acc, entry) => {
      const day = new Date(entry.timestamp).getDay();
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry.intensity);
      return acc;
    }, {} as Record<number, number[]>);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    const tomorrowDay = (currentDay + 1) % 7;

    if (dayAverages[tomorrowDay] && dayAverages[tomorrowDay].length >= 2) {
      const tomorrowAvg = dayAverages[tomorrowDay].reduce((sum, i) => sum + i, 0) / dayAverages[tomorrowDay].length;
      const overallAvg = history.reduce((sum, entry) => sum + entry.intensity, 0) / history.length;
      
      if (Math.abs(tomorrowAvg - overallAvg) > 1) {
        return {
          type: tomorrowAvg > overallAvg ? 'improvement' : 'risk',
          confidence: 65,
          timeframe: `Tomorrow (${dayNames[tomorrowDay]})`,
          factors: [`${dayNames[tomorrowDay]} pattern`],
          recommendation: tomorrowAvg > overallAvg 
            ? `${dayNames[tomorrowDay]}s tend to be good days for you. Plan something enjoyable!`
            : `${dayNames[tomorrowDay]}s can be challenging. Consider extra self-care.`,
          description: `Based on your historical pattern, ${dayNames[tomorrowDay]}s average ${tomorrowAvg.toFixed(1)}/10 mood intensity.`
        };
      }
    }

    return null;
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'risk': return AlertTriangle;
      case 'improvement': return TrendingUp;
      case 'maintenance': return Target;
      default: return Brain;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'risk': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-green-600 bg-green-50 border-green-200';
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEarlyWarnings = () => {
    if (moodHistory.length < 5) return [];
    
    const recent5Days = moodHistory.slice(0, 5);
    const warnings = [];

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

  if (moodHistory.length < 7) {
    return (
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold" style={{color: '#737373'}}>Mood Predictions</h3>
        </div>
        <p style={{color: '#737373'}}>
          Track your mood for at least 7 days to unlock AI-powered predictions and early warning systems.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Early Warning System */}
      {earlyWarnings.length > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Early Warning System</h3>
          </div>
          <div className="space-y-3">
            {earlyWarnings.map((warning, index) => (
              <div key={index} className="p-3 bg-white/80 rounded-md border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-800">{warning.type}</h4>
                  <Badge variant={warning.severity === 'high' ? 'destructive' : 'outline'}>
                    {warning.severity} priority
                  </Badge>
                </div>
                <p className="text-sm text-red-700 mb-2">{warning.message}</p>
                <p className="text-xs font-medium text-red-800">💡 {warning.action}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Mood Predictions */}
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold" style={{color: '#737373'}}>AI Mood Predictions</h3>
          <Badge variant="outline" className="text-xs">Powered by pattern analysis</Badge>
        </div>
        
        {predictions.length === 0 ? (
          <p style={{color: '#737373'}}>
            No strong patterns detected yet. Continue tracking to improve prediction accuracy.
          </p>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction, index) => {
              const IconComponent = getPredictionIcon(prediction.type);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPredictionColor(prediction.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium capitalize">{prediction.type} Prediction</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {prediction.timeframe}
                        </Badge>
                      </div>
                      
                      <p className="text-sm mb-3">{prediction.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Confidence:</span>
                          <Progress value={prediction.confidence} className="flex-1 h-2" />
                          <span className="text-xs">{prediction.confidence}%</span>
                        </div>
                        
                        {prediction.factors.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium">Key factors:</span>
                            {prediction.factors.map((factor, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 p-2 bg-white/60 rounded-md">
                          <p className="text-xs font-medium">💡 Recommendation:</p>
                          <p className="text-xs">{prediction.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Prediction Accuracy Tracker */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-mental-peach/20 rounded-md">
            <Calendar className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
            <h4 className="font-medium mb-1" style={{color: '#737373'}}>Pattern Analysis</h4>
            <p className="text-xs" style={{color: '#737373'}}>
              Analyzes your mood history to identify recurring patterns and trends
            </p>
          </div>
          <div className="text-center p-3 bg-mental-green/20 rounded-md">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
            <h4 className="font-medium mb-1" style={{color: '#737373'}}>Trend Detection</h4>
            <p className="text-xs" style={{color: '#737373'}}>
              Identifies upward, downward, or stable mood trends over time
            </p>
          </div>
          <div className="text-center p-3 bg-mental-blue/20 rounded-md">
            <Brain className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
            <h4 className="font-medium mb-1" style={{color: '#737373'}}>Smart Recommendations</h4>
            <p className="text-xs" style={{color: '#737373'}}>
              Provides personalized suggestions based on your unique patterns
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MoodPredictionSystem;
