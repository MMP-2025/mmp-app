import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserMinus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EndRelationshipButtonProps {
  patientId: string;
  label?: string;
  onEnded?: () => void;
}

const EndRelationshipButton: React.FC<EndRelationshipButtonProps> = ({
  patientId,
  label,
  onEnded,
}) => {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleEnd = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const { data: rel, error: relError } = await supabase
        .from('patient_provider_relationships')
        .select('id')
        .eq('provider_id', user.id)
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .maybeSingle();

      if (relError) throw relError;
      if (!rel) {
        toast.error('No active connection found.');
        return;
      }

      const { data, error } = await supabase.rpc('end_provider_relationship', {
        p_relationship_id: rel.id,
      });

      if (error) throw error;

      const result = data as { success?: boolean; error?: string } | null;
      if (!result?.success) {
        toast.error('Unable to end this connection.');
        return;
      }

      toast.success('Care connection ended.');
      onEnded?.();
    } catch (e) {
      console.error('Error ending relationship:', e);
      toast.error('Unable to end this connection.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={busy} className="gap-2">
          <UserMinus className="h-4 w-4" />
          End care connection
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            End connection with Patient {label || ''}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This ends the care connection. You will no longer have access to
            anything this patient has shared with you. This cannot be undone
            from here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEnd} disabled={busy}>
            End connection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EndRelationshipButton;
