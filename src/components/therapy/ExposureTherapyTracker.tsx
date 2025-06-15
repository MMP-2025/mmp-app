
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/utils/storage';
import { Target, TrendingUp, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExposureGoal {
  id: string;
  title: string;
  description: string;
  fearLevel: number;
  targetDate: string;
  steps: ExposureStep[];
  completed: boolean;
  createdAt: number;
}

interface ExposureStep {
  id: string;
  description: string;
  fearLevel: number;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

interface ExposureSession {
  id: string;
  goalId: string;
  stepId: string;
  date: string;
  preFear: number;
  postFear: number;
  duration: number;
  notes: string;
  successful: boolean;
  timestamp: number;
}

const ExposureTherapyTracker: React.FC = () => {
  const [goals, setGoals] = useState<ExposureGoal[]>([]);
  const [sessions, setSessions] = useState<ExposureSession[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showSession, setShowSession] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    fearLevel: [7],
    targetDate: '',
    steps: ['']
  });
  const [sessionData, setSessionData] = useState({
    preFear: [5],
    postFear: [5],
    duration: 30,
    notes: ''
  });

  useEffect(() => {
    const savedGoals = StorageManager.load<ExposureGoal[]>('exposure_goals', []);
    const savedSessions = StorageManager.load<ExposureSession[]>('exposure_sessions', []);
    setGoals(savedGoals);
    setSessions(savedSessions);
  }, []);

  const createGoal = () => {
    if (!newGoal.title.trim() || !newGoal.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    const steps: ExposureStep[] = newGoal.steps
      .filter(step => step.trim())
      .map((step, index) => ({
        id: `step_${Date.now()}_${index}`,
        description: step,
        fearLevel: Math.max(1, newGoal.fearLevel[0] - index),
        completed: false
      }));

    const goal: ExposureGoal = {
      id: `goal_${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      fearLevel: newGoal.fearLevel[0],
      targetDate: newGoal.targetDate,
      steps,
      completed: false,
      createdAt: Date.now()
    };

    const updatedGoals = [goal, ...goals];
    setGoals(updatedGoals);
    StorageManager.save('exposure_goals', updatedGoals);

    setNewGoal({ title: '', description: '', fearLevel: [7], targetDate: '', steps: [''] });
    setShowCreateGoal(false);
    toast.success('Exposure goal created!');
  };

  const addStep = () => {
    setNewGoal(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    setNewGoal(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const startSession = (goalId: string, stepId: string) => {
    setShowSession(`${goalId}_${stepId}`);
    setSessionData({
      preFear: [5],
      postFear: [5],
      duration: 30,
      notes: ''
    });
  };

  const completeSession = () => {
    if (!showSession) return;

    const [goalId, stepId] = showSession.split('_');
    
    const session: ExposureSession = {
      id: `session_${Date.now()}`,
      goalId,
      stepId,
      date: new Date().toISOString().split('T')[0],
      preFear: sessionData.preFear[0],
      postFear: sessionData.postFear[0],
      duration: sessionData.duration,
      notes: sessionData.notes,
      successful: sessionData.postFear[0] < sessionData.preFear[0],
      timestamp: Date.now()
    };

    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    StorageManager.save('exposure_sessions', updatedSessions);

    // Mark step as completed if fear reduced significantly
    if (session.successful) {
      const updatedGoals = goals.map(goal => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                completed: true,
                completedDate: session.date,
                notes: session.notes
              };
            }
            return step;
          });
          
          const allStepsCompleted = updatedSteps.every(step => step.completed);
          return {
            ...goal,
            steps: updatedSteps,
            completed: allStepsCompleted
          };
        }
        return goal;
      });
      
      setGoals(updatedGoals);
      StorageManager.save('exposure_goals', updatedGoals);
    }

    setShowSession(null);
    toast.success(session.successful ? 'Great progress! Step completed.' : 'Session recorded. Keep practicing!');
  };

  const getProgressPercentage = (goal: ExposureGoal) => {
    const completedSteps = goal.steps.filter(step => step.completed).length;
    return (completedSteps / goal.steps.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" style={{color: '#737373'}} />
            <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Exposure Therapy Tracker</h3>
          </div>
          <Button onClick={() => setShowCreateGoal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>
        
        <p className="mb-4" style={{color: '#737373'}}>
          Gradually face your fears with structured exposure exercises
        </p>

        {showCreateGoal && (
          <div className="border rounded-lg p-4 mb-4 bg-mental-peach/20">
            <h4 className="font-semibold mb-3" style={{color: '#737373'}}>Create Exposure Goal</h4>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Goal Title</Label>
                <Input
                  placeholder="e.g., Speaking in public"
                  value={newGoal.title}
                  onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Description</Label>
                <Textarea
                  placeholder="Describe what you want to overcome..."
                  value={newGoal.description}
                  onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>
                  Current Fear Level: {newGoal.fearLevel[0]}/10
                </Label>
                <Slider
                  value={newGoal.fearLevel}
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, fearLevel: value }))}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Target Date</Label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={e => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>

              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Exposure Steps (easiest to hardest)</Label>
                {newGoal.steps.map((step, index) => (
                  <Input
                    key={index}
                    className="mb-2"
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={e => updateStep(index, e.target.value)}
                  />
                ))}
                <Button variant="outline" onClick={addStep} className="w-full">
                  Add Step
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={createGoal}>Create Goal</Button>
                <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {goals.map(goal => (
        <Card key={goal.id} className="p-6 bg-white/90">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold" style={{color: '#737373'}}>{goal.title}</h4>
              <p className="text-sm" style={{color: '#737373'}}>{goal.description}</p>
            </div>
            <Badge variant={goal.completed ? "default" : "secondary"}>
              {goal.completed ? "Completed" : "In Progress"}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{color: '#737373'}}>Progress</span>
              <span className="text-sm" style={{color: '#737373'}}>
                {getProgressPercentage(goal).toFixed(0)}%
              </span>
            </div>
            <Progress value={getProgressPercentage(goal)} />
          </div>

          <div className="space-y-3">
            {goal.steps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 border rounded-full" />
                  )}
                  <div>
                    <span className="text-sm" style={{color: '#737373'}}>{step.description}</span>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Fear Level: {step.fearLevel}/10
                      </Badge>
                      {step.completed && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Completed {step.completedDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {!step.completed && (
                  <Button
                    size="sm"
                    onClick={() => startSession(goal.id, step.id)}
                  >
                    Start Practice
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {showSession && (
        <Card className="p-6 bg-white/90">
          <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Exposure Session</h4>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                Fear Level Before: {sessionData.preFear[0]}/10
              </Label>
              <Slider
                value={sessionData.preFear}
                onValueChange={(value) => setSessionData(prev => ({ ...prev, preFear: value }))}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>Duration (minutes)</Label>
              <Input
                type="number"
                value={sessionData.duration}
                onChange={e => setSessionData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                Fear Level After: {sessionData.postFear[0]}/10
              </Label>
              <Slider
                value={sessionData.postFear}
                onValueChange={(value) => setSessionData(prev => ({ ...prev, postFear: value }))}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>Session Notes</Label>
              <Textarea
                placeholder="How did it go? What did you learn?"
                value={sessionData.notes}
                onChange={e => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={completeSession}>Complete Session</Button>
              <Button variant="outline" onClick={() => setShowSession(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExposureTherapyTracker;
