import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Contact {
  name: string;
  phone: string;
  relationship?: string;
}

interface CrisisPlan {
  id: string;
  user_id: string;
  warning_signs: string[];
  coping_strategies: string[];
  reasons_to_live: string[];
  safe_environment?: string;
  support_contacts: Contact[];
  professional_contacts: Contact[];
  emergency_contacts: Contact[];
  created_at: string;
  updated_at: string;
}

export const useCrisisPlans = () => {
  const { user } = useAuth();
  const [crisisPlan, setCrisisPlan] = useState<CrisisPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCrisisPlan = async () => {
      const { data, error } = await supabase
        .from('crisis_plans')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching crisis plan:', error);
      } else if (data) {
        setCrisisPlan({
          ...data,
          support_contacts: (data.support_contacts as unknown) as Contact[],
          professional_contacts: (data.professional_contacts as unknown) as Contact[],
          emergency_contacts: (data.emergency_contacts as unknown) as Contact[]
        });
      }
      setLoading(false);
    };

    fetchCrisisPlan();
  }, [user]);

  const saveCrisisPlan = useCallback(async (planData: Omit<CrisisPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to save your crisis plan');
      return;
    }

    // Check if plan exists, then update or insert
    const { data: existing } = await supabase
      .from('crisis_plans')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let data, error;
    if (existing) {
      const result = await supabase
        .from('crisis_plans')
        .update({
          ...planData,
          support_contacts: planData.support_contacts as any,
          professional_contacts: planData.professional_contacts as any,
          emergency_contacts: planData.emergency_contacts as any
        })
        .eq('user_id', user.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('crisis_plans')
        .insert({
          user_id: user.id,
          ...planData,
          support_contacts: planData.support_contacts as any,
          professional_contacts: planData.professional_contacts as any,
          emergency_contacts: planData.emergency_contacts as any
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error saving crisis plan:', error);
      toast.error('Failed to save crisis plan');
      return;
    }

    if (data) {
      setCrisisPlan({
        ...data,
        support_contacts: (data.support_contacts as unknown) as Contact[],
        professional_contacts: (data.professional_contacts as unknown) as Contact[],
        emergency_contacts: (data.emergency_contacts as unknown) as Contact[]
      });
      toast.success('Crisis plan saved successfully');
    }
  }, [user]);

  const deleteCrisisPlan = useCallback(async () => {
    if (!user || !crisisPlan) return;

    const { error } = await supabase
      .from('crisis_plans')
      .delete()
      .eq('id', crisisPlan.id);

    if (error) {
      console.error('Error deleting crisis plan:', error);
      toast.error('Failed to delete crisis plan');
      return;
    }

    setCrisisPlan(null);
    toast.success('Crisis plan deleted');
  }, [user, crisisPlan]);

  return {
    crisisPlan,
    loading,
    saveCrisisPlan,
    deleteCrisisPlan
  };
};
