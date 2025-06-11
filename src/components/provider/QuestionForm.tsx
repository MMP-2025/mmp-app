import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
interface Question {
  id: string;
  question: string;
  category: string;
  type: 'reflection' | 'assessment' | 'screening';
}
interface QuestionFormProps {
  newQuestion: {
    question: string;
    category: string;
    type: Question['type'];
  };
  setNewQuestion: React.Dispatch<React.SetStateAction<{
    question: string;
    category: string;
    type: Question['type'];
  }>>;
  onAddQuestion: () => void;
}
const QuestionForm: React.FC<QuestionFormProps> = ({
  newQuestion,
  setNewQuestion,
  onAddQuestion
}) => {
  return <Card className="bg-mental-blue">
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Plus className="h-5 w-5" />
          Add New Question
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-mental-blue">
        <Textarea placeholder="Enter question..." value={newQuestion.question} onChange={e => setNewQuestion(prev => ({
        ...prev,
        question: e.target.value
      }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Category (e.g., Mental Health, Wellness)" value={newQuestion.category} onChange={e => setNewQuestion(prev => ({
          ...prev,
          category: e.target.value
        }))} />
          <select value={newQuestion.type} onChange={e => setNewQuestion(prev => ({
          ...prev,
          type: e.target.value as Question['type']
        }))} className="p-2 border border-gray-300 rounded-md">
            <option value="reflection">Reflection</option>
            <option value="assessment">Assessment</option>
            <option value="screening">Screening</option>
          </select>
        </div>
        <Button onClick={onAddQuestion} className="bg-mental-gray">Add Question</Button>
      </CardContent>
    </Card>;
};
export default QuestionForm;