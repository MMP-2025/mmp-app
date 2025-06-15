
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface MoodEntry {
  mood: string;
  intensity: number;
  factors: string[];
  timestamp: number;
}

interface AIInsightsProps {
  moodHistory: MoodEntry[];
  userBehavior?: {
    mostUsedFeatures: string[];
    engagementLevel: 'low' | 'medium' | 'high';
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  } | null;
}

const AIInsights: React.FC<AIInsightsProps> = ({ moodHistory, userBehavior }) => {
  const generateInsights = () => {
    const insights = [];

    if (moodHistory.length >= 7) {
      // Mood trend analysis
      const recent7Days = moodHistory.slice(-7);
      const avgIntensity = recent7Days.reduce((sum, entry) => sum + entry.intensity, 0) / recent7Days.length;
      
      if (avgIntensity >= 7) {
        insights.push({
          type: 'positive',
          icon: CheckCircle,
          title: 'Strong Mental Health Trend',
          description: 'Your mood has been consistently positive this week. Keep up the great work!',
          recommendation: 'Continue your current practices and consider sharing your strategies in our community.'
        });
      } else if (avgIntensity <= 4) {
        insights.push({
          type: 'concern',
          icon: AlertTriangle,
          title: 'Mood Support Needed',
          description: 'Your mood has been lower than usual this week.',
          recommendation: 'Consider increasing mindfulness practice or reaching out to support resources.'
        });
      } else {
        insights.push({
          type: 'neutral',
          icon: TrendingUp,
          title: 'Steady Progress',
          description: 'Your mood is showing stable patterns with room for improvement.',
          recommendation: 'Try incorporating new wellness activities to boost your overall well-being.'
        });
      }

      // Factor analysis
      const factorCounts = recent7Days.reduce((acc, entry) => {
        entry.factors.forEach(factor => {
          acc[factor] = (acc[factor] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topFactor = Object.entries(factorCounts).sort(([,a], [,b]) => b - a)[0];
      if (topFactor && topFactor[1] >= 3) {
        insights.push({
          type: 'insight',
          icon: Brain,
          title: 'Pattern Recognition',
          description: `${topFactor[0]} appears frequently in your mood entries this week.`,
          recommendation: `Consider how ${topFactor[0]} impacts your well-being and develop strategies around it.`
        });
      }
    }

    // Engagement insights
    if (userBehavior) {
      if (userBehavior.engagementLevel === 'high') {
        insights.push({
          type: 'achievement',
          icon: Target,
          title: 'High Engagement Achievement',
          description: 'You\'re actively using multiple mental health tools!',
          recommendation: 'Consider exploring advanced features like correlation tracking and detailed analytics.'
        });
      } else if (userBehavior.engagementLevel === 'low') {
        insights.push({
          type: 'suggestion',
          icon: Target,
          title: 'Engagement Opportunity',
          description: 'There are several features that could benefit your mental health journey.',
          recommendation: 'Try exploring the journal or gratitude features to expand your wellness toolkit.'
        });
      }

      // Time-based insights
      if (userBehavior.preferredTimeOfDay === 'night') {
        insights.push({
          type: 'insight',
          icon: Brain,
          title: 'Night Owl Pattern',
          description: 'You tend to be most active with mental health check-ins during evening hours.',
          recommendation: 'Consider adding a morning mood check to balance your daily awareness.'
        });
      }
    }

    return insights.slice(0, 4); // Return top 4 insights
  };

  const insights = generateInsights();

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'concern': return 'text-red-600 bg-red-50 border-red-200';
      case 'achievement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'insight': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'suggestion': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-500';
      case 'concern': return 'text-red-500';
      case 'achievement': return 'text-blue-500';
      case 'insight': return 'text-purple-500';
      case 'suggestion': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold" style={{color: '#737373'}}>AI Insights</h3>
        </div>
        <p style={{color: '#737373'}}>
          Keep tracking your mood and using the app to unlock personalized insights about your mental health patterns.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-mental-blue" />
        <h3 className="text-lg font-semibold" style={{color: '#737373'}}>AI Insights</h3>
        <Badge variant="outline" className="text-xs">Powered by your data</Badge>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm mb-2">{insight.description}</p>
                  <p className="text-xs font-medium">
                    💡 {insight.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AIInsights;
