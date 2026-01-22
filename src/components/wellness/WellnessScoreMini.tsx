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

const WellnessScoreMini: React.FC = () => {
  const { saveScoreToHistory } = useWellnessScoreHistory();
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

  // Calculate a simple score based on recent activity
  const getActivityLevel = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentMoods = moodHistory.filter(m => {
      const date = new Date(m.timestamp);
      return date >= weekAgo;
    }).length;

    const recentJournals = journalEntries.filter(j => {
      const date = j.date instanceof Date ? j.date : new Date(j.date);
      return date >= weekAgo;
    }).length;

    const recentGratitude = gratitudeEntries.filter(g => {
      const date = g.date instanceof Date ? g.date : new Date(g.date);
      return date >= weekAgo;
    }).length;

    const total = recentMoods + recentJournals + recentGratitude;
    
    if (total >= 10) return { level: 'Excellent', color: 'text-mental-green', bg: 'bg-mental-green/20' };
    if (total >= 5) return { level: 'Good', color: 'text-mental-blue', bg: 'bg-mental-blue/20' };
    if (total >= 2) return { level: 'Getting Started', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { level: 'Start Your Journey', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const activityLevel = getActivityLevel();

  return (
    <Card className="p-4 bg-gradient-to-r from-mental-green/10 to-mental-blue/10 border-mental-green/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-mental-green/20">
            <Star className="h-6 w-6 text-mental-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Wellness Score</h3>
              {currentScore && (
                <span className="text-2xl font-bold text-mental-green">
                  {currentScore.overall}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${activityLevel.color}`}>
                {activityLevel.level}
              </span>
              <TrendingUp className="h-4 w-4 text-mental-green" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!currentScore && (
            <Button 
              onClick={calculateWellnessScore} 
              disabled={isCalculating}
              size="sm"
              className="bg-mental-green hover:bg-mental-green/90 text-white"
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          )}
          <Link to="/?tab=progress">
            <Button variant="ghost" size="sm" className="text-mental-blue">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default WellnessScoreMini;
