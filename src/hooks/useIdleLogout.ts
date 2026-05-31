import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * HIPAA-style idle timeout. Signs the user out after `timeoutMs` of no
 * keyboard/mouse/touch activity. Intended for provider sessions, which
 * may have PHI on-screen.
 */
export function useIdleLogout(enabled: boolean, timeoutMs = 30 * 60 * 1000) {
  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout>;

    const signOut = async () => {
      try {
        await supabase.auth.signOut();
        toast.message('You have been signed out due to inactivity.');
      } catch {
        // ignore — auth state listener will still react
      }
    };

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(signOut, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'visibilitychange'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, timeoutMs]);
}