
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToastService } from '@/hooks/useToastService';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalPromptData } from '@/hooks/useJournalPromptData';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalEntriesList from '@/components/journal/JournalEntriesList';
import GuestSavePrompt from '@/components/auth/GuestSavePrompt';
import { PageTransition } from '@/components/ui/animated';


const JournalPage = () => {
  const [journalContent, setJournalContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  
  const { isGuest } = useAuth();
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

    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    
    try {
      const wordCount = journalContent.trim().split(/\s+/).length;
      await saveEntry(journalContent, currentPrompt);
      trackJournalEntry(!!currentPrompt, wordCount);
      
      setJournalContent('');
      setCurrentPrompt('');
      showSuccess("Journal entry saved");
    } catch (error: any) {
      showWarning(error.message || "Failed to save journal entry");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <h1 className="mb-1 text-foreground">Journal</h1>
          <p className="text-sm text-muted-foreground">Express your thoughts and feelings</p>
        </div>
        
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
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
        </div>
        
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <JournalEntriesList journalEntries={journalEntries} />
        </div>
        
        <GuestSavePrompt 
          isOpen={showGuestPrompt}
          onClose={() => setShowGuestPrompt(false)}
          featureName="journal entries"
        />
      </div>
    </PageTransition>
  );
};

export default JournalPage;
