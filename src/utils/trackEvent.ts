/**
 * Centralized event tracking helper.
 *
 * Beta-launch design goals:
 *  - Never block the UI if the analytics provider fails or isn't loaded.
 *  - Always include a stable user_id (or anonymous_id for guests).
 *  - Single drop-in spot to wire PostHog (or any provider) later
 *    without touching every call site.
 *
 * To wire PostHog later:
 *   1) `bun add posthog-js`
 *   2) Initialize in main.tsx with VITE_POSTHOG_KEY (publishable, OK in client)
 *   3) Replace the body of `dispatch()` below with `posthog.capture(name, props)`
 *      and `posthog.identify(userId)` in `identifyUser()`.
 */

import { analytics } from '@/utils/analytics';

export type AppEventName =
  | 'user_signed_up'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'onboarding_completed'
  | 'feature_used'
  | 'journal_entry_created'
  | 'mood_logged'
  | 'mindfulness_session_completed'
  | 'session_duration'
  | 'guest_upgrade_prompt_shown'
  | 'guest_session_started'
  | 'page_viewed';

type EventProps = Record<string, unknown>;

let currentUserId: string | null = null;
let currentRole: string | null = null;
let anonymousId: string | null = null;

const ANON_KEY = 'mmp_anonymous_id';

function getAnonymousId(): string {
  if (anonymousId) return anonymousId;
  try {
    const stored = localStorage.getItem(ANON_KEY);
    if (stored) {
      anonymousId = stored;
      return stored;
    }
    const fresh = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(ANON_KEY, fresh);
    anonymousId = fresh;
    return fresh;
  } catch {
    return 'anon_unknown';
  }
}

/** Call once after auth resolves (or on guest entry). Safe to call repeatedly. */
export function identifyUser(userId: string | null, role?: string | null): void {
  try {
    currentUserId = userId;
    currentRole = role ?? null;
    // Future: posthog.identify(userId ?? getAnonymousId(), { role });
  } catch {
    // analytics must never break the app
  }
}

/** Clear identity on logout. */
export function resetAnalyticsIdentity(): void {
  try {
    currentUserId = null;
    currentRole = null;
    // Future: posthog.reset();
  } catch {
    /* noop */
  }
}

/** Fire-and-forget event tracker. Never throws, never blocks. */
export function trackEvent(name: AppEventName, props: EventProps = {}): void {
  try {
    const enriched: EventProps = {
      ...props,
      user_id: currentUserId ?? getAnonymousId(),
      is_anonymous: !currentUserId,
      role: currentRole ?? 'unknown',
      timestamp: Date.now(),
    };
    dispatch(name, enriched);
  } catch {
    /* swallow — analytics must never break UX */
  }
}

/** Convenience for the "feature_used" pattern. */
export function trackFeatureUsed(feature: string, extra: EventProps = {}): void {
  trackEvent('feature_used', { feature, ...extra });
}

function dispatch(name: AppEventName, props: EventProps): void {
  // Local fallback: route through existing in-memory analytics so dashboards
  // still work in beta. Replace with posthog.capture(name, props) when ready.
  analytics.track('user_action', { event: name, ...props });
}