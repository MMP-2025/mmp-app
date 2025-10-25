
import React from 'react';
import { Button } from '@/components/ui/button';

interface MindfulnessFormProps {
  newMindfulnessPrompt: {
    prompt: string;
    category: string;
    duration: number;
  };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{
    prompt: string;
    category: string;
    duration: number;
  }>>;
  onAddMindfulnessPrompt: () => void;
}

const MindfulnessForm: React.FC<MindfulnessFormProps> = ({
  newMindfulnessPrompt,
  setNewMindfulnessPrompt,
  onAddMindfulnessPrompt
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-neutral-500 mb-4">Add New Mindfulness Prompt</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-500 mb-1">Prompt</label>
          <textarea
            value={newMindfulnessPrompt.prompt}
            onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, prompt: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
            rows={3}
            placeholder="Enter mindfulness prompt..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Category</label>
            <input
              type="text"
              value={newMindfulnessPrompt.category}
              onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
              placeholder="e.g., Breathing, Body Scan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={newMindfulnessPrompt.duration}
              onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, duration: parseInt(e.target.value) || 5})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
              placeholder="e.g., 5"
              min="1"
            />
          </div>
        </div>
        <Button 
          onClick={onAddMindfulnessPrompt}
          className="w-full"
        >
          Add Mindfulness Prompt
        </Button>
      </div>
    </div>
  );
};

export default MindfulnessForm;
