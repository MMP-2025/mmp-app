
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CBTSession {
  thought?: string;
  emotion?: string;
  evidence?: string;
  alternativeThought?: string;
  newEmotion?: string;
}

interface CBTStepFormProps {
  step: number;
  sessionData: Partial<CBTSession>;
  onUpdateField: (field: keyof CBTSession, value: string) => void;
}

export const CBTStepForm: React.FC<CBTStepFormProps> = ({ step, sessionData, onUpdateField }) => {
  const stepConfigs = [
    {
      field: 'thought' as keyof CBTSession,
      label: 'What negative thought is bothering you?',
      placeholder: 'Write the exact thought that\'s causing distress...'
    },
    {
      field: 'emotion' as keyof CBTSession,
      label: 'How does this thought make you feel? (0-10 intensity)',
      placeholder: 'Describe your emotions and rate their intensity...'
    },
    {
      field: 'evidence' as keyof CBTSession,
      label: 'What evidence supports or contradicts this thought?',
      placeholder: 'List facts for and against this thought...'
    },
    {
      field: 'alternativeThought' as keyof CBTSession,
      label: 'What\'s a more balanced, realistic thought?',
      placeholder: 'Rewrite your thought in a more balanced way...'
    },
    {
      field: 'newEmotion' as keyof CBTSession,
      label: 'How do you feel now with this new perspective?',
      placeholder: 'Describe your emotions with the new thought...'
    }
  ];

  const config = stepConfigs[step];
  if (!config) return null;

  return (
    <div>
      <Label className="mb-2 block" style={{color: '#737373'}}>
        {config.label}
      </Label>
      <Textarea
        placeholder={config.placeholder}
        value={sessionData[config.field] || ''}
        onChange={e => onUpdateField(config.field, e.target.value)}
        className="h-20"
      />
    </div>
  );
};
