const DEFAULT_WINDOW_MS = 2 * 60 * 1000;
const seen = new Map<string, number>();

const pruneExpired = (now: number, windowMs: number) => {
  const expired: string[] = [];
  seen.forEach((timestamp, key) => {
    if (now - timestamp > windowMs) {
      expired.push(key);
    }
  });
  expired.forEach((key) => seen.delete(key));
};

export function shouldLogEvent(key: string, windowMs = DEFAULT_WINDOW_MS) {
  const now = Date.now();
  pruneExpired(now, windowMs);
  const lastSeen = seen.get(key);
  if (lastSeen && now - lastSeen < windowMs) {
    return false;
  }
  seen.set(key, now);
  return true;
}
