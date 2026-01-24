type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const safeGetStorage = (kind: "local" | "session"): StorageLike | null => {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export function readJson<T>(storage: StorageLike | null, key: string): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson(storage: StorageLike | null, key: string, value: unknown) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write failures
  }
}

export function removeItem(storage: StorageLike | null, key: string) {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // ignore remove failures
  }
}

export function readLocalJson<T>(key: string): T | null {
  return readJson<T>(safeGetStorage("local"), key);
}

export function writeLocalJson(key: string, value: unknown) {
  writeJson(safeGetStorage("local"), key, value);
}

export function readSessionJson<T>(key: string): T | null {
  return readJson<T>(safeGetStorage("session"), key);
}

export function writeSessionJson(key: string, value: unknown) {
  writeJson(safeGetStorage("session"), key, value);
}

export function readWithFallback<T>(
  key: string,
  fallbackKeys: string[] = [],
): { value: T | null; sourceKey: string | null } {
  const storage = safeGetStorage("local");
  const direct = readJson<T>(storage, key);
  if (direct !== null) return { value: direct, sourceKey: key };
  for (const fallbackKey of fallbackKeys) {
    const fallbackValue = readJson<T>(storage, fallbackKey);
    if (fallbackValue !== null) return { value: fallbackValue, sourceKey: fallbackKey };
  }
  return { value: null, sourceKey: null };
}

export function migrateLocalKey(sourceKey: string, targetKey: string) {
  if (sourceKey === targetKey) return;
  const storage = safeGetStorage("local");
  const value = readJson(storage, sourceKey);
  if (value === null) return;
  writeJson(storage, targetKey, value);
  removeItem(storage, sourceKey);
}

export function getSessionId(scope = "global") {
  const key = `nv_session_id:${scope}`;
  const storage = safeGetStorage("session");
  const existing = readJson<string>(storage, key);
  if (existing) return existing;
  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sess_${Math.random().toString(36).slice(2)}`;
  writeJson(storage, key, next);
  return next;
}
