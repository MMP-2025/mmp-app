
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Quote, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { SuccessAnimation } from '@/components/common/SuccessAnimation';

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onSaveEntry();
    setShowSuccess(true);
  };

  return (
    <>
      {showSuccess && (
        <SuccessAnimation 
          message="Journal entry saved! 📝"
          onComplete={() => setShowSuccess(false)}
        />
      )}
    <Card className="p-6 bg-mental-warm/20">
      <h2 className="text-xl font-semibold mb-4 text-foreground">New Entry</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={onGetRandomPrompt} variant="secondary" className="flex items-center gap-2">
          <Quote className="h-4 w-4" />
          Get Writing Prompt
        </Button>
        <Button onClick={onStartFreeWriting} variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
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
      
      <Button
        onClick={handleSave}
        disabled={!journalContent.trim()}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover-scale"
      >
        Save Journal Entry
      </Button>
    </Card>
    </>
  );
};

export default JournalEntryForm;
