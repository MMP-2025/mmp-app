
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { useToastService } from '@/hooks/useToastService';

interface JournalPromptBrowserProps {
  currentView: 'all' | 'saved';
  setCurrentView: (view: 'all' | 'saved') => void;
  savedPrompts: string[];
  allPrompts: string[];
  onToggleSavedPrompt: (prompt: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

const JournalPromptBrowser: React.FC<JournalPromptBrowserProps> = ({
  currentView,
  setCurrentView,
  savedPrompts,
  allPrompts,
  onToggleSavedPrompt,
  onSelectPrompt
}) => {
  const { showInfo } = useToastService();

  const getDisplayedPrompts = () => {
    if (currentView === 'saved') {
      return savedPrompts;
    }
    return allPrompts;
  };

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt);
    showInfo("Prompt selected. Start writing!");
  };

  return (
    <>
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={currentView === 'all' ? 'default' : 'outline'}
          onClick={() => setCurrentView('all')}
          className={currentView === 'all' ? 'bg-mental-blue hover:bg-mental-blue/80' : ''}
        >
          All Prompts
        </Button>
        <Button
          variant={currentView === 'saved' ? 'default' : 'outline'}
          onClick={() => setCurrentView('saved')}
          className={currentView === 'saved' ? 'bg-mental-green hover:bg-mental-green/80' : ''}
        >
          Saved Prompts ({savedPrompts.length})
        </Button>
      </div>

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
                    onClick={() => onToggleSavedPrompt(prompt)}
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
                    onClick={() => handleSelectPrompt(prompt)}
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
    </>
  );
};

export default JournalPromptBrowser;
