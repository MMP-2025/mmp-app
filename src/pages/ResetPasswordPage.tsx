import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrength } from '@/components/auth/PasswordStrength';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only allow a password change from a genuine recovery session: the
    // signed access token's `amr` claim must include method "recovery"
    // (issued only via the emailed reset link), used within 1 hour.
    const isRecoverySession = (accessToken?: string) => {
      if (!accessToken) return false;
      try {
        const payload = JSON.parse(
          atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        const amr: Array<{ method?: string; timestamp?: number }> = payload.amr || [];
        const now = Math.floor(Date.now() / 1000);
        return amr.some(
          (m) => m.method === 'recovery' && typeof m.timestamp === 'number' && now - m.timestamp < 3600
        );
      } catch {
        return false;
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(isRecoverySession(session?.access_token));
      } else if (event === 'SIGNED_OUT') {
        setReady(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setReady(isRecoverySession(data.session?.access_token));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' });
      await supabase.auth.signOut();
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Could not reset password', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-light via-background to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-merriweather">Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-sm text-muted-foreground">
              This link is invalid or has expired. Please request a new password reset email from the sign-in screen.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  placeholder="Min. 8 characters"
                />
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordPage;
