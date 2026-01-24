import { useLocation } from "wouter";
import { useMemo } from "react";

const VALID_MODES = new Set(["general", "memory", "trt"]);

type SessionContext = {
  mode: "general" | "memory" | "trt";
  clinicId: string | null;
  referrer: string | null;
  userExternalId: string | null;
};

export function useScreenerSessionContext(): SessionContext {
  const [location] = useLocation();

  return useMemo(() => {
    const queryIndex = location.indexOf("?");
    const search = queryIndex >= 0 ? location.slice(queryIndex + 1) : "";
    const params = new URLSearchParams(search);

    const modeParam = params.get("mode") ?? "general";
    const mode = VALID_MODES.has(modeParam) ? (modeParam as SessionContext["mode"]) : "general";

    return {
      mode,
      clinicId: params.get("clinicId"),
      referrer: params.get("ref"),
      userExternalId: params.get("userId"),
    };
  }, [location]);
}
