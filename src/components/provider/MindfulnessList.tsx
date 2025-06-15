
import React from 'react';
import { Button } from '@/components/ui/button';
import { MindfulnessPrompt } from '@/types/provider';

interface MindfulnessListProps {
  mindfulnessPrompts: MindfulnessPrompt[];
  onDeleteMindfulnessPrompt: (id: string) => void;
}

const MindfulnessList: React.FC<MindfulnessListProps> = ({
  mindfulnessPrompts,
  onDeleteMindfulnessPrompt
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-neutral-500">Mindfulness Prompts ({mindfulnessPrompts.length})</h2>
      </div>
      <div className="p-6">
        {mindfulnessPrompts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No mindfulness prompts added yet.</p>
        ) : (
          <div className="space-y-4">
            {mindfulnessPrompts.map((prompt) => (
              <div key={prompt.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-neutral-500 mb-2">{prompt.prompt}</p>
                    <div className="flex gap-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {prompt.category}
                      </span>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {prompt.duration}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteMindfulnessPrompt(prompt.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MindfulnessList;
