import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ShareJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSharing?: boolean;
}

const ShareJournalDialog: React.FC<ShareJournalDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isSharing,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share this journal entry?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                This journal entry will become available for your therapist to review as part
                of your work together.
              </p>
              <p>Only this journal entry will be shared. Future journal entries will remain private unless you choose to share them individually.</p>
              <p className="text-foreground font-medium">
                Once you share this journal entry, it cannot be unshared. Please only share
                entries you are comfortable discussing in therapy.
              </p>
              <p>
                Sharing an entry does not mean your therapist will review or respond to it
                immediately. If you need immediate support, please contact your therapist
                directly or use emergency resources.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSharing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSharing}>
            {isSharing ? 'Sharing…' : 'Share'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareJournalDialog;