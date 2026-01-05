
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';

type JournalPromptDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: JournalPromptDifficulty;
}

interface JournalPromptListProps {
  journalPrompts: JournalPrompt[];
  onDeletePrompt: (id: string) => void;
}

const JournalPromptList: React.FC<JournalPromptListProps> = ({ journalPrompts, onDeletePrompt }) => {
  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5" />
          Saved Prompts ({journalPrompts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {journalPrompts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No prompts added yet</p>
        ) : (
          <div className="space-y-3">
            {journalPrompts.map(prompt => (
              <div key={prompt.id} className="p-4 border rounded-lg bg-mental-peach/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="mb-2 text-foreground">{prompt.prompt}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-mental-green/50 rounded-full text-xs text-foreground">
                        {prompt.category}
                      </span>
                      <span className="px-2 py-1 bg-mental-beige/50 rounded-full text-xs text-foreground">
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePrompt(prompt.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalPromptList;
