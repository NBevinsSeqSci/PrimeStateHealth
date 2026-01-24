type EventPayload = Record<string, unknown> | undefined;

const isDevelopment = process.env.NODE_ENV !== "production";

const logEvent = (type: string, name: string, payload?: EventPayload) => {
  if (!isDevelopment) return;
  const data = payload ? ` payload=${JSON.stringify(payload)}` : "";
  console.debug(`[analytics:${type}] ${name}${data}`);
};

export function trackScreenerEvent(name: string, payload?: EventPayload) {
  logEvent("event", name, payload);
}

export function trackStageTransition(
  prevStage: string,
  nextStage: string,
  payload?: EventPayload
) {
  logEvent("stage", `${prevStage} -> ${nextStage}`, payload);
}
