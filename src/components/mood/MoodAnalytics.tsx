
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
}

interface MoodAnalyticsProps {
  moodHistory: MoodEntry[];
}

const MoodAnalytics = ({ moodHistory }: MoodAnalyticsProps) => {
  const analytics = useMemo(() => {
    if (moodHistory.length === 0) return null;

    // Mood distribution
    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average intensity by mood
    const intensityByMood = moodHistory.reduce((acc, entry) => {
      if (!acc[entry.mood]) acc[entry.mood] = { total: 0, count: 0 };
      acc[entry.mood].total += entry.intensity;
      acc[entry.mood].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const avgIntensityByMood = Object.entries(intensityByMood).map(([mood, data]) => ({
      mood,
      avgIntensity: Math.round((data.total / data.count) * 10) / 10
    }));

    // Factor frequency
    const factorCounts = moodHistory.reduce((acc, entry) => {
      entry.factors.forEach(factor => {
        acc[factor] = (acc[factor] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topFactors = Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([factor, count]) => ({ factor, count }));

    // Weekly trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyTrend = last7Days.map(date => {
      const dayEntries = moodHistory.filter(entry => entry.date === date);
      const avgIntensity = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : 0;
      return {
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        intensity: Math.round(avgIntensity * 10) / 10,
        entries: dayEntries.length
      };
    });

    // Streak calculation
    const sortedDates = [...new Set(moodHistory.map(entry => entry.date))].sort();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - currentStreak);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalEntries: moodHistory.length,
      currentStreak,
      avgIntensity: Math.round((moodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / moodHistory.length) * 10) / 10,
      moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({ mood, count })),
      avgIntensityByMood,
      topFactors,
      weeklyTrend
    };
  }, [moodHistory]);

  if (!analytics) {
    return (
      <Card className="p-6 bg-white/90">
        <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Mood Analytics</h2>
        <p style={{color: '#737373'}}>Start tracking your mood to see analytics and insights!</p>
      </Card>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#737373'}}>{analytics.totalEntries}</div>
            <div className="text-sm" style={{color: '#737373'}}>Total Entries</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#737373'}}>{analytics.currentStreak}</div>
            <div className="text-sm" style={{color: '#737373'}}>Day Streak</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#737373'}}>{analytics.avgIntensity}</div>
            <div className="text-sm" style={{color: '#737373'}}>Avg Intensity</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#737373'}}>
              {analytics.topFactors[0]?.factor || 'N/A'}
            </div>
            <div className="text-sm" style={{color: '#737373'}}>Top Factor</div>
          </div>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>7-Day Mood Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics.weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="intensity" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.moodDistribution}
                dataKey="count"
                nameKey="mood"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {analytics.moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Factors */}
        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Most Common Factors</h3>
          <div className="space-y-3">
            {analytics.topFactors.map((factor, index) => (
              <div key={factor.factor} className="flex items-center justify-between">
                <Badge variant="outline">{factor.factor}</Badge>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 bg-mental-peach rounded"
                    style={{
                      width: `${(factor.count / analytics.topFactors[0].count) * 100}px`,
                      minWidth: '20px'
                    }}
                  />
                  <span className="text-sm font-medium" style={{color: '#737373'}}>{factor.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Average Intensity by Mood */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Average Intensity by Mood</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.avgIntensityByMood}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mood" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="avgIntensity" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MoodAnalytics;
