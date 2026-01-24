type DiagnosticsEnvEntry = {
  key: string;
  value: string;
};

const rawEnv = import.meta.env ?? {};

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const resolveApiBaseUrl = () => {
  const envBase =
    rawEnv.VITE_API_BASE_URL ||
    rawEnv.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return envBase ? normalizeBaseUrl(String(envBase)) : "";
};

const readBoolean = (value: unknown) => String(value).toLowerCase() === "true";

const resolveBuildVersion = () =>
  String(
    rawEnv.VITE_BUILD_VERSION ||
      rawEnv.NEXT_PUBLIC_BUILD_VERSION ||
      rawEnv.VITE_COMMIT_SHA ||
      rawEnv.NEXT_PUBLIC_COMMIT_SHA ||
      rawEnv.MODE ||
      "development",
  );

export const appConfig = {
  apiBaseUrl: resolveApiBaseUrl(),
  demoMode: readBoolean(rawEnv.VITE_DEMO_MODE || rawEnv.NEXT_PUBLIC_DEMO_MODE),
  buildVersion: resolveBuildVersion(),
  mode: String(rawEnv.MODE || "development"),
};

const shouldExposeEnv = (key: string) =>
  key === "MODE" ||
  key === "DEV" ||
  key === "PROD" ||
  key === "BASE_URL" ||
  key.startsWith("VITE_") ||
  key.startsWith("NEXT_PUBLIC_");

const shouldRedact = (key: string) => /(key|secret|token|password)/i.test(key);

const formatEnvValue = (value: unknown) => {
  if (value == null) return "";
  const text = String(value);
  if (text.length <= 80) return text;
  return `${text.slice(0, 60)}...`;
};

export const getDiagnosticsEnvVars = (): DiagnosticsEnvEntry[] =>
  Object.entries(rawEnv as Record<string, unknown>)
    .filter(([key]) => shouldExposeEnv(key))
    .map(([key, value]) => ({
      key,
      value: shouldRedact(key) ? "REDACTED" : formatEnvValue(value),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
