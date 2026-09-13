import { track } from "@vercel/analytics";

/**
 * Safe analytics event tracker that fails gracefully in local, development,
 * or ad-blocked browser environments.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  try {
    if (typeof window !== "undefined") {
      track(eventName, properties || undefined);
    }
  } catch {
    // Fail silently so user interactions are never blocked
  }
}
