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
const AIInsights: React.FC<AIInsightsProps> = ({
  moodHistory,
  userBehavior
}) => {
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
          title: 'A steadier week',
          description: 'Your check-ins have felt more positive this week.',
          recommendation: 'If it feels useful, notice what supported you — it can be worth mentioning in your next session.'
        });
      } else if (avgIntensity <= 4) {
        insights.push({
          type: 'concern',
          icon: AlertTriangle,
          title: 'A harder stretch',
          description: 'Your check-ins have felt lower than usual this week.',
          recommendation: 'This is something worth sharing with your therapist. If you need immediate support, the Crisis Resources page is always available.'
        });
      } else {
        insights.push({
          type: 'neutral',
          icon: TrendingUp,
          title: 'A mixed week',
          description: 'Your mood has looked fairly steady, with some ups and downs.',
          recommendation: 'No changes needed — these entries can be a helpful starting point for your next session.'
        });
      }

      // Factor analysis
      const factorCounts = recent7Days.reduce((acc, entry) => {
        entry.factors.forEach(factor => {
          acc[factor] = (acc[factor] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);
      const topFactor = Object.entries(factorCounts).sort(([, a], [, b]) => b - a)[0];
      if (topFactor && topFactor[1] >= 3) {
        insights.push({
          type: 'insight',
          icon: Brain,
          title: 'Something you mentioned often',
          description: `"${topFactor[0]}" came up in several entries this week.`,
          recommendation: `You might reflect on what role "${topFactor[0]}" is playing right now — a therapist can help make sense of patterns like this.`
        });
      }
    }

    // Engagement insights
    if (userBehavior) {
      if (userBehavior.engagementLevel === 'high') {
        insights.push({
          type: 'achievement',
          icon: Target,
          title: 'Regular self-reflection',
          description: 'You\'ve been using a few different reflection tools recently.',
          recommendation: 'Use whatever feels supportive — there\'s no goal to hit here.'
        });
      } else if (userBehavior.engagementLevel === 'low') {
        insights.push({
          type: 'suggestion',
          icon: Target,
          title: 'Other tools are here if you want them',
          description: 'Journaling and gratitude prompts are available whenever they feel useful.',
          recommendation: 'There\'s no expectation to use every feature — this app is meant to support you between sessions, not add pressure.'
        });
      }

      // Time-based insights
      if (userBehavior.preferredTimeOfDay === 'night') {
        insights.push({
          type: 'insight',
          icon: Brain,
          title: 'You tend to check in later in the day',
          description: 'Most of your reflections happen in the evening.',
          recommendation: 'Whatever time feels natural is the right time — there\'s no better or worse moment to check in.'
        });
      }
    }
    return insights.slice(0, 4); // Return top 4 insights
  };
  const insights = generateInsights();
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'concern':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'achievement':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'insight':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'suggestion':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  const getIconColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-500';
      case 'concern':
        return 'text-red-500';
      case 'achievement':
        return 'text-blue-500';
      case 'insight':
        return 'text-purple-500';
      case 'suggestion':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };
  if (insights.length === 0) {
    return <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold" style={{
          color: '#737373'
        }}>AI Insights</h3>
        </div>
        <p style={{
        color: '#737373'
      }}>
          Keep tracking your mood and using the app to unlock personalized insights about your mental health patterns.
        </p>
      </Card>;
  }
  return <Card className="p-6 bg-mental-blue">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-mental-blue" />
        <h3 className="text-lg font-semibold" style={{
        color: '#737373'
      }}>Reflection Prompts</h3>
        <Badge variant="outline" className="text-xs">Based on your entries</Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        These are gentle observations based on what you\'ve logged — not clinical advice or a diagnosis. Your therapist is the best person to interpret what any pattern means for you.
      </p>
      <div className="space-y-4">
        {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
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
            </div>;
      })}
      </div>
    </Card>;
};
export default AIInsights;