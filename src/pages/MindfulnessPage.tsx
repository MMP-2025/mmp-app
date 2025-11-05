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

// Sample mindfulness exercises - in a real app, these would come from your database
interface MindfulnessSession {
  id: string;
  type: 'meditation' | 'breathing' | 'body_scan';
  duration: number; // in minutes
  completedAt: number;
  quality?: 'poor' | 'good' | 'excellent';
}
const MindfulnessPage = () => {
  const [currentTab, setCurrentTab] = useState('exercises');
  const [sessions, setSessions] = useState<MindfulnessSession[]>([]);
  const {
    trackMindfulnessSession
  } = useAnalytics();
  const {
    isGuest
  } = useAuth();
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
      quality: 'good' // Could be user-selected in a more complete implementation
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    StorageManager.save(STORAGE_KEYS.MINDFULNESS_PROGRESS, updatedSessions);
    trackMindfulnessSession(type, duration);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} session of ${duration} minute${duration > 1 ? 's' : ''} completed!`);
  };
  return <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-700">Mindfulness & Meditation</h1>
        <p className="text-slate-700">Practice being present and cultivate awareness</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className={`grid w-full ${isGuest ? 'grid-cols-2' : 'grid-cols-3'}`}>
          <TabsTrigger value="exercises" className="flex items-center gap-2 text-slate-700">
            <Brain className="h-4 w-4" />
            Exercises
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2 text-slate-700">
            <Activity className="h-4 w-4" />
            Breathing
          </TabsTrigger>
          {!isGuest && <TabsTrigger value="progress" className="flex items-center gap-2 text-slate-700">
              <Activity className="h-4 w-4" />
              Progress
            </TabsTrigger>}
        </TabsList>

        {isGuest && <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-700">
              🎯 <strong>Want more?</strong> Create an account to unlock AI-generated meditations and progress tracking!
            </p>
          </div>}

        <TabsContent value="exercises" className="space-y-6">
          <MindfulnessExercises />
        </TabsContent>

        <TabsContent value="breathing" className="space-y-6">
          <GuidedBreathingVisualizer />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <MindfulnessProgressTracker sessions={sessions} weeklyGoal={70} // 70 minutes per week default goal
        />
        </TabsContent>
      </Tabs>
    </div>;
};
export default MindfulnessPage;