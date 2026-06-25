import React, { useEffect, useState } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AuditLogTab from '@/components/provider/tabs/AuditLogTab';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Patient-facing view of `phi_audit_log` — shows the user when their own
 * data was created, updated, or deleted, and by whom (themself vs. provider).
 * RLS already restricts visibility to rows where `patient_id = auth.uid()`.
 */
const MyAccessLogCard: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role === 'guest') return;
    (async () => {
      const { count: c } = await supabase
        .from('phi_audit_log')
        .select('id', { count: 'exact', head: true });
      setCount(c ?? 0);
    })();
  }, [user]);

  if (!user || user.role === 'guest') return null;

  return (
    <div className="p-5 rounded-xl border bg-card shadow-card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Who's accessed my data
          </h3>
          <p className="text-sm text-muted-foreground">
            {count === null
              ? 'Loading access history…'
              : count === 0
              ? 'No changes have been made to your data yet.'
              : `${count} change${count === 1 ? '' : 's'} recorded.`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="gap-1">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {open ? 'Hide' : 'View'}
        </Button>
      </div>
      {open && (
        <div className="pt-2 border-t">
          <AuditLogTab scope="patient" />
        </div>
      )}
    </div>
  );
};

export default MyAccessLogCard;