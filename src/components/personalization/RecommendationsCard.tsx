
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lightbulb, TrendingUp, Target, Quote, LucideIcon } from 'lucide-react';

interface Recommendation {
  type: string;
  reason: string;
}

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

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

const getFeatureIcon = (type: string): LucideIcon | string => {
  switch (type) {
    case 'mood-tracker': return TrendingUp;
    case 'mindfulness': return Target;
    case 'journal': return Quote;
    case 'gratitude': return '🙏';
    case 'analytics': return TrendingUp;
    default: return Lightbulb;
  }
};

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  return (
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
  );
};

export default RecommendationsCard;
