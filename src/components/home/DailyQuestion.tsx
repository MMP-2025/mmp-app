
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToastService } from '@/hooks/useToastService';

interface DailyQuestionProps {
  question: string;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ question }) => {
  const [response, setResponse] = useState('');
  const { trackAction } = useAnalytics();
  const { showSuccess, showWarning } = useToastService();

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      showWarning("Please write a response before submitting");
      return;
    }

    trackAction('daily_question_answered', {
      question: question,
      responseLength: response.length
    });

    showSuccess("Your response has been recorded");
    console.log("Response submitted:", response);
    setResponse('');
  };

  return (
    <Card className="p-6 bg-mental-blue/20">
      <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Question of the Day</h2>
      <p className="text-lg mb-4 text-[#7e868b]">{question}</p>
      
      <div className="space-y-4">
        <Input 
          placeholder="Write your response..." 
          value={response} 
          onChange={e => setResponse(e.target.value)} 
          className="bg-white" 
        />
        <Button 
          onClick={handleSubmitResponse} 
          className="w-full bg-mental-green hover:bg-mental-green/80"
        >
          Submit Response
        </Button>
      </div>
    </Card>
  );
};

export default DailyQuestion;
