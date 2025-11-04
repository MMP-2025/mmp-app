import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingPreferences {
  goals?: string[];
  completedSteps?: string[];
}

export const useOnboarding = () => {
  const { user, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<OnboardingPreferences>({});

  useEffect(() => {
    if (isGuest || !user) {
      setIsLoading(false);
      return;
    }

    fetchOnboardingStatus();
  }, [user, isGuest]);

  const fetchOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding status:', error);
        return;
      }

      if (data) {
        setHasCompletedOnboarding(data.onboarding_completed);
        setCurrentStep(data.current_step);
        setPreferences(data.preferences as OnboardingPreferences || {});
      }
    } catch (error) {
      console.error('Error in fetchOnboardingStatus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOnboardingStep = async (step: string) => {
    if (!user || isGuest) return;

    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert([{
          user_id: user.id,
          current_step: step,
          onboarding_completed: false,
        }]);

      if (error) throw error;
      setCurrentStep(step);
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    }
  };

  const completeOnboarding = async (finalPreferences?: OnboardingPreferences) => {
    if (!user || isGuest) return;

    try {
      const prefsToSave = finalPreferences || preferences;
      const { error } = await supabase
        .from('user_onboarding')
        .upsert([{
          user_id: user.id,
          onboarding_completed: true,
          completed_at: new Date().toISOString(),
          current_step: 'completed',
          preferences: prefsToSave as any,
        }]);

      if (error) throw error;
      setHasCompletedOnboarding(true);
      setPreferences(finalPreferences || preferences);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const updatePreferences = (newPreferences: Partial<OnboardingPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return {
    isLoading,
    hasCompletedOnboarding,
    currentStep,
    preferences,
    updateOnboardingStep,
    completeOnboarding,
    updatePreferences,
    shouldShowOnboarding: !isLoading && !isGuest && !hasCompletedOnboarding && user,
  };
};
