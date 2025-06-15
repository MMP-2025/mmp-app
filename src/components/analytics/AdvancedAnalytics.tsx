
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, Calendar, BarChart3, Activity } from 'lucide-react';
import { CSVExporter } from '@/utils/csvExport';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';

interface AnalyticsData {
  moodEntries: any[];
  journalEntries: any[];
  gratitudeEntries: any[];
  mindfulnessEntries: any[];
}

const AdvancedAnalytics = () => {
  const [data, setData] = React.useState<AnalyticsData>({
    moodEntries: [],
    journalEntries: [],
    gratitudeEntries: [],
    mindfulnessEntries: []
  });

  React.useEffect(() => {
    setData({
      moodEntries: StorageManager.load(STORAGE_KEYS.MOOD_ENTRIES, []),
      journalEntries: StorageManager.load(STORAGE_KEYS.JOURNAL_ENTRIES, []),
      gratitudeEntries: StorageManager.load(STORAGE_KEYS.GRATITUDE_ENTRIES, []),
      mindfulnessEntries: StorageManager.load(STORAGE_KEYS.MINDFULNESS_PROGRESS, [])
    });
  }, []);

  const analytics = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyActivity = last30Days.map(date => {
      const dayMoods = data.moodEntries.filter(entry => entry.date === date);
      const dayJournals = data.journalEntries.filter(entry => entry.date === date);
      const dayGratitude = data.gratitudeEntries.filter(entry => entry.date === date);
      const dayMindfulness = data.mindfulnessEntries.filter(entry => entry.date === date);

      return {
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        mood: dayMoods.length > 0 ? dayMoods.reduce((sum, entry) => sum + entry.intensity, 0) / dayMoods.length : 0,
        journal: dayJournals.length,
        gratitude: dayGratitude.length,
        mindfulness: dayMindfulness.reduce((sum, entry) => sum + (entry.duration || 0), 0),
        totalActivity: dayMoods.length + dayJournals.length + dayGratitude.length + dayMindfulness.length
      };
    });

    const weeklyTrends = Array.from({ length: 12 }, (_, i) => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (i * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);

      const weekData = dailyActivity.slice(i * 7, (i + 1) * 7);
      const avgMood = weekData.reduce((sum, day) => sum + day.mood, 0) / 7;
      const totalActivity = weekData.reduce((sum, day) => sum + day.totalActivity, 0);

      return {
        week: `Week ${12 - i}`,
        avgMood: Math.round(avgMood * 10) / 10,
        totalActivity,
        engagement: Math.min(100, (totalActivity / 14) * 100)
      };
    }).reverse();

    return {
      dailyActivity,
      weeklyTrends,
      totalEntries: data.moodEntries.length + data.journalEntries.length + data.gratitudeEntries.length + data.mindfulnessEntries.length,
      averageMood: data.moodEntries.length > 0 
        ? Math.round((data.moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / data.moodEntries.length) * 10) / 10
        : 0,
      streakDays: calculateStreak(data.moodEntries),
      wellnessScore: calculateWellnessScore(data)
    };
  }, [data]);

  const calculateStreak = (entries: any[]) => {
    const uniqueDates = [...new Set(entries.map(entry => entry.date))].sort();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - streak);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (uniqueDates[i] === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateWellnessScore = (data: AnalyticsData) => {
    const moodScore = data.moodEntries.length > 0 
      ? (data.moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / data.moodEntries.length) * 10
      : 0;
    
    const consistencyScore = Math.min(100, analytics.streakDays * 5);
    const activityScore = Math.min(100, analytics.totalEntries * 2);
    
    return Math.round((moodScore + consistencyScore + activityScore) / 3);
  };

  const exportAllData = () => {
    const combinedData = {
      moodEntries: data.moodEntries,
      journalEntries: data.journalEntries,
      gratitudeEntries: data.gratitudeEntries,
      mindfulnessEntries: data.mindfulnessEntries,
      analytics: analytics,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(combinedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wellness-data-complete-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold text-mental-blue">{analytics.totalEntries}</div>
            <div className="text-sm" style={{color: '#737373'}}>Total Entries</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold text-mental-green">{analytics.streakDays}</div>
            <div className="text-sm" style={{color: '#737373'}}>Day Streak</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold text-mental-peach">{analytics.averageMood}</div>
            <div className="text-sm" style={{color: '#737373'}}>Avg Mood</div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{analytics.wellnessScore}</div>
            <div className="text-sm" style={{color: '#737373'}}>Wellness Score</div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6 bg-white/90">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>30-Day Activity Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="mood" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="totalActivity" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/90">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Weekly Wellness Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgMood" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card className="p-6 bg-white/90">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Export Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => CSVExporter.exportMoodData(data.moodEntries)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Mood Data (CSV)
              </Button>
              <Button onClick={() => CSVExporter.exportJournalData(data.journalEntries)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Journal Data (CSV)
              </Button>
              <Button onClick={() => CSVExporter.exportGratitudeData(data.gratitudeEntries)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Gratitude Data (CSV)
              </Button>
              <Button onClick={() => CSVExporter.exportMindfulnessData(data.mindfulnessEntries)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Mindfulness Data (CSV)
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button onClick={exportAllData} variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Complete Dataset (JSON)
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
