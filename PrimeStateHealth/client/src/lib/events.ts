import { trackEvent, type TrackEventType } from "@/lib/trackEvent";
import { getSessionId, readSessionJson, writeSessionJson } from "@/lib/storage";
import { canTrack } from "@/lib/tracking";

type TrackEventPayload = Parameters<typeof trackEvent>[0];

const EVENT_DEDUPE_PREFIX = "nv_event_dedupe";
const ANALYTICS_DEDUPE_PREFIX = "nv_analytics_dedupe";
const ANALYTICS_TTL_MS = 3000;

const buildDedupeKey = (payload: TrackEventPayload, dedupeKey?: string) => {
  const base = dedupeKey ?? payload.path ?? payload.type;
  return `${EVENT_DEDUPE_PREFIX}:${payload.type}:${base}`;
};

export async function trackAppEvent(
  payload: TrackEventPayload,
  options: { dedupe?: boolean; dedupeKey?: string } = {},
) {
  const dedupe = options.dedupe ?? true;
  if (dedupe) {
    const key = buildDedupeKey(payload, options.dedupeKey);
    const seen = readSessionJson<boolean>(key);
    if (seen) return;
    writeSessionJson(key, true);
  }

  const sessionId = getSessionId("events");
  const meta = { sessionId, ...(payload.meta ?? {}) };
  return trackEvent({ ...payload, meta });
}

export function track(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId("analytics");
  const dedupeKey = `${ANALYTICS_DEDUPE_PREFIX}:${sessionId}:${eventName}`;
  const now = Date.now();
  const lastSeen = readSessionJson<number>(dedupeKey) ?? 0;
  if (now - lastSeen < ANALYTICS_TTL_MS) return;
  writeSessionJson(dedupeKey, now);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[tracking]", eventName, payload);
  }

  if (!canTrack()) return;
  window.gtag?.("event", eventName, payload);
  window.fbq?.("trackCustom", eventName, payload);
}

export { type TrackEventType };
