
import React, { useState } from 'react';
import { useToastService } from '@/hooks/useToastService';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalPromptData } from '@/hooks/useJournalPromptData';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalEntriesList from '@/components/journal/JournalEntriesList';


const JournalPage = () => {
  const [journalContent, setJournalContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  
  const { journalEntries, saveJournalEntry: saveEntry } = useJournalEntries();
  const { journalPrompts } = useJournalPromptData();
  const { trackJournalEntry, trackAction } = useAnalytics();
  const { showSuccess, showWarning, showInfo } = useToastService();

  const toggleSavedPrompt = (prompt: string) => {
    setSavedPrompts(prev => {
      const isCurrentlySaved = prev.includes(prompt);
      
      if (isCurrentlySaved) {
        showSuccess('Prompt removed from saved');
        trackAction('prompt_saved', { prompt, action: 'removed' });
        return prev.filter(p => p !== prompt);
      } else {
        showSuccess('Prompt saved!');
        trackAction('prompt_saved', { prompt, action: 'added' });
        return [...prev, prompt];
      }
    });
  };

  const getRandomPrompt = () => {
    if (journalPrompts.length === 0) {
      showWarning("No prompts available");
      return;
    }
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    const selectedPrompt = journalPrompts[randomIndex].prompt;
    setCurrentPrompt(selectedPrompt);
    setJournalContent('');
    trackAction('random_prompt_selected', { prompt: selectedPrompt });
    showInfo("New prompt loaded. Happy writing!");
  };

  const startFreeWriting = () => {
    setCurrentPrompt('');
    setJournalContent('');
    trackAction('free_writing_started');
    showInfo("Ready for free writing. Express yourself!");
  };

  const saveJournalEntry = async () => {
    if (!journalContent.trim()) {
      showWarning("Please write something before saving");
      return;
    }
    
    try {
      const wordCount = journalContent.trim().split(/\s+/).length;
      await saveEntry(journalContent, currentPrompt);
      trackJournalEntry(!!currentPrompt, wordCount);
      
      setJournalContent('');
      setCurrentPrompt('');
      showSuccess("Journal entry saved");
    } catch (error) {
      showWarning("Failed to save journal entry");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#7e868b]">Journal</h1>
        <p className="text-[#7e868b]">Express your thoughts and feelings</p>
      </div>
      
      <JournalEntryForm
        journalContent={journalContent}
        setJournalContent={setJournalContent}
        currentPrompt={currentPrompt}
        setCurrentPrompt={setCurrentPrompt}
        savedPrompts={savedPrompts}
        onGetRandomPrompt={getRandomPrompt}
        onStartFreeWriting={startFreeWriting}
        onSaveEntry={saveJournalEntry}
        onToggleSavedPrompt={toggleSavedPrompt}
      />
      
      <JournalEntriesList journalEntries={journalEntries} />
    </div>
  );
};

export default JournalPage;
