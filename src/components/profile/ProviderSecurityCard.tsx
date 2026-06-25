import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Provider-only security panel: shows MFA status and lets the provider
 * reset their authenticator without going through the "lost access" path.
 */
const ProviderSecurityCard: React.FC = () => {
  const { user, logout } = useAuth();
  const [hasMfa, setHasMfa] = useState<boolean | null>(null);
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.mfa.listFactors();
        const verified = data?.totp?.some((f) => f.status === 'verified');
        setHasMfa(!!verified);
      } catch {
        setHasMfa(false);
      }
    })();
  }, []);

  const handleReset = async () => {
    if (!user?.email || !pwd) return;
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke('reset-provider-mfa', {
        body: { email: user.email, password: pwd },
      });
      if (error) throw error;
      toast.success('Two-factor auth reset. Sign in again to set up a new authenticator.');
      setPwd('');
      setOpen(false);
      await logout();
    } catch (e: any) {
      toast.error('Reset failed: ' + (e?.message ?? 'unknown error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border bg-card shadow-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            Two-factor authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            Provider accounts require an authenticator app. You'll be prompted for a 6-digit code on every sign-in.
          </p>
        </div>
        {hasMfa === null ? (
          <Badge variant="outline">Checking…</Badge>
        ) : hasMfa ? (
          <Badge className="bg-mental-green text-foreground border-transparent gap-1">
            <ShieldCheck className="h-3 w-3" /> Active
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <ShieldAlert className="h-3 w-3" /> Not set up
          </Badge>
        )}
      </div>

      {hasMfa && (
        <AlertDialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setPwd(''); }}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">Reset authenticator</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset two-factor auth?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll be signed out and asked to enroll a new authenticator app on your next sign-in. Re-enter your password to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="sec-pwd">Password</Label>
              <Input
                id="sec-pwd"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                disabled={!pwd || busy}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {busy ? 'Resetting…' : 'Reset & sign out'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ProviderSecurityCard;