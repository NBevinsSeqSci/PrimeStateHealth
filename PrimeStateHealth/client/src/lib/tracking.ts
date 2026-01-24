const CONSENT_KEY = "nv_consent_analytics";
const UTM_KEY = "nv_utms";
const LANDING_KEY = "nv_landing_path";
const REFERRER_KEY = "nv_referrer";

type UtmRecord = Record<string, string>;

declare global {
  interface Window {
    __nv_ga_loaded?: boolean;
    __nv_meta_loaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

function safeGetItem(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeParse(value: string | null) {
  if (!value) return {};
  try {
    return JSON.parse(value) as UtmRecord;
  } catch (error) {
    return {};
  }
}

function safeSetItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures (private mode, etc.).
  }
}

export function getConsent(): boolean | null {
  const value = safeGetItem(CONSENT_KEY);
  if (value === null) return null;
  return value === "true";
}

export function setConsent(value: boolean) {
  safeSetItem(CONSENT_KEY, String(value));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("nv-consent-changed", { detail: value })
    );
  }
}

export function canTrack() {
  return getConsent() === true;
}

export function storeUTMsFromLocation() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  const existing = safeGetItem(UTM_KEY);
  const stored: UtmRecord = safeParse(existing);
  let updated = false;

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      stored[key] = value;
      updated = true;
    }
  });

  if (updated) {
    safeSetItem(UTM_KEY, JSON.stringify(stored));
  }

  if (!safeGetItem(LANDING_KEY)) {
    safeSetItem(LANDING_KEY, window.location.pathname);
  }

  if (!safeGetItem(REFERRER_KEY)) {
    const referrer = document.referrer || "";
    if (referrer) {
      safeSetItem(REFERRER_KEY, referrer);
    }
  }
}

export function getUTMs() {
  const stored = safeGetItem(UTM_KEY);
  const utms: UtmRecord = safeParse(stored);
  const landing = safeGetItem(LANDING_KEY);
  const referrer = safeGetItem(REFERRER_KEY);

  return {
    ...utms,
    landing_path: landing || undefined,
    referrer: referrer || undefined,
  };
}

export function initGA4(ga4Id?: string) {
  if (!ga4Id || typeof window === "undefined") return;
  if (window.__nv_ga_loaded) return;

  window.__nv_ga_loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", ga4Id, { send_page_view: false });
}

export function initMetaPixel(pixelId?: string) {
  if (!pixelId || typeof window === "undefined") return;
  if (window.__nv_meta_loaded) return;

  window.__nv_meta_loaded = true;

  if (!window.fbq) {
    const fbq = function (...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fbq as any).callMethod
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fbq as any).callMethod(...args)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fbq as any).queue.push(args);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).queue = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).loaded = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fbq as any).version = "2.0";
    window.fbq = fbq as unknown as (...args: any[]) => void;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq?.("init", pixelId);
}

export function track(eventName: string, props: Record<string, unknown> = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[tracking]", eventName, props);
  }

  if (!canTrack()) return;

  window.gtag?.("event", eventName, props);
  window.fbq?.("trackCustom", eventName, props);
}

export function trackPageView(path: string) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[tracking] page_view", path);
  }

  if (!canTrack()) return;

  window.gtag?.("event", "page_view", { page_path: path });
  window.fbq?.("track", "PageView");
}

export function trackCTA(cta: string, location: string, href?: string) {
  track("cta_click", { cta, location, href });
}

export function trackStartScreener(props: Record<string, unknown> = {}) {
  track("screener_start", props);
}

export function trackCompleteScreener(props: Record<string, unknown> = {}) {
  track("screener_complete", props);
}

export function trackLeadSubmit(props: Record<string, unknown> = {}) {
  const payload = { ...props, ...getUTMs() };
  track("lead_submit", payload);
  if (canTrack()) {
    window.fbq?.("track", "Lead", {
      content_name: "primestatehealth_lead",
      ...payload,
    });
  }

  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  const adsLabel = import.meta.env.VITE_GOOGLE_ADS_LABEL;
  if (canTrack() && adsId && adsLabel) {
    window.gtag?.("event", "conversion", {
      send_to: `${adsId}/${adsLabel}`,
    });
  }
}

export function trackWaitlistSubmit(props: Record<string, unknown> = {}) {
  const payload = { ...props, ...getUTMs() };
  track("waitlist_submit", payload);
  if (canTrack()) {
    window.fbq?.("trackCustom", "WaitlistSubmit", payload);
  }
}
