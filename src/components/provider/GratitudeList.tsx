
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';

interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'simple' | 'moderate' | 'deep';
}

interface GratitudeListProps {
  gratitudePrompts: GratitudePrompt[];
  onDeleteGratitudePrompt: (id: string) => void;
}

const GratitudeList: React.FC<GratitudeListProps> = ({ gratitudePrompts, onDeleteGratitudePrompt }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Heart className="h-5 w-5" />
          Saved Gratitude Prompts ({gratitudePrompts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {gratitudePrompts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No gratitude prompts added yet</p>
        ) : (
          <div className="space-y-3">
            {gratitudePrompts.map(prompt => (
              <div key={prompt.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-[#7e868b] mb-2">{prompt.prompt}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">
                        {prompt.category}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteGratitudePrompt(prompt.id)}
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

export default GratitudeList;
