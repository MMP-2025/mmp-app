
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { useAnalytics } from '@/hooks/useAnalytics';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalPromptBrowser from '@/components/journal/JournalPromptBrowser';
import JournalEntriesList from '@/components/journal/JournalEntriesList';

interface JournalEntry {
  id: number;
  content: string;
  date: Date;
  hasPrompt: boolean;
  prompt?: string;
  wordCount: number;
}

// Sample journal prompts - in a real app, these would come from your content management system
const journalPrompts = ["What are three things you're grateful for today?", "Describe a challenge you're facing and three potential ways to overcome it.", "What would you tell your younger self if you could send a message back in time?", "Write about something that made you smile today.", "What are your top priorities right now and why?", "Describe your ideal day. What would you do? How would you feel?", "What's something you're proud of that you haven't given yourself credit for?", "What boundaries do you need to set or maintain in your life?", "Describe a recent accomplishment and what you learned from it.", "What self-care activities help you feel most restored?", "Write about an emotion you've been experiencing lately and explore its roots."];

const JournalPage = () => {
  const [journalContent, setJournalContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');
  const { trackJournalEntry, trackAction } = useAnalytics();

  useEffect(() => {
    // Load data from storage
    const savedEntries = StorageManager.load<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
    const savedPromptsData = StorageManager.load<string[]>(STORAGE_KEYS.SAVED_PROMPTS, []);
    
    // Convert date strings back to Date objects
    const entriesWithDates = savedEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }));
    
    setJournalEntries(entriesWithDates);
    setSavedPrompts(savedPromptsData);
  }, []);

  const toggleSavedPrompt = (prompt: string) => {
    setSavedPrompts(prev => {
      const isCurrentlySaved = prev.includes(prompt);
      let newSavedPrompts;
      
      if (isCurrentlySaved) {
        toast.success('Prompt removed from saved');
        newSavedPrompts = prev.filter(p => p !== prompt);
      } else {
        toast.success('Prompt saved!');
        newSavedPrompts = [...prev, prompt];
      }
      
      StorageManager.save(STORAGE_KEYS.SAVED_PROMPTS, newSavedPrompts);
      trackAction('prompt_saved', { prompt, action: isCurrentlySaved ? 'removed' : 'added' });
      return newSavedPrompts;
    });
  };

  const getDisplayedPrompts = () => {
    if (currentView === 'saved') {
      return savedPrompts;
    }
    return journalPrompts;
  };

  const getRandomPrompt = () => {
    const displayedPrompts = getDisplayedPrompts();
    if (displayedPrompts.length === 0) {
      toast.warning("No prompts available in this view");
      return;
    }
    const randomIndex = Math.floor(Math.random() * displayedPrompts.length);
    setCurrentPrompt(displayedPrompts[randomIndex]);
    setJournalContent(''); // Clear any existing content
    trackAction('random_prompt_selected', { prompt: displayedPrompts[randomIndex] });
    toast.info("New prompt loaded. Happy writing!");
  };

  const startFreeWriting = () => {
    setCurrentPrompt('');
    setJournalContent(''); // Clear any existing content
    trackAction('free_writing_started');
    toast.info("Ready for free writing. Express yourself!");
  };

  const saveJournalEntry = () => {
    if (!journalContent.trim()) {
      toast.warning("Please write something before saving");
      return;
    }
    
    const wordCount = journalContent.trim().split(/\s+/).length;
    const newEntry: JournalEntry = {
      id: Date.now(),
      content: journalContent,
      date: new Date(),
      hasPrompt: !!currentPrompt,
      prompt: currentPrompt || undefined,
      wordCount
    };
    
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    StorageManager.save(STORAGE_KEYS.JOURNAL_ENTRIES, updatedEntries);
    
    // Track analytics
    trackJournalEntry(!!currentPrompt, wordCount);
    
    setJournalContent('');
    setCurrentPrompt('');
    toast.success("Journal entry saved");
  };

  const selectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
    setJournalContent('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#7e868b]">Journal</h1>
        <p className="text-[#7e868b]">Express your thoughts and feelings</p>
      </div>

      <JournalPromptBrowser
        currentView={currentView}
        setCurrentView={setCurrentView}
        savedPrompts={savedPrompts}
        allPrompts={journalPrompts}
        onToggleSavedPrompt={toggleSavedPrompt}
        onSelectPrompt={selectPrompt}
      />
      
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
