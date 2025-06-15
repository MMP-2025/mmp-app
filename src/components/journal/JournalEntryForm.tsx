
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Quote, BookmarkPlus, BookmarkCheck } from "lucide-react";

interface JournalEntryFormProps {
  journalContent: string;
  setJournalContent: (content: string) => void;
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  savedPrompts: string[];
  onGetRandomPrompt: () => void;
  onStartFreeWriting: () => void;
  onSaveEntry: () => void;
  onToggleSavedPrompt: (prompt: string) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  journalContent,
  setJournalContent,
  currentPrompt,
  savedPrompts,
  onGetRandomPrompt,
  onStartFreeWriting,
  onSaveEntry,
  onToggleSavedPrompt
}) => {
  return (
    <Card className="p-6 bg-mental-beige/20">
      <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">New Entry</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={onGetRandomPrompt} className="bg-mental-blue hover:bg-mental-blue/80 flex items-center gap-2">
          <Quote className="h-4 w-4 text-[#7e868b]" />
          Get Writing Prompt
        </Button>
        <Button onClick={onStartFreeWriting} className="bg-mental-green hover:bg-mental-green/80 flex items-center gap-2">
          <Edit className="h-4 w-4 text-[#7e868b]" />
          Free Writing
        </Button>
      </div>
      
      {currentPrompt && (
        <div className="bg-mental-blue/10 p-4 rounded-md mb-4">
          <div className="flex justify-between items-start">
            <p className="font-medium text-[#7e868b] flex-1">Prompt: {currentPrompt}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleSavedPrompt(currentPrompt)}
              className="p-1 ml-2"
            >
              {savedPrompts.includes(currentPrompt) ? (
                <BookmarkCheck className="h-5 w-5 text-blue-600" />
              ) : (
                <BookmarkPlus className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      )}
      
      <Textarea 
        placeholder={currentPrompt ? "Write your thoughts about this prompt..." : "Write freely..."} 
        value={journalContent} 
        onChange={e => setJournalContent(e.target.value)} 
        className="min-h-[200px] mb-4" 
      />
      
      <Button onClick={onSaveEntry} className="w-full bg-mental-green hover:bg-mental-green/80">
        Save Journal Entry
      </Button>
    </Card>
  );
};

export default JournalEntryForm;
