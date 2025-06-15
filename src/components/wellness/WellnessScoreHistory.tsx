import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';
import type { ScoreHistory } from '@/types/wellness';

interface WellnessScoreHistoryProps {
  scoreHistory: ScoreHistory[];
  selectedPeriod: 'week' | 'month';
  getScoreColor: (score: number) => string;
}

export const WellnessScoreHistory: React.FC<WellnessScoreHistoryProps> = ({ 
  scoreHistory, 
  selectedPeriod, 
  getScoreColor 
}) => {
  const getFilteredHistory = () => {
    if (selectedPeriod === 'week') {
      return scoreHistory.slice(0, 7);
    }
    return scoreHistory.slice(0, 30);
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div>
      <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Score History</h4>
      {filteredHistory.length > 0 ? (
        <div className="space-y-2">
          {filteredHistory.map(entry => (
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
  );
};
