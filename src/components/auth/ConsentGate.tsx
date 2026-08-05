import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRequiredConsents } from '@/hooks/useRequiredConsents';

interface Props {
  children: React.ReactNode;
}

const ACKNOWLEDGEMENT_LABELS: Record<string, string> = {
  terms_of_service: 'I agree to the',
  privacy_policy: 'I acknowledge that I have read the',
  notice_of_privacy_practices: 'I acknowledge that I have received the',
};

/**
 * Blocks the authenticated app until every currently required legal document
 * has been acknowledged. The set of outstanding documents is decided by the
 * database, so consent cannot be bypassed from the client.
 */
const ConsentGate: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  const { toast } = useToast();
  const enabled = isAuthenticated && !isGuest;
  const { missing, loading, accept } = useRequiredConsents(enabled);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!enabled || loading || missing.length === 0) {
    return <>{children}</>;
  }

  const allChecked = missing.every((m) => checked[m.consent_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) return;
    setSubmitting(true);
    try {
      await accept(missing.map((m) => m.consent_type));
      toast({ title: 'Thank you', description: 'Your acknowledgements have been recorded.' });
    } catch (error: any) {
      toast({
        title: 'Could not record your acknowledgement',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Before you continue</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review and acknowledge the following documents. You can open each one in a new tab —
            your place here is saved.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="consent-gate-heading">
            <h2 id="consent-gate-heading" className="sr-only">
              Required legal acknowledgements
            </h2>
            <div className="space-y-3 rounded-lg border border-border bg-accent/30 p-3">
              {missing.map((doc) => (
                <div key={doc.consent_type} className="flex items-start gap-2">
                  <Checkbox
                    id={`gate-${doc.consent_type}`}
                    checked={!!checked[doc.consent_type]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [doc.consent_type]: v === true }))
                    }
                    aria-required="true"
                    className="mt-0.5 min-h-5 min-w-5"
                  />
                  <Label
                    htmlFor={`gate-${doc.consent_type}`}
                    className="text-sm font-normal leading-relaxed text-foreground cursor-pointer"
                  >
                    {ACKNOWLEDGEMENT_LABELS[doc.consent_type] ?? 'I acknowledge the'}{' '}
                    <a
                      href={doc.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {doc.title}
                    </a>
                    .
                  </Label>
                </div>
              ))}
            </div>
            <Button type="submit" disabled={!allChecked || submitting} className="w-full h-11 rounded-xl">
              {submitting ? 'Saving…' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentGate;