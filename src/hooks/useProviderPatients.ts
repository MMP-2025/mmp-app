import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Patient {
  id: string;
  name: string;
}

export function useProviderPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isProvider } = useAuth();

  useEffect(() => {
    if (!user || !isProvider) {
      setPatients([]);
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      setLoading(true);
      try {
        // Audited, provider-only read (logs to phi_audit_log server-side)
        const { data, error } = await (supabase.rpc as any)('get_my_patients');

        if (error) throw error;

        setPatients((data as Patient[]) || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, isProvider]);

  return { patients, loading };
}
