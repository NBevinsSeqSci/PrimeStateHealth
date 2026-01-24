export type TrackEventType =
  | "SCREENER_COMPLETED"
  | "FULL_TEST_COMPLETED"
  | "REPORT_DOWNLOADED"
  | "METABOLOMICS_PILOT_SIGNUP_ATTEMPTED"
  | "METABOLOMICS_EXAMPLE_REPORT_DOWNLOADED";

export async function trackEvent(payload: {
  type: TrackEventType;
  clinicPublicId?: string;
  submissionId?: string;
  reportId?: string;
  userEmail?: string;
  userName?: string;
  path?: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await fetch("/api/events/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort only
  }
}
