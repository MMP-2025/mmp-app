
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Brain, Bell, Target, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import AchievementBadges from '@/components/gamification/AchievementBadges';
import PersonalizedMeditation from '@/components/mindfulness/PersonalizedMeditation';
import SmartNotifications from '@/components/notifications/SmartNotifications';
import WellnessScore from '@/components/wellness/WellnessScore';
import VoiceJournalEntries from '@/components/journal/VoiceJournalEntries';

const PersonalizationPage = () => {
  const [currentTab, setCurrentTab] = useState('badges');

  return (
    <div className="bg-mental-gray min-h-screen">
      <SidebarLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/" className="flex items-center gap-2" style={{color: '#737373'}}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Personalization & Wellness</h1>
                <p style={{color: '#737373'}}>Tailored features that adapt to your unique mental health journey</p>
              </div>
            </div>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="meditation" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Smart Alerts
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Wellness Score
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Journal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="badges">
              <AchievementBadges />
            </TabsContent>

            <TabsContent value="meditation">
              <PersonalizedMeditation />
            </TabsContent>

            <TabsContent value="notifications">
              <SmartNotifications />
            </TabsContent>

            <TabsContent value="wellness">
              <WellnessScore />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceJournalEntries />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PersonalizationPage;
