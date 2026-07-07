import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, ShieldAlert, KeyRound, Loader2 } from 'lucide-react';

type Phase = 'loading' | 'ready' | 'enroll' | 'challenge' | 'recover';

interface EnrollData {
  factorId: string;
  qrSvg: string;
  secret: string;
  uri: string;
}

const ProviderMfaGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('loading');
  const [enroll, setEnroll] = useState<EnrollData | null>(null);
  const [challengeFactorId, setChallengeFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [recoverPwd, setRecoverPwd] = useState('');

  const evaluate = useCallback(async () => {
    setPhase('loading');
    try {
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const verified = factorsData?.totp?.find((f) => f.status === 'verified') ?? null;

      if (!verified) {
        // Need to enroll. Clean up any unverified factors first.
        const stale = factorsData?.totp?.find((f) => (f.status as string) === 'unverified');
        if (stale) await supabase.auth.mfa.unenroll({ factorId: stale.id });
        const { data: enrollData, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          friendlyName: `Provider TOTP ${Date.now()}`,
        });
        if (error) throw error;
        setEnroll({
          factorId: enrollData.id,
          qrSvg: enrollData.totp.qr_code,
          secret: enrollData.totp.secret,
          uri: enrollData.totp.uri,
        });
        setPhase('enroll');
        return;
      }

      if (aalData?.currentLevel === 'aal2') {
        setPhase('ready');
        return;
      }

      // Has factor but not yet challenged this session.
      setChallengeFactorId(verified.id);
      setPhase('challenge');
    } catch (e: any) {
      toast({ title: 'MFA check failed', description: e.message, variant: 'destructive' });
      setPhase('challenge');
    }
  }, [toast]);

  useEffect(() => {
    evaluate();
  }, [evaluate]);

  const verifyEnroll = async () => {
    if (!enroll) return;
    setBusy(true);
    try {
      const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: enroll.factorId });
      if (chErr) throw chErr;
      const { error } = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: ch.id,
        code: code.trim(),
      });
      if (error) throw error;
      toast({ title: 'MFA enabled', description: 'Two-factor authentication is now active.' });
      setCode('');
      setEnroll(null);
      await evaluate();
    } catch (e: any) {
      toast({ title: 'Verification failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const verifyChallenge = async () => {
    if (!challengeFactorId) return;
    setBusy(true);
    try {
      const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: challengeFactorId });
      if (chErr) throw chErr;
      const { error } = await supabase.auth.mfa.verify({
        factorId: challengeFactorId,
        challengeId: ch.id,
        code: code.trim(),
      });
      if (error) throw error;
      setCode('');
      await evaluate();
    } catch (e: any) {
      toast({ title: 'Invalid code', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const recover = async () => {
    if (!user?.email || !recoverPwd) return;
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke('reset-provider-mfa', {
        body: { email: user.email, password: recoverPwd },
      });
      if (error) throw error;
      toast({ title: 'MFA reset', description: 'Sign in again to set up a new authenticator.' });
      setRecoverPwd('');
      await logout();
    } catch (e: any) {
      toast({ title: 'Reset failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (phase === 'ready') return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-light via-background to-background p-4">
      <Card className="w-full max-w-md card-hero border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-merriweather">
            {phase === 'enroll' && <><ShieldCheck className="h-5 w-5 text-primary" /> Set up two-factor auth</>}
            {phase === 'challenge' && <><KeyRound className="h-5 w-5 text-primary" /> Verify it's you</>}
            {phase === 'recover' && <><ShieldAlert className="h-5 w-5 text-destructive" /> Reset two-factor auth</>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phase === 'enroll' && enroll && (
            <>
              <p className="text-sm text-muted-foreground">
                Provider accounts must use an authenticator app (Google Authenticator, 1Password, Authy, etc.).
                Scan the QR code, then enter the 6-digit code.
              </p>
              <div
                className="bg-white p-3 rounded-lg flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: enroll.qrSvg }}
              />
              <div className="text-xs text-muted-foreground break-all">
                Or enter this secret manually: <code className="font-mono">{enroll.secret}</code>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="enroll-code">6-digit code</Label>
                <Input
                  id="enroll-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                />
              </div>
              <Button onClick={verifyEnroll} disabled={busy || code.length !== 6} className="w-full rounded-xl h-11">
                {busy ? 'Verifying…' : 'Enable two-factor auth'}
              </Button>
              <Button variant="ghost" onClick={logout} className="w-full">Sign out</Button>
            </>
          )}

          {phase === 'challenge' && (
            <>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app to access the provider dashboard.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="ch-code">Authentication code</Label>
                <Input
                  id="ch-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                />
              </div>
              <Button onClick={verifyChallenge} disabled={busy || code.length !== 6} className="w-full rounded-xl h-11">
                {busy ? 'Verifying…' : 'Verify'}
              </Button>
              <button
                type="button"
                onClick={() => setPhase('recover')}
                className="w-full text-center text-sm text-primary hover:underline"
              >
                Lost access to your authenticator?
              </button>
              <Button variant="ghost" onClick={logout} className="w-full">Sign out</Button>
            </>
          )}

          {phase === 'recover' && (
            <>
              <p className="text-sm text-muted-foreground">
                Re-enter your password to reset two-factor auth. After reset, you'll be signed out and asked to enroll a new authenticator on next sign in.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="rec-pwd">Password</Label>
                <Input
                  id="rec-pwd"
                  type="password"
                  value={recoverPwd}
                  onChange={(e) => setRecoverPwd(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button onClick={recover} disabled={busy || !recoverPwd} className="w-full rounded-xl h-11" variant="destructive">
                {busy ? 'Resetting…' : 'Reset two-factor auth'}
              </Button>
              <Button variant="ghost" onClick={() => setPhase('challenge')} className="w-full">Back</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderMfaGate;