
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const { getUserMetrics } = useAnalytics();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const metrics = getUserMetrics();

  // Mock data for charts - in a real app, this would come from your analytics
  const moodTrendData = [
    { date: '2024-01-01', mood: 4 },
    { date: '2024-01-02', mood: 3 },
    { date: '2024-01-03', mood: 5 },
    { date: '2024-01-04', mood: 4 },
    { date: '2024-01-05', mood: 5 },
    { date: '2024-01-06', mood: 3 },
    { date: '2024-01-07', mood: 4 }
  ];

  const featureUsageData = [
    { name: 'Journal', value: 35, color: '#8b5cf6' },
    { name: 'Mood Tracker', value: 25, color: '#10b981' },
    { name: 'Mindfulness', value: 20, color: '#f59e0b' },
    { name: 'Gratitude', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const weeklyActivityData = [
    { day: 'Mon', activities: 3 },
    { day: 'Tue', activities: 5 },
    { day: 'Wed', activities: 2 },
    { day: 'Thu', activities: 7 },
    { day: 'Fri', activities: 4 },
    { day: 'Sat', activities: 6 },
    { day: 'Sun', activities: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#7e868b]">Your Progress</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 text-mental-blue" />
          </div>
          <div className="text-2xl font-bold text-[#7e868b]">{metrics.streakDays}</div>
          <div className="text-sm text-[#7e868b]">Day Streak</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-mental-green" />
          </div>
          <div className="text-2xl font-bold text-[#7e868b]">{metrics.totalMoodEntries}</div>
          <div className="text-sm text-[#7e868b]">Mood Entries</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-mental-peach" />
          </div>
          <div className="text-2xl font-bold text-[#7e868b]">{metrics.totalMindfulnessMinutes}</div>
          <div className="text-sm text-[#7e868b]">Mindful Minutes</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-mental-gray" />
          </div>
          <div className="text-2xl font-bold text-[#7e868b]">{metrics.totalJournalEntries}</div>
          <div className="text-sm text-[#7e868b]">Journal Entries</div>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood">Mood Trends</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#7e868b]">Mood Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#7e868b]">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#7e868b]">Feature Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {featureUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
