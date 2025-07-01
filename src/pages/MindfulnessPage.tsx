
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Headphones, Activity } from 'lucide-react';
import AudioMeditation from '@/components/mindfulness/AudioMeditation';
import GuidedBreathingVisualizer from '@/components/mindfulness/GuidedBreathingVisualizer';
import BodyScanVisualization from '@/components/mindfulness/BodyScanVisualization';
import MindfulnessProgressTracker from '@/components/mindfulness/MindfulnessProgressTracker';
import AIGeneratedAudios from '@/components/mindfulness/AIGeneratedAudios';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { useAnalytics } from '@/hooks/useAnalytics';
import MindfulnessExercises from '@/components/mindfulness/MindfulnessExercises';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

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
  const { trackMindfulnessSession } = useAnalytics();

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

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mindfulness & Meditation</h1>
          <p className="text-muted-foreground">Practice being present and cultivate awareness</p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Audio Guided
            </TabsTrigger>
            <TabsTrigger value="ai-audio" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              AI Audios
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Breathing
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            <MindfulnessExercises />
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AudioMeditation
                title="Morning Meditation"
                duration={600} // 10 minutes
                onComplete={() => handleSessionComplete('meditation', 10)}
              />
              <AudioMeditation
                title="Evening Relaxation"
                duration={900} // 15 minutes
                onComplete={() => handleSessionComplete('meditation', 15)}
              />
              <AudioMeditation
                title="Quick Mindfulness"
                duration={300} // 5 minutes
                onComplete={() => handleSessionComplete('meditation', 5)}
              />
              <BodyScanVisualization
                onComplete={() => handleSessionComplete('body_scan', 12)}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai-audio" className="space-y-6">
            <AIGeneratedAudios 
              onComplete={(audioId, duration) => handleSessionComplete('meditation', duration)}
            />
          </TabsContent>

          <TabsContent value="breathing" className="space-y-6">
            <GuidedBreathingVisualizer />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <MindfulnessProgressTracker
              sessions={sessions}
              weeklyGoal={70} // 70 minutes per week default goal
            />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default MindfulnessPage;
