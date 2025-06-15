
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/utils/storage';
import { Brain, Play, Pause, RotateCcw, Volume2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  script: string[];
  duration: number; // in seconds
  moodContext: string;
  category: 'anxiety' | 'stress' | 'sadness' | 'anger' | 'general';
  voiceInstructions: string[];
}

interface SessionProgress {
  currentStep: number;
  isPlaying: boolean;
  timeRemaining: number;
  completed: boolean;
}

const PersonalizedMeditation: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    currentStep: 0,
    isPlaying: false,
    timeRemaining: 0,
    completed: false
  });
  const [recentMoods, setRecentMoods] = useState<string[]>([]);

  useEffect(() => {
    loadRecentMoods();
  }, []);

  const loadRecentMoods = () => {
    const moodEntries = StorageManager.load('mood_entries', []);
    const recent = moodEntries
      .slice(0, 5)
      .map((entry: any) => entry.mood);
    setRecentMoods(recent);
  };

  const generatePersonalizedMeditation = (targetMood?: string): MeditationSession => {
    const primaryMood = targetMood || (recentMoods.length > 0 ? recentMoods[0] : 'general');
    
    const meditationTemplates = {
      'Sad': {
        category: 'sadness' as const,
        title: 'Gentle Self-Compassion',
        description: 'A nurturing meditation to help you process sadness with kindness',
        script: [
          'Find a comfortable position and close your eyes gently.',
          'Take three deep breaths, allowing each exhale to release tension.',
          'Notice the sadness within you without judgment.',
          'Place a hand on your heart and feel its steady rhythm.',
          'Send yourself the same compassion you would offer a dear friend.',
          'Remember that sadness is a natural part of the human experience.',
          'Breathe in acceptance, breathe out resistance.',
          'Allow yourself to feel held by your own loving presence.'
        ],
        duration: 480
      },
      'Angry': {
        category: 'anger' as const,
        title: 'Cooling Breath Practice',
        description: 'A calming meditation to help transform anger into clarity',
        script: [
          'Sit tall and take a moment to acknowledge your feelings.',
          'Begin with slow, deliberate breathing.',
          'Imagine your breath as cool, blue light flowing through you.',
          'With each inhale, invite calm into your body.',
          'With each exhale, release the heat of anger.',
          'Notice where tension lives in your body and breathe into those spaces.',
          'Transform this energy into clear, purposeful action.',
          'Feel yourself returning to your centered, wise self.'
        ],
        duration: 420
      },
      'Happy': {
        category: 'general' as const,
        title: 'Gratitude Amplification',
        description: 'A joyful meditation to expand and appreciate your happiness',
        script: [
          'Settle into this moment of happiness with awareness.',
          'Take deep breaths and smile naturally.',
          'Feel the warmth of joy spreading through your body.',
          'Bring to mind what has contributed to this happiness.',
          'Send gratitude to yourself and others.',
          'Imagine this joy radiating outward to touch others.',
          'Store this feeling in your heart for future moments.',
          'Rest in this state of appreciation and contentment.'
        ],
        duration: 360
      },
      'Neutral': {
        category: 'general' as const,
        title: 'Present Moment Awareness',
        description: 'A grounding meditation to enhance your natural state of calm',
        script: [
          'Begin by simply noticing that you are here, now.',
          'Feel your body supported by what you\'re sitting or lying on.',
          'Tune into your natural breath without changing it.',
          'Notice the sounds around you, near and far.',
          'Feel the temperature of the air on your skin.',
          'Appreciate this moment of neutrality and balance.',
          'Rest in the simplicity of just being.',
          'Let this centeredness become your foundation.'
        ],
        duration: 300
      },
      'Ecstatic': {
        category: 'general' as const,
        title: 'Energy Integration',
        description: 'A dynamic meditation to channel and ground your high energy',
        script: [
          'Feel the vibrant energy flowing through you.',
          'Take energizing breaths that match your excitement.',
          'Notice how this energy moves through your body.',
          'Channel this power into positive intention.',
          'Breathe in possibility, breathe out manifestation.',
          'Ground this energy into stable, lasting joy.',
          'Share this vibration with the world around you.',
          'Integrate this energy as a source of ongoing strength.'
        ],
        duration: 420
      }
    };

    const template = meditationTemplates[primaryMood as keyof typeof meditationTemplates] || 
                    meditationTemplates['Neutral'];

    return {
      id: `meditation_${Date.now()}`,
      title: template.title,
      description: template.description,
      script: template.script,
      duration: template.duration,
      moodContext: primaryMood,
      category: template.category,
      voiceInstructions: template.script.map(step => 
        `Take a moment to... ${step.toLowerCase()}`
      )
    };
  };

  const startMeditation = (targetMood?: string) => {
    const session = generatePersonalizedMeditation(targetMood);
    setCurrentSession(session);
    setSessionProgress({
      currentStep: 0,
      isPlaying: true,
      timeRemaining: session.duration,
      completed: false
    });
    toast.success(`Starting personalized meditation: ${session.title}`);
  };

  const togglePlayPause = () => {
    setSessionProgress(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const resetSession = () => {
    if (currentSession) {
      setSessionProgress({
        currentStep: 0,
        isPlaying: false,
        timeRemaining: currentSession.duration,
        completed: false
      });
    }
  };

  const completeSession = () => {
    if (currentSession) {
      const completedSessions = StorageManager.load('completed_meditations', []);
      const newSession = {
        ...currentSession,
        completedAt: new Date().toISOString(),
        actualDuration: currentSession.duration - sessionProgress.timeRemaining
      };
      
      StorageManager.save('completed_meditations', [newSession, ...completedSessions]);
      
      setSessionProgress(prev => ({ ...prev, completed: true, isPlaying: false }));
      toast.success('Meditation completed! Well done.');
    }
  };

  // Simulate meditation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionProgress.isPlaying && sessionProgress.timeRemaining > 0) {
      interval = setInterval(() => {
        setSessionProgress(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            completeSession();
            return { ...prev, timeRemaining: 0, isPlaying: false };
          }
          
          // Auto-advance steps
          const stepDuration = currentSession ? currentSession.duration / currentSession.script.length : 60;
          const newStep = Math.floor((currentSession!.duration - newTimeRemaining) / stepDuration);
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            currentStep: Math.min(newStep, currentSession!.script.length - 1)
          };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [sessionProgress.isPlaying, sessionProgress.timeRemaining, currentSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodBasedSuggestions = () => {
    const moodCategories = ['Sad', 'Angry', 'Happy', 'Neutral', 'Ecstatic'];
    return moodCategories.filter(mood => mood !== recentMoods[0] || recentMoods.length === 0);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Personalized Meditation</h3>
        </div>
        
        <p className="mb-4" style={{color: '#737373'}}>
          AI-generated guided meditations tailored to your current emotional state
        </p>

        {!currentSession ? (
          <div className="space-y-4">
            {recentMoods.length > 0 && (
              <div>
                <h4 className="font-medium mb-2" style={{color: '#737373'}}>
                  Based on your recent mood: {recentMoods[0]}
                </h4>
                <Button 
                  onClick={() => startMeditation(recentMoods[0])}
                  className="w-full bg-mental-green hover:bg-mental-green/80"
                >
                  Start Personalized Session
                </Button>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-3" style={{color: '#737373'}}>
                Or choose a specific focus:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {getMoodBasedSuggestions().map(mood => (
                  <Button
                    key={mood}
                    variant="outline"
                    onClick={() => startMeditation(mood)}
                    className="text-sm"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-1" style={{color: '#737373'}}>
                {currentSession.title}
              </h4>
              <p className="text-sm mb-2" style={{color: '#737373'}}>
                {currentSession.description}
              </p>
              <Badge variant="outline" className="mb-4">
                For {currentSession.moodContext} mood
              </Badge>
            </div>

            <div className="bg-mental-peach/20 p-4 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2" style={{color: '#737373'}}>
                  {formatTime(sessionProgress.timeRemaining)}
                </div>
                <Progress 
                  value={((currentSession.duration - sessionProgress.timeRemaining) / currentSession.duration) * 100} 
                  className="mb-2"
                />
                <p className="text-sm" style={{color: '#737373'}}>
                  Step {sessionProgress.currentStep + 1} of {currentSession.script.length}
                </p>
              </div>

              <div className="text-center p-4 bg-white/50 rounded-lg mb-4">
                <p className="text-lg leading-relaxed" style={{color: '#737373'}}>
                  {currentSession.script[sessionProgress.currentStep]}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSession}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={togglePlayPause}
                  className="flex items-center gap-2 bg-mental-green hover:bg-mental-green/80"
                >
                  {sessionProgress.isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {sessionProgress.timeRemaining === currentSession.duration ? 'Start' : 'Resume'}
                    </>
                  )}
                </Button>
                {sessionProgress.completed && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSession(null)}
                    className="flex items-center gap-2"
                  >
                    New Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PersonalizedMeditation;
