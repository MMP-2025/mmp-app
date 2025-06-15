
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/utils/storage';
import { Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CBTSession {
  id: string;
  date: string;
  module: string;
  thought: string;
  emotion: string;
  evidence: string;
  alternativeThought: string;
  newEmotion: string;
  completed: boolean;
  timestamp: number;
}

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

const CBTModules: React.FC = () => {
  const [sessions, setSessions] = useState<CBTSession[]>([]);
  const [currentSession, setCurrentSession] = useState<Partial<CBTSession>>({});
  const [currentModule, setCurrentModule] = useState<CBTModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const modules: CBTModule[] = [
    {
      id: 'thought-challenging',
      title: 'Thought Challenging',
      description: 'Learn to identify and challenge negative thought patterns',
      steps: [
        'Identify the troubling thought',
        'Recognize the emotion it creates',
        'Examine evidence for the thought',
        'Develop a more balanced perspective',
        'Notice how your emotions change'
      ]
    },
    {
      id: 'cognitive-restructuring',
      title: 'Cognitive Restructuring',
      description: 'Replace distorted thoughts with more realistic ones',
      steps: [
        'Catch the negative thought',
        'Identify the cognitive distortion',
        'Challenge the thought with questions',
        'Create a balanced alternative',
        'Practice the new thought pattern'
      ]
    }
  ];

  useEffect(() => {
    const savedSessions = StorageManager.load<CBTSession[]>('cbt_sessions', []);
    setSessions(savedSessions);
  }, []);

  const startModule = (module: CBTModule) => {
    setCurrentModule(module);
    setCurrentStep(0);
    setCurrentSession({
      id: `cbt_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      module: module.title,
      timestamp: Date.now(),
      completed: false
    });
  };

  const updateSessionField = (field: keyof CBTSession, value: string) => {
    setCurrentSession(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentModule && currentStep < currentModule.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    if (!currentSession.thought || !currentSession.emotion || !currentSession.evidence || 
        !currentSession.alternativeThought || !currentSession.newEmotion) {
      toast.error('Please complete all fields before finishing');
      return;
    }

    const completedSession: CBTSession = {
      ...currentSession as CBTSession,
      completed: true
    };

    const updatedSessions = [completedSession, ...sessions];
    setSessions(updatedSessions);
    StorageManager.save('cbt_sessions', updatedSessions);

    setCurrentModule(null);
    setCurrentStep(0);
    setCurrentSession({});
    toast.success('CBT session completed! Great work on challenging your thoughts.');
  };

  const getCompletedModules = () => {
    return sessions.filter(session => session.completed).length;
  };

  const renderCurrentStep = () => {
    if (!currentModule) return null;

    const step = currentModule.steps[currentStep];
    const progress = ((currentStep + 1) / currentModule.steps.length) * 100;

    return (
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5" style={{color: '#737373'}} />
          <h4 className="text-lg font-semibold" style={{color: '#737373'}}>
            {currentModule.title} - Step {currentStep + 1}
          </h4>
        </div>

        <Progress value={progress} className="mb-4" />
        <p className="mb-4" style={{color: '#737373'}}>{step}</p>

        <div className="space-y-4">
          {currentStep === 0 && (
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                What negative thought is bothering you?
              </Label>
              <Textarea
                placeholder="Write the exact thought that's causing distress..."
                value={currentSession.thought || ''}
                onChange={e => updateSessionField('thought', e.target.value)}
                className="h-20"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                How does this thought make you feel? (0-10 intensity)
              </Label>
              <Textarea
                placeholder="Describe your emotions and rate their intensity..."
                value={currentSession.emotion || ''}
                onChange={e => updateSessionField('emotion', e.target.value)}
                className="h-20"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                What evidence supports or contradicts this thought?
              </Label>
              <Textarea
                placeholder="List facts for and against this thought..."
                value={currentSession.evidence || ''}
                onChange={e => updateSessionField('evidence', e.target.value)}
                className="h-20"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                What's a more balanced, realistic thought?
              </Label>
              <Textarea
                placeholder="Rewrite your thought in a more balanced way..."
                value={currentSession.alternativeThought || ''}
                onChange={e => updateSessionField('alternativeThought', e.target.value)}
                className="h-20"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                How do you feel now with this new perspective?
              </Label>
              <Textarea
                placeholder="Describe your emotions with the new thought..."
                value={currentSession.newEmotion || ''}
                onChange={e => updateSessionField('newEmotion', e.target.value)}
                className="h-20"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentModule(null)}
          >
            Cancel
          </Button>
          <Button onClick={nextStep} className="flex items-center gap-2">
            {currentStep === currentModule.steps.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Complete Session
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>CBT Modules</h3>
        </div>
        <p className="mb-4" style={{color: '#737373'}}>
          Cognitive Behavioral Therapy exercises to help challenge and reframe negative thoughts
        </p>
        
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            Completed Sessions: {getCompletedModules()}
          </Badge>
        </div>

        {!currentModule && (
          <div className="grid gap-4">
            {modules.map(module => (
              <div key={module.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2" style={{color: '#737373'}}>{module.title}</h4>
                <p className="text-sm mb-3" style={{color: '#737373'}}>{module.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{color: '#737373'}}>
                    {module.steps.length} steps
                  </div>
                  <Button onClick={() => startModule(module)}>
                    Start Module
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {currentModule && renderCurrentStep()}

      {sessions.length > 0 && (
        <Card className="p-6 bg-white/90">
          <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Session History</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessions.slice(0, 10).map(session => (
              <div key={session.id} className="border rounded-lg p-3 bg-mental-peach/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium" style={{color: '#737373'}}>{session.module}</span>
                  <Badge variant={session.completed ? "default" : "secondary"}>
                    {session.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <p className="text-sm mb-2" style={{color: '#737373'}}>
                  <strong>Original thought:</strong> {session.thought}
                </p>
                {session.alternativeThought && (
                  <p className="text-sm" style={{color: '#737373'}}>
                    <strong>Balanced thought:</strong> {session.alternativeThought}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">{session.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CBTModules;
