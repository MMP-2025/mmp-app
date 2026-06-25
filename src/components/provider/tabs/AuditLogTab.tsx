import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  metadata: any;
}

interface AuditLogTabProps {
  /** When 'patient', shows the viewer's own audit trail and hides the
   *  patient column. Defaults to provider view. */
  scope?: 'provider' | 'patient';
}

const actionVariant = (a: string): { label: string; className: string } => {
  switch (a) {
    case 'INSERT':
      return { label: 'Created', className: 'bg-mental-green text-foreground border-transparent' };
    case 'UPDATE':
      return { label: 'Updated', className: 'bg-mental-blue text-foreground border-transparent' };
    case 'DELETE':
      return { label: 'Deleted', className: 'bg-destructive/15 text-destructive border-transparent' };
    default:
      return { label: a, className: 'bg-muted text-foreground border-transparent' };
  }
};

const AuditLogTab: React.FC<AuditLogTabProps> = ({ scope = 'provider' }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('phi_audit_log')
        .select('id, occurred_at, action, table_name, actor_id, actor_role, patient_id, row_id, metadata')
        .order('occurred_at', { ascending: false })
        .limit(scope === 'patient' ? 50 : 200);
      if (error) {
        toast.error('Failed to load audit log: ' + error.message);
      } else {
        setEntries((data as AuditEntry[]) ?? []);
      }
      setLoading(false);
    })();
  }, [scope]);

  if (loading) return <LoadingSpinner size="lg" text="Loading audit trail..." />;

  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>
          {scope === 'patient'
            ? 'No access to your data has been recorded yet.'
            : 'No PHI access events recorded yet for your patients.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {scope === 'patient'
          ? 'Most recent changes made to your data. Creates, updates, and deletes are all logged.'
          : 'Showing the 200 most recent PHI changes for your patients.'}
      </p>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>When</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>By</TableHead>
              {scope === 'provider' && <TableHead>Patient</TableHead>}
              <TableHead className="hidden md:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => {
              const v = actionVariant(e.action);
              const changed: string[] | undefined = e.metadata?.changed_columns;
              return (
                <TableRow key={e.id} className="even:bg-muted/20">
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(e.occurred_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={v.className}>{v.label}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.table_name}</TableCell>
                  <TableCell className="text-xs capitalize">{e.actor_role ?? '—'}</TableCell>
                  {scope === 'provider' && (
                    <TableCell className="font-mono text-xs">{e.patient_id?.slice(0, 8) ?? '—'}</TableCell>
                  )}
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {changed && changed.length > 0
                      ? changed.slice(0, 4).join(', ') + (changed.length > 4 ? '…' : '')
                      : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogTab;