
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <FileText className="h-5 w-5" />
          Saved Prompts ({journalPrompts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {journalPrompts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No prompts added yet</p>
        ) : (
          <div className="space-y-3">
            {journalPrompts.map(prompt => (
              <div key={prompt.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-[#7e868b] mb-2">{prompt.prompt}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {prompt.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePrompt(prompt.id)}
                    className="text-red-600"
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
