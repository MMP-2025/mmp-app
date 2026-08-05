import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MissingConsent {
  consent_type: string;
  policy_version: string;
  title: string;
  route: string;
}

/**
 * Server-authoritative check for outstanding legal acknowledgements.
 * The list of required documents and their current versions lives in the
 * database (`required_consents`); the client only renders what it is told.
 */
export const useRequiredConsents = (enabled: boolean) => {
  const [missing, setMissing] = useState<MissingConsent[]>([]);
  const [loading, setLoading] = useState(enabled);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setMissing([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc('missing_consents');
    if (error) {
      console.error('Error checking required consents:', error);
      setMissing([]);
    } else {
      setMissing((data ?? []) as MissingConsent[]);
    }
    setLoading(false);
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const accept = useCallback(
    async (consentTypes: string[]) => {
      const { error } = await supabase.functions.invoke('record-consent', {
        body: { consent_types: consentTypes },
      });
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  return { missing, loading, refresh, accept };
};