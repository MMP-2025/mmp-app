import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Patient {
  id: string;
  name: string;
  email: string;
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
        // Get all active patient relationships for this provider
        const { data: relationships, error: relError } = await supabase
          .from('patient_provider_relationships')
          .select('patient_id')
          .eq('provider_id', user.id)
          .eq('status', 'active');

        if (relError) throw relError;

        if (!relationships || relationships.length === 0) {
          setPatients([]);
          setLoading(false);
          return;
        }

        // Get profile details for each patient
        const patientIds = relationships.map(r => r.patient_id);
        const { data: profiles, error: profError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', patientIds);

        if (profError) throw profError;

        setPatients(profiles || []);
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
