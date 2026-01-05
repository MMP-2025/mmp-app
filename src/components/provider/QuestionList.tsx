import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Trash2 } from 'lucide-react';
interface Question {
  id: string;
  question: string;
  category?: string;
  type: 'reflection' | 'assessment' | 'screening';
}
interface QuestionListProps {
  questions: Question[];
  onDeleteQuestion: (id: string) => void;
}
const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onDeleteQuestion
}) => {
  return <Card>
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <HelpCircle className="h-5 w-5" />
          Saved Questions ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-mental-blue">
        {questions.length === 0 ? <p className="text-muted-foreground text-center py-8">No questions added yet</p> : <div className="space-y-3">
            {questions.map(question => <div key={question.id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-foreground mb-2">{question.question}</p>
                    <div className="flex items-center gap-2 text-sm">
                      {question.category && (
                        <span className="px-2 py-1 bg-mental-blue/50 text-foreground rounded-full text-xs">
                          {question.category}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-mental-peach/50 text-foreground rounded-full text-xs">
                        {question.type}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onDeleteQuestion(question.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
};
export default QuestionList;