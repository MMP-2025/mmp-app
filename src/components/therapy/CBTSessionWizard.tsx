import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

interface CBTSessionData {
  date: string;
  module_type: string;
  situation?: string;
  thoughts?: string;
  emotions?: string;
  behaviors?: string;
  alternative_thoughts?: string;
  outcome?: string;
  notes?: string;
}

interface CBTSessionWizardProps {
  module: CBTModule;
  onComplete: (session: CBTSessionData) => Promise<void>;
  onCancel: () => void;
}

export const CBTSessionWizard: React.FC<CBTSessionWizardProps> = ({ module, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState<CBTSessionData>({
    date: new Date().toISOString().split('T')[0],
    module_type: module.id,
    situation: '',
    thoughts: '',
    emotions: '',
    behaviors: '',
    alternative_thoughts: '',
    outcome: '',
    notes: ''
  });

  const updateField = (field: keyof CBTSessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < module.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    if (!sessionData.thoughts || !sessionData.emotions || !sessionData.alternative_thoughts) {
      toast.error('Please complete all required fields before finishing');
      return;
    }

    await onComplete(sessionData);
  };

  const progress = ((currentStep + 1) / module.steps.length) * 100;

  const renderStepInput = () => {
    switch (currentStep) {
      case 0:
        return (
          <Textarea
            placeholder="Describe the situation or thought..."
            value={sessionData.situation || ''}
            onChange={(e) => updateField('situation', e.target.value)}
            rows={4}
          />
        );
      case 1:
        return (
          <Textarea
            placeholder="What thoughts came to mind?"
            value={sessionData.thoughts || ''}
            onChange={(e) => updateField('thoughts', e.target.value)}
            rows={4}
          />
        );
      case 2:
        return (
          <Textarea
            placeholder="What emotions did you feel?"
            value={sessionData.emotions || ''}
            onChange={(e) => updateField('emotions', e.target.value)}
            rows={4}
          />
        );
      case 3:
        return (
          <Textarea
            placeholder="What alternative perspective could you consider?"
            value={sessionData.alternative_thoughts || ''}
            onChange={(e) => updateField('alternative_thoughts', e.target.value)}
            rows={4}
          />
        );
      case 4:
        return (
          <Textarea
            placeholder="How do you feel now with this new perspective?"
            value={sessionData.outcome || ''}
            onChange={(e) => updateField('outcome', e.target.value)}
            rows={4}
          />
        );
      default:
        return null;
    }
  };

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

      {renderStepInput()}

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
