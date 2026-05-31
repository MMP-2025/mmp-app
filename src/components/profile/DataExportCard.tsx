import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// PHI tables a patient owns. Used for HIPAA right-to-access export.
const EXPORT_TABLES = [
  'mood_entries',
  'journal_entries',
  'cbt_sessions',
  'crisis_plans',
  'exposure_goals',
  'exposure_sessions',
  'mindfulness_sessions',
  'progress_photos',
  'wellness_score_history',
  'habit_logs',
  'gratitude_entries',
  'goals',
  'user_reminders',
  'user_onboarding',
] as const;

const DataExportCard: React.FC = () => {
  const { user, logout } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    if (!user || user.role === 'guest') return;
    setExporting(true);
    try {
      const bundle: Record<string, unknown> = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email, name: user.name },
      };
      for (const t of EXPORT_TABLES) {
        const { data, error } = await supabase
          .from(t as any)
          .select('*')
          .eq('user_id', user.id);
        if (error) {
          console.warn(`Export skipped ${t}:`, error.message);
          bundle[t] = { error: error.message };
        } else {
          bundle[t] = data ?? [];
        }
      }
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Your data has been downloaded.');
    } catch (e: any) {
      toast.error('Export failed: ' + (e?.message ?? 'unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.role === 'guest') return;
    const confirmed = window.confirm(
      'This will permanently delete your account and all your data. This cannot be undone. Continue?'
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      toast.success('Your account has been deleted.');
      await logout();
    } catch (e: any) {
      toast.error('Delete failed: ' + (e?.message ?? 'unknown error'));
      setDeleting(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border bg-card shadow-card space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">Your data, your rights</h3>
        <p className="text-sm text-muted-foreground">
          You can download a copy of everything you've recorded, or permanently delete your account and all associated data.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleExport} disabled={exporting} className="gap-2">
          <Download className="h-4 w-4" />
          {exporting ? 'Preparing…' : 'Download my data'}
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-2">
          <Trash2 className="h-4 w-4" />
          {deleting ? 'Deleting…' : 'Delete my account'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
        Deletion is immediate and irreversible. Your provider will no longer be able to view your past responses.
      </p>
    </div>
  );
};

export default DataExportCard;