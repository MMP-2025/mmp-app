import React, { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity } from 'lucide-react';
import GuidedBreathingVisualizer from '@/components/mindfulness/GuidedBreathingVisualizer';
import MindfulnessProgressTracker from '@/components/mindfulness/MindfulnessProgressTracker';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { useAnalytics } from '@/hooks/useAnalytics';
import MindfulnessExercises from '@/components/mindfulness/MindfulnessExercises';
import { useAuth } from '@/contexts/AuthContext';
import { PageTransition } from '@/components/ui/animated';

interface MindfulnessSession {
  id: string;
  type: 'meditation' | 'breathing' | 'body_scan';
  duration: number;
  completedAt: number;
  quality?: 'poor' | 'good' | 'excellent';
}

const MindfulnessPage = () => {
  const [currentTab, setCurrentTab] = useState('exercises');
  const [sessions, setSessions] = useState<MindfulnessSession[]>([]);
  const { trackMindfulnessSession } = useAnalytics();
  const { isGuest } = useAuth();

  React.useEffect(() => {
    const savedSessions = StorageManager.load<MindfulnessSession[]>(STORAGE_KEYS.MINDFULNESS_PROGRESS, []);
    setSessions(savedSessions);
  }, []);

  const handleSessionComplete = (type: 'meditation' | 'breathing' | 'body_scan', duration: number) => {
    const newSession: MindfulnessSession = {
      id: `session_${Date.now()}`,
      type,
      duration,
      completedAt: Date.now(),
      quality: 'good'
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    StorageManager.save(STORAGE_KEYS.MINDFULNESS_PROGRESS, updatedSessions);
    trackMindfulnessSession(type, duration);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} session completed!`);
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <h1 className="mb-1 text-foreground">Mindfulness & Meditation</h1>
          <p className="text-sm text-muted-foreground">Practice being present and cultivate awareness</p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className={`grid w-full ${isGuest ? 'grid-cols-2' : 'grid-cols-3'} bg-mental-peach/50`}>
            <TabsTrigger value="exercises" className="flex items-center gap-2 min-h-[44px] data-[state=active]:bg-mental-blue data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
              <Brain className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex items-center gap-2 min-h-[44px] data-[state=active]:bg-mental-blue data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
              <Activity className="h-4 w-4" />
              Breathing
            </TabsTrigger>
            {!isGuest && (
              <TabsTrigger value="progress" className="flex items-center gap-2 min-h-[44px] data-[state=active]:bg-mental-blue data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
                <Activity className="h-4 w-4" />
                Progress
              </TabsTrigger>
            )}
          </TabsList>

          {isGuest && (
            <div className="mt-4 p-4 bg-mental-peach/30 border border-mental-peach rounded-xl">
              <p className="text-sm text-foreground/70">
                🎯 <strong>Want more?</strong> Schedule a consultation to unlock progress tracking and personalized features!
              </p>
            </div>
          )}

          <TabsContent value="exercises" className="space-y-6">
            <MindfulnessExercises />
          </TabsContent>

          <TabsContent value="breathing" className="space-y-6">
            <GuidedBreathingVisualizer />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <MindfulnessProgressTracker sessions={sessions} weeklyGoal={70} />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default MindfulnessPage;
