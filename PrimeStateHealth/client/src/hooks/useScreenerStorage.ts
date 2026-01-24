import { useEffect, useState } from "react";
import {
  ScreenerSession,
  hydrateSession,
} from "@/lib/cognitiveScoring";
import { migrateLocalKey, readWithFallback, writeLocalJson } from "@/lib/storage";

type SessionInitializer = () => ScreenerSession;

export function useScreenerStorage(
  key: string,
  initializer: SessionInitializer
) {
  const loadInitial = (): ScreenerSession => {
    if (typeof window === "undefined") {
      return initializer();
    }

    const legacyKey = key.replace(/\/v\d+$/, "");
    const { value, sourceKey } = readWithFallback<ScreenerSession>(key, [legacyKey]);
    if (value) {
      if (sourceKey && sourceKey !== key) {
        migrateLocalKey(sourceKey, key);
      }
      return hydrateSession(value);
    }
    return initializer();
  };

  const [session, setSession] = useState<ScreenerSession>(loadInitial);

  useEffect(() => {
    writeLocalJson(key, session);
  }, [key, session]);

  const resetSession = () => setSession(initializer());

  return { session, setSession, resetSession };
}
