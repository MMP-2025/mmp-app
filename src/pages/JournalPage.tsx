
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/components/ui/sonner";
import { Edit, Quote, MessageSquare, BookmarkPlus, BookmarkCheck } from "lucide-react";

// Sample journal prompts - in a real app, these would come from your content management system
const journalPrompts = ["What are three things you're grateful for today?", "Describe a challenge you're facing and three potential ways to overcome it.", "What would you tell your younger self if you could send a message back in time?", "Write about something that made you smile today.", "What are your top priorities right now and why?", "Describe your ideal day. What would you do? How would you feel?", "What's something you're proud of that you haven't given yourself credit for?", "What boundaries do you need to set or maintain in your life?", "Describe a recent accomplishment and what you learned from it.", "What self-care activities help you feel most restored?", "Write about an emotion you've been experiencing lately and explore its roots."];

const JournalPage = () => {
  const [journalContent, setJournalContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [journalEntries, setJournalEntries] = useState<{
    id: number;
    content: string;
    date: Date;
    hasPrompt: boolean;
    prompt?: string;
  }[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');

  const toggleSavedPrompt = (prompt: string) => {
    setSavedPrompts(prev => {
      const isCurrentlySaved = prev.includes(prompt);
      if (isCurrentlySaved) {
        toast.success('Prompt removed from saved');
        return prev.filter(p => p !== prompt);
      } else {
        toast.success('Prompt saved!');
        return [...prev, prompt];
      }
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
    toast.info("New prompt loaded. Happy writing!");
  };

  const startFreeWriting = () => {
    setCurrentPrompt('');
    setJournalContent(''); // Clear any existing content
    toast.info("Ready for free writing. Express yourself!");
  };

  const saveJournalEntry = () => {
    if (!journalContent.trim()) {
      toast.warning("Please write something before saving");
      return;
    }
    const newEntry = {
      id: Date.now(),
      content: journalContent,
      date: new Date(),
      hasPrompt: !!currentPrompt,
      prompt: currentPrompt || undefined
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalContent('');
    setCurrentPrompt('');
    toast.success("Journal entry saved");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#7e868b]">Journal</h1>
        <p className="text-[#7e868b]">Express your thoughts and feelings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={currentView === 'all' ? 'default' : 'outline'}
          onClick={() => setCurrentView('all')}
          className="bg-mental-blue hover:bg-mental-blue/80"
        >
          All Prompts
        </Button>
        <Button
          variant={currentView === 'saved' ? 'default' : 'outline'}
          onClick={() => setCurrentView('saved')}
          className="bg-mental-green hover:bg-mental-green/80"
        >
          Saved Prompts ({savedPrompts.length})
        </Button>
      </div>
      
      <Card className="p-6 bg-mental-beige/20">
        <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">New Entry</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button onClick={getRandomPrompt} className="bg-mental-blue hover:bg-mental-blue/80 flex items-center gap-2">
            <Quote className="h-4 w-4 text-[#7e868b]" />
            Get Writing Prompt
          </Button>
          <Button onClick={startFreeWriting} className="bg-mental-green hover:bg-mental-green/80 flex items-center gap-2">
            <Edit className="h-4 w-4 text-[#7e868b]" />
            Free Writing
          </Button>
        </div>
        
        {currentPrompt && <div className="bg-mental-blue/10 p-4 rounded-md mb-4">
            <div className="flex justify-between items-start">
              <p className="font-medium text-[#7e868b] flex-1">Prompt: {currentPrompt}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSavedPrompt(currentPrompt)}
                className="p-1 ml-2"
              >
                {savedPrompts.includes(currentPrompt) ? (
                  <BookmarkCheck className="h-5 w-5 text-blue-600" />
                ) : (
                  <BookmarkPlus className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            </div>
          </div>}
        
        <Textarea placeholder={currentPrompt ? "Write your thoughts about this prompt..." : "Write freely..."} value={journalContent} onChange={e => setJournalContent(e.target.value)} className="min-h-[200px] mb-4" />
        
        <Button onClick={saveJournalEntry} className="w-full bg-mental-green hover:bg-mental-green/80">
          Save Journal Entry
        </Button>
      </Card>

      {/* Browse Prompts Section */}
      {currentView === 'saved' && savedPrompts.length === 0 ? (
        <Card className="p-8 bg-mental-beige/20 text-center">
          <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-mental-beige" />
          <h3 className="text-xl font-semibold mb-2 text-[#7e868b]">No Saved Prompts</h3>
          <p className="text-[#7e868b] mb-4">
            You haven't saved any prompts yet. Browse all prompts and save your favorites!
          </p>
          <Button 
            onClick={() => setCurrentView('all')} 
            className="bg-mental-blue hover:bg-mental-blue/80"
          >
            Browse All Prompts
          </Button>
        </Card>
      ) : (
        <Card className="p-6 bg-mental-green">
          <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">
            {currentView === 'all' ? 'All Writing Prompts' : 'Your Saved Prompts'}
          </h2>
          <div className="grid gap-3">
            {getDisplayedPrompts().map((prompt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-md">
                <p className="text-[#7e868b] flex-1">{prompt}</p>
                <div className="flex gap-2 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSavedPrompt(prompt)}
                    className="p-1"
                  >
                    {savedPrompts.includes(prompt) ? (
                      <BookmarkCheck className="h-5 w-5 text-blue-600" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPrompt(prompt);
                      setJournalContent('');
                      toast.info("Prompt selected. Start writing!");
                    }}
                    className="text-[#7e868b]"
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      <Card className="p-6 bg-mental-green">
        <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Recent Entries</h2>
        
        {journalEntries.length === 0 ? <p className="text-center text-[#7e868b]">Your journal entries will appear here</p> : <div className="space-y-4">
            {journalEntries.map(entry => <div key={entry.id} className="border border-mental-gray/20 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-[#7e868b]">{formatDate(entry.date)}</p>
                  {entry.hasPrompt && <div className="flex items-center gap-1 text-xs text-mental-blue bg-mental-blue/10 px-2 py-1 rounded-full">
                      <MessageSquare className="h-3 w-3 text-[#7e868b]" />
                      <span>Prompted</span>
                    </div>}
                </div>
                
                {entry.hasPrompt && entry.prompt && <p className="text-sm italic mb-2 text-[#7e868b]">
                    Prompt: {entry.prompt}
                  </p>}
                
                <p className="whitespace-pre-wrap text-[#7e868b]">{entry.content}</p>
              </div>)}
          </div>}
      </Card>
    </div>;
};

export default JournalPage;
