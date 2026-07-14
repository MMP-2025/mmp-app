
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare, BookOpen, Share2, CheckCircle2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import ShareJournalDialog from './ShareJournalDialog';
import { useToastService } from '@/hooks/useToastService';

interface JournalEntry {
  id: string;
  content: string;
  date: Date;
  hasPrompt: boolean;
  prompt?: string;
  wordCount: number;
  sharedWithProvider: boolean;
  sharedAt?: Date;
}

interface JournalEntriesListProps {
  journalEntries: JournalEntry[];
  onShareEntry?: (entryId: string) => Promise<void>;
}

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({ journalEntries, onShareEntry }) => {
  const [pendingShareId, setPendingShareId] = React.useState<string | null>(null);
  const [isSharing, setIsSharing] = React.useState(false);
  const { showSuccess, showWarning } = useToastService();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatShortDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);

  const handleConfirmShare = async () => {
    if (!pendingShareId || !onShareEntry) return;
    setIsSharing(true);
    try {
      await onShareEntry(pendingShareId);
      showSuccess('Journal entry shared with your therapist');
      setPendingShareId(null);
    } catch (err: any) {
      showWarning(err?.message || 'Could not share entry. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <h2 className="text-base font-semibold mb-4 text-foreground flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        Recent Entries
      </h2>
      
      {journalEntries.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-sage-light flex items-center justify-center mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Your journal entries will appear here</p>
          <p className="text-xs text-muted-foreground mt-1">Start writing to see your reflections grow</p>
        </div>
      ) : (
        <div className="space-y-3">
          {journalEntries.map((entry, i) => (
            <div
              key={entry.id}
              className="opacity-0 animate-fade-in-up border border-border rounded-xl p-4 hover:shadow-card transition-shadow"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                <div className="flex items-center gap-2">
                  {entry.hasPrompt && (
                    <div className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      <MessageSquare className="h-3 w-3" />
                      <span>Prompted</span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">{entry.wordCount} words</span>
                </div>
              </div>
              
              {entry.hasPrompt && entry.prompt && (
                <p className="text-sm italic mb-2 text-muted-foreground">
                  Prompt: {entry.prompt}
                </p>
              )}
              
              <p className="whitespace-pre-wrap text-sm text-foreground/80 leading-relaxed">{entry.content}</p>

              {onShareEntry && (
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
                  {entry.sharedWithProvider ? (
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        Shared with Therapist
                        {entry.sharedAt ? ` · ${formatShortDate(entry.sharedAt)}` : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Private to you</span>
                  )}
                  {!entry.sharedWithProvider && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingShareId(entry.id)}
                      className="text-xs"
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      Share with Therapist
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ShareJournalDialog
        open={!!pendingShareId}
        onOpenChange={(open) => !open && setPendingShareId(null)}
        onConfirm={handleConfirmShare}
        isSharing={isSharing}
      />
    </Card>
  );
};

export default JournalEntriesList;
