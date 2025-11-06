
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare } from "lucide-react";

interface JournalEntry {
  id: string;
  content: string;
  date: Date;
  hasPrompt: boolean;
  prompt?: string;
  wordCount: number;
}

interface JournalEntriesListProps {
  journalEntries: JournalEntry[];
}

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({ journalEntries }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="p-6 bg-mental-green">
      <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Recent Entries</h2>
      
      {journalEntries.length === 0 ? (
        <p className="text-center text-[#7e868b]">Your journal entries will appear here</p>
      ) : (
        <div className="space-y-4">
          {journalEntries.map(entry => (
            <div key={entry.id} className="border border-mental-gray/20 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-[#7e868b]">{formatDate(entry.date)}</p>
                <div className="flex items-center gap-2">
                  {entry.hasPrompt && (
                    <div className="flex items-center gap-1 text-xs text-mental-blue bg-mental-blue/10 px-2 py-1 rounded-full">
                      <MessageSquare className="h-3 w-3 text-[#7e868b]" />
                      <span>Prompted</span>
                    </div>
                  )}
                  <span className="text-xs text-[#7e868b]">{entry.wordCount} words</span>
                </div>
              </div>
              
              {entry.hasPrompt && entry.prompt && (
                <p className="text-sm italic mb-2 text-[#7e868b]">
                  Prompt: {entry.prompt}
                </p>
              )}
              
              <p className="whitespace-pre-wrap text-[#7e868b]">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default JournalEntriesList;
