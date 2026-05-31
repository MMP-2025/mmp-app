import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  occurred_at: string;
  action: string;
  table_name: string;
  actor_id: string | null;
  actor_role: string | null;
  patient_id: string | null;
  row_id: string | null;
}

const AuditLogTab: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('phi_audit_log')
        .select('id, occurred_at, action, table_name, actor_id, actor_role, patient_id, row_id')
        .order('occurred_at', { ascending: false })
        .limit(200);
      if (error) {
        toast.error('Failed to load audit log: ' + error.message);
      } else {
        setEntries((data as AuditEntry[]) ?? []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading audit trail..." />;

  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>No PHI access events recorded yet for your patients.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Showing the 200 most recent PHI changes for your patients. All inserts, updates, and deletes are recorded.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-2 font-medium">When</th>
              <th className="p-2 font-medium">Action</th>
              <th className="p-2 font-medium">Table</th>
              <th className="p-2 font-medium">Actor role</th>
              <th className="p-2 font-medium">Patient</th>
              <th className="p-2 font-medium">Row</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{new Date(e.occurred_at).toLocaleString()}</td>
                <td className="p-2">{e.action}</td>
                <td className="p-2">{e.table_name}</td>
                <td className="p-2">{e.actor_role ?? '—'}</td>
                <td className="p-2 font-mono text-xs">{e.patient_id?.slice(0, 8) ?? '—'}</td>
                <td className="p-2 font-mono text-xs">{e.row_id?.slice(0, 8) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTab;