import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * HIPAA-style idle timeout. Signs the user out after `timeoutMs` of no
 * keyboard/mouse/touch activity. Intended for provider sessions, which
 * may have PHI on-screen.
 *
 * Surfaces a warning toast `warnMs` before sign-out so the user can stay
 * signed in without losing unsaved work.
 */
export function useIdleLogout(
  enabled: boolean,
  timeoutMs = 30 * 60 * 1000,
  warnMs = 60 * 1000,
) {
  useEffect(() => {
    if (!enabled) return;

    let signOutTimer: ReturnType<typeof setTimeout>;
    let warnTimer: ReturnType<typeof setTimeout>;
    let warnedAt = 0;

    const signOut = async () => {
      try {
        await supabase.auth.signOut();
        toast.message('You have been signed out due to inactivity.');
      } catch {
        // ignore — auth state listener will still react
      }
    };

    const reset = () => {
      // If a warning is currently visible, ignore activity that happens
      // within ~1s of showing it (avoids the toast itself dismissing it).
      if (warnedAt && Date.now() - warnedAt < 1000) return;
      warnedAt = 0;
      clearTimeout(signOutTimer);
      clearTimeout(warnTimer);
      warnTimer = setTimeout(() => {
        warnedAt = Date.now();
        toast.warning("You'll be signed out soon for inactivity.", {
          description: 'Move your mouse or press a key to stay signed in.',
          duration: warnMs,
          action: { label: 'Stay signed in', onClick: () => reset() },
        });
      }, Math.max(0, timeoutMs - warnMs));
      signOutTimer = setTimeout(signOut, timeoutMs);
    };

    const windowEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    windowEvents.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    // visibilitychange only fires on `document`, not window.
    document.addEventListener('visibilitychange', reset);
    reset();

    return () => {
      clearTimeout(signOutTimer);
      clearTimeout(warnTimer);
      windowEvents.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener('visibilitychange', reset);
    };
  }, [enabled, timeoutMs, warnMs]);
}