
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { CBTStepForm } from './CBTStepForm';
import { toast } from 'sonner';

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

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

interface CBTSessionWizardProps {
  module: CBTModule;
  onComplete: (session: CBTSession) => void;
  onCancel: () => void;
}

export const CBTSessionWizard: React.FC<CBTSessionWizardProps> = ({ module, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<CBTSession>>({
    id: `cbt_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    module: module.title,
    timestamp: Date.now(),
    completed: false
  });

  const updateSessionField = (field: keyof CBTSession, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < module.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    if (!sessionData.thought || !sessionData.emotion || !sessionData.evidence || 
        !sessionData.alternativeThought || !sessionData.newEmotion) {
      toast.error('Please complete all fields before finishing');
      return;
    }

    const completedSession: CBTSession = {
      ...sessionData as CBTSession,
      completed: true
    };

    onComplete(completedSession);
    toast.success('CBT session completed! Great work on challenging your thoughts.');
  };

  const progress = ((currentStep + 1) / module.steps.length) * 100;

  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" style={{color: '#737373'}} />
        <h4 className="text-lg font-semibold" style={{color: '#737373'}}>
          {module.title} - Step {currentStep + 1}
        </h4>
      </div>

      <Progress value={progress} className="mb-4" />
      <p className="mb-4" style={{color: '#737373'}}>{module.steps[currentStep]}</p>

      <CBTStepForm 
        step={currentStep}
        sessionData={sessionData}
        onUpdateField={updateSessionField}
      />

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={nextStep} className="flex items-center gap-2">
          {currentStep === module.steps.length - 1 ? (
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
