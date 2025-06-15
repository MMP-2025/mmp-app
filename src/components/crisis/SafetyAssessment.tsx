
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Phone, Shield, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'mood',
    question: 'How would you describe your current mood?',
    options: [
      { value: 'stable', label: 'Stable and manageable', score: 0 },
      { value: 'low', label: 'Low but manageable', score: 1 },
      { value: 'distressed', label: 'Significantly distressed', score: 2 },
      { value: 'crisis', label: 'In crisis', score: 3 }
    ]
  },
  {
    id: 'thoughts',
    question: 'Are you having thoughts of harming yourself?',
    options: [
      { value: 'none', label: 'No thoughts of harm', score: 0 },
      { value: 'passive', label: 'Wishing I could disappear', score: 1 },
      { value: 'active', label: 'Thinking about ways to harm myself', score: 2 },
      { value: 'plan', label: 'Have a specific plan', score: 3 }
    ]
  },
  {
    id: 'support',
    question: 'Do you have access to support right now?',
    options: [
      { value: 'strong', label: 'Strong support network available', score: 0 },
      { value: 'some', label: 'Some support available', score: 1 },
      { value: 'limited', label: 'Limited support', score: 2 },
      { value: 'none', label: 'No support available', score: 3 }
    ]
  },
  {
    id: 'coping',
    question: 'How well are your usual coping strategies working?',
    options: [
      { value: 'well', label: 'Working well', score: 0 },
      { value: 'somewhat', label: 'Working somewhat', score: 1 },
      { value: 'poorly', label: 'Not working well', score: 2 },
      { value: 'none', label: 'Not working at all', score: 3 }
    ]
  },
  {
    id: 'safety',
    question: 'Do you feel safe in your current environment?',
    options: [
      { value: 'safe', label: 'Completely safe', score: 0 },
      { value: 'mostly', label: 'Mostly safe', score: 1 },
      { value: 'somewhat', label: 'Somewhat unsafe', score: 2 },
      { value: 'unsafe', label: 'Very unsafe', score: 3 }
    ]
  }
];

const SafetyAssessment = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRiskLevel = () => {
    const totalScore = assessmentQuestions.reduce((sum, question) => {
      const answer = answers[question.id];
      if (!answer) return sum;
      
      const option = question.options.find(opt => opt.value === answer);
      return sum + (option?.score || 0);
    }, 0);

    if (totalScore <= 3) return 'low';
    if (totalScore <= 8) return 'moderate';
    return 'high';
  };

  const submitAssessment = () => {
    const allAnswered = assessmentQuestions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    const level = calculateRiskLevel();
    setRiskLevel(level);
    setIsComplete(true);
    toast.success('Assessment completed');
  };

  const resetAssessment = () => {
    setAnswers({});
    setIsComplete(false);
    setRiskLevel(null);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskLevelRecommendations = (level: string) => {
    switch (level) {
      case 'low':
        return {
          title: 'Low Risk',
          message: 'Your responses indicate you\'re managing well currently.',
          recommendations: [
            'Continue using your coping strategies',
            'Maintain your support connections',
            'Practice self-care activities',
            'Monitor your mood regularly'
          ]
        };
      case 'moderate':
        return {
          title: 'Moderate Risk',
          message: 'Your responses suggest you may benefit from additional support.',
          recommendations: [
            'Reach out to a trusted friend or family member',
            'Consider contacting a mental health professional',
            'Use crisis coping strategies from your safety plan',
            'Avoid being alone if possible',
            'Remove or secure any means of self-harm'
          ]
        };
      case 'high':
        return {
          title: 'High Risk',
          message: 'Your responses indicate you may be in immediate danger.',
          recommendations: [
            'Contact emergency services (911) immediately',
            'Call the 988 Suicide & Crisis Lifeline',
            'Go to your nearest emergency room',
            'Contact your crisis plan emergency contacts',
            'Do not leave yourself alone'
          ]
        };
      default:
        return null;
    }
  };

  if (isComplete && riskLevel) {
    const recommendations = getRiskLevelRecommendations(riskLevel);
    
    return (
      <div className="space-y-6">
        <Card className={`p-6 border-2 ${getRiskLevelColor(riskLevel)}`}>
          <div className="flex items-center gap-3 mb-4">
            {riskLevel === 'high' ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : riskLevel === 'moderate' ? (
              <Shield className="h-6 w-6 text-yellow-600" />
            ) : (
              <Heart className="h-6 w-6 text-green-600" />
            )}
            <h2 className="text-xl font-semibold">{recommendations?.title}</h2>
          </div>
          
          <p className="mb-4 text-lg">{recommendations?.message}</p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Recommended Actions:</h3>
            <ul className="list-disc list-inside space-y-1">
              {recommendations?.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          
          {riskLevel === 'high' && (
            <div className="mt-6 p-4 bg-red-100 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Emergency Contacts</h4>
              </div>
              <div className="space-y-1 text-red-800">
                <div>Emergency Services: <strong>911</strong></div>
                <div>Crisis Lifeline: <strong>988</strong></div>
                <div>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></div>
              </div>
            </div>
          )}
        </Card>
        
        <Button onClick={resetAssessment} variant="outline" className="w-full">
          Take Assessment Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <h2 className="text-xl font-semibold mb-4">Safety Assessment</h2>
        <p className="text-gray-600 mb-6">
          This quick assessment can help determine your current level of risk and provide appropriate resources. 
          Please answer honestly - your responses are private and not stored.
        </p>
        
        <div className="space-y-6">
          {assessmentQuestions.map((question) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">{question.question}</Label>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`} className="font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={submitAssessment} 
          className="w-full mt-6"
          disabled={assessmentQuestions.some(q => !answers[q.id])}
        >
          Submit Assessment
        </Button>
      </Card>
    </div>
  );
};

export default SafetyAssessment;
