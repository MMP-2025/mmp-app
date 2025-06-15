
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';

interface MindfulnessSession {
  id: string;
  type: 'meditation' | 'breathing' | 'body_scan';
  duration: number;
  completedAt: number;
  quality?: 'poor' | 'good' | 'excellent';
}

interface MindfulnessProgressTrackerProps {
  sessions: MindfulnessSession[];
  weeklyGoal: number; // minutes
}

const MindfulnessProgressTracker: React.FC<MindfulnessProgressTrackerProps> = ({
  sessions,
  weeklyGoal
}) => {
  const thisWeekSessions = sessions.filter(session => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return session.completedAt > weekAgo;
  });

  const thisWeekMinutes = thisWeekSessions.reduce((total, session) => total + session.duration, 0);
  const progressPercentage = Math.min((thisWeekMinutes / weeklyGoal) * 100, 100);

  const streak = calculateStreak(sessions);
  const totalSessions = sessions.length;
  const averageSessionLength = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Weekly Progress */}
      <Card className="p-6 bg-mental-green">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-lg font-semibold" style={{color: '#737373'}}>Weekly Goal Progress</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span style={{color: '#737373'}}>{thisWeekMinutes} / {weeklyGoal} minutes</span>
            <span style={{color: '#737373'}}>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-mental-blue h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {progressPercentage >= 100 && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            🎉 Weekly goal achieved!
          </Badge>
        )}
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{streak}</div>
          <div className="text-sm" style={{color: '#737373'}}>Day Streak</div>
        </Card>
        
        <Card className="p-4 bg-white/90 text-center">
          <Calendar className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{totalSessions}</div>
          <div className="text-sm" style={{color: '#737373'}}>Total Sessions</div>
        </Card>
        
        <Card className="p-4 bg-white/90 text-center">
          <Clock className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{averageSessionLength}</div>
          <div className="text-sm" style={{color: '#737373'}}>Avg Length (min)</div>
        </Card>
        
        <Card className="p-4 bg-white/90 text-center">
          <Target className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{thisWeekSessions.length}</div>
          <div className="text-sm" style={{color: '#737373'}}>This Week</div>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Recent Sessions</h3>
        {thisWeekSessions.length === 0 ? (
          <p style={{color: '#737373'}}>No sessions this week. Start your mindfulness practice!</p>
        ) : (
          <div className="space-y-3">
            {thisWeekSessions.slice(0, 5).map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-mental-peach/20 rounded-md">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {session.type === 'meditation' ? '🧘' : session.type === 'breathing' ? '🫁' : '✨'}
                  </Badge>
                  <div>
                    <div className="font-medium" style={{color: '#737373'}}>
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1).replace('_', ' ')}
                    </div>
                    <div className="text-sm" style={{color: '#737373'}}>
                      {new Date(session.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium" style={{color: '#737373'}}>{session.duration} min</div>
                  {session.quality && (
                    <Badge 
                      variant={session.quality === 'excellent' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {session.quality}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

function calculateStreak(sessions: MindfulnessSession[]): number {
  if (sessions.length === 0) return 0;

  const sortedDates = [...new Set(sessions.map(session => {
    const date = new Date(session.completedAt);
    return date.toISOString().split('T')[0];
  }))].sort();

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - streak);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (sortedDates[i] === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default MindfulnessProgressTracker;
