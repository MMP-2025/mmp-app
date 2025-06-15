import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Quote, TrendingUp, Target, Clock, Lightbulb } from 'lucide-react';
import { personalizationEngine, PersonalizedContent, AdaptiveReminder } from '@/utils/personalizationEngine';
import { Link } from 'react-router-dom';

const PersonalizedDashboard = () => {
  const [personalizedQuote, setPersonalizedQuote] = useState<PersonalizedContent | null>(null);
  const [adaptiveReminders, setAdaptiveReminders] = useState<AdaptiveReminder[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{ type: string; reason: string; priority: number }>>([]);
  const [userBehavior, setUserBehavior] = useState(personalizationEngine.getUserBehavior());

  useEffect(() => {
    // Load personalized content
    const quote = personalizationEngine.getPersonalizedQuote();
    const reminders = personalizationEngine.getAdaptiveReminders();
    const recs = personalizationEngine.getContentRecommendations();
    
    setPersonalizedQuote(quote);
    setAdaptiveReminders(reminders);
    setRecommendations(recs);
    setUserBehavior(personalizationEngine.getUserBehavior());
  }, []);

  const getFeatureLink = (type: string): string => {
    switch (type) {
      case 'mood-tracker': return '/mood';
      case 'mindfulness': return '/mindfulness';
      case 'journal': return '/journal';
      case 'gratitude': return '/gratitude';
      case 'analytics': return '/mood';
      default: return '/';
    }
  };

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'mood-tracker': return TrendingUp;
      case 'mindfulness': return Target;
      case 'journal': return Quote;
      case 'gratitude': return '🙏';
      case 'analytics': return TrendingUp;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Quote */}
      {personalizedQuote && (
        <Card className="p-6 bg-gradient-to-br from-mental-blue/20 to-mental-green/20">
          <div className="flex items-start gap-3">
            <Quote className="h-6 w-6 mt-1 text-mental-blue" />
            <div className="flex-1">
              <blockquote className="text-lg font-medium mb-2 text-neutral-500">
                "{personalizedQuote.quote}"
              </blockquote>
              <cite className="text-sm text-neutral-500">
                — {personalizedQuote.author}
              </cite>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  {Math.round(personalizedQuote.relevanceScore * 100)}% match
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {personalizedQuote.category}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-white/90">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-neutral-500">
              Personalized Recommendations
            </h3>
          </div>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, index) => {
              const IconComponent = getFeatureIcon(rec.type);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-mental-peach/20 rounded-md">
                  <div className="flex items-center gap-3">
                    {typeof IconComponent === 'string' ? (
                      <span className="text-xl">{IconComponent}</span>
                    ) : (
                      <IconComponent className="h-5 w-5 text-neutral-500" />
                    )}
                    <div>
                      <div className="font-medium text-neutral-500">
                        {rec.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {rec.reason}
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={getFeatureLink(rec.type)}>
                      Try it
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Adaptive Reminders Preview */}
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-mental-blue" />
          <h3 className="text-lg font-semibold text-neutral-500">
            Smart Reminders
          </h3>
        </div>
        <div className="space-y-3">
          {adaptiveReminders.slice(0, 2).map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-mental-green/20 rounded-md">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-neutral-500" />
                <div>
                  <div className="font-medium text-neutral-500">
                    {reminder.optimalTime}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {reminder.message}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {reminder.frequency}
              </Badge>
            </div>
          ))}
        </div>
        <Button asChild className="w-full mt-4" variant="outline">
          <Link to="/reminders">
            Manage All Reminders
          </Link>
        </Button>
      </Card>

      {/* User Insights */}
      {userBehavior && (
        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4 text-neutral-500">
            Your Mental Health Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-mental-blue">
                {userBehavior.streakDays}
              </div>
              <div className="text-sm text-neutral-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mental-green">
                {userBehavior.mostUsedFeatures.length}
              </div>
              <div className="text-sm text-neutral-500">Features Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mental-peach">
                {userBehavior.engagementLevel}
              </div>
              <div className="text-sm text-neutral-500">Engagement</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm mb-2 text-neutral-500">
              Most active time: <Badge variant="outline">{userBehavior.preferredTimeOfDay}</Badge>
            </div>
            {userBehavior.mostUsedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {userBehavior.mostUsedFeatures.slice(0, 5).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedDashboard;
