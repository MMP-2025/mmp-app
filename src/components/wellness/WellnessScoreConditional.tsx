import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';
import { useWellnessScoreCalculator } from '@/hooks/useWellnessScoreCalculator';
import { useWellnessScoreHistory } from '@/hooks/useWellnessScoreHistory';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useGratitudeEntries } from '@/hooks/useGratitudeEntries';
import { useMindfulnessSessions } from '@/hooks/useMindfulnessSessions';
import { Link } from 'react-router-dom';

/**
 * WellnessScoreConditional: Only shows the wellness score
 * when the user has 3+ entries across tracked activities.
 * Otherwise shows a motivational empty state.
 */
const WellnessScoreConditional: React.FC = () => {
  const { saveScoreToHistory } = useWellnessScoreHistory();
  const { moodHistory } = useMoodEntries();
  const { journalEntries } = useJournalEntries();
  const { gratitudeEntries } = useGratitudeEntries();
  const { sessions: mindfulnessSessions } = useMindfulnessSessions();

  const { currentScore, isCalculating, calculateWellnessScore } = useWellnessScoreCalculator({
    saveScoreToHistory,
    moodEntries: moodHistory,
    journalEntries,
    mindfulnessSessions,
  });

  const totalEntries = moodHistory.length + journalEntries.length + gratitudeEntries.length;

  if (totalEntries < 3) {
    return (
      <Card className="p-5 bg-card border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent shrink-0">
            <Star className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Your Wellness Score</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Start tracking to see your progress — log {3 - totalEntries} more {3 - totalEntries === 1 ? 'entry' : 'entries'} to unlock.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-sage-light to-teal-light border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">Wellness Score</h3>
              {currentScore && (
                <span className="text-xl font-bold text-primary">
                  {currentScore.overall}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Based on your recent activity</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!currentScore && (
            <Button
              onClick={calculateWellnessScore}
              disabled={isCalculating}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs"
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          )}
          <Link to="/?tab=progress">
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default WellnessScoreConditional;
