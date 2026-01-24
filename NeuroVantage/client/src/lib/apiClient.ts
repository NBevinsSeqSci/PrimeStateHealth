import { appConfig } from "@/lib/appConfig";
import {
  logApiCall,
  setDiagnosticsConfig,
  setLastApiError,
  type DiagnosticsApiError,
} from "@/lib/diagnosticsStore";

setDiagnosticsConfig(appConfig);

type ApiClientOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export class ApiError extends Error {
  status?: number;
  url: string;
  method: string;
  code?: string;
  details?: unknown;

  constructor(message: string, info: { status?: number; url: string; method: string; code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = info.status;
    this.url = info.url;
    this.method = info.method;
    this.code = info.code;
    this.details = info.details;
  }

  toJSON(): DiagnosticsApiError {
    return {
      message: this.message,
      status: this.status,
      url: this.url,
      method: this.method,
      code: this.code,
      details: this.details,
    };
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_GET_RETRIES = 2;
const BACKOFF_MS = 400;

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const resolveRequestUrl = (path: string) => {
  if (!path) return path;
  if (isAbsoluteUrl(path) || !appConfig.apiBaseUrl) return path;
  const base = appConfig.apiBaseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

const nowMs = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readResponseBody = async (res: Response) => {
  const text = await res.text();
  if (!text) return { data: undefined, raw: "" };
  try {
    return { data: JSON.parse(text), raw: text };
  } catch {
    return { data: text, raw: text };
  }
};

const normalizeError = (error: unknown, url: string, method: string): ApiError => {
  if (error instanceof ApiError) return error;
  if (error instanceof Error && error.name === "AbortError") {
    return new ApiError("Request timed out", { url, method, code: "timeout" });
  }
  return new ApiError(error instanceof Error ? error.message : "Network error", {
    url,
    method,
    code: "network",
  });
};

const shouldRetry = (method: string, error: ApiError) => {
  if (method !== "GET") return false;
  if (error.code === "timeout" || error.code === "network") return true;
  if (typeof error.status === "number" && error.status >= 500) return true;
  if (error.status === 429) return true;
  return false;
};

const resolvePublicAssetUrl = (path: string) => {
  if (typeof window === "undefined") return path;
  const base = import.meta.env?.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(`${normalizedBase}${normalizedPath}`, window.location.origin).toString();
};

type DemoResults = {
  results: Array<{
    name: string;
    value?: number | string;
    unit?: string;
    zScore?: number;
    refRange?: { low?: number; high?: number; text?: string };
  }>;
};

let demoResultsCache: DemoResults | null = null;
let demoPathwaysCache: unknown | null = null;

const loadDemoResults = async (): Promise<DemoResults> => {
  if (demoResultsCache) return demoResultsCache;
  const url = resolvePublicAssetUrl("demo/demoResults.json");
  const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  const { data } = await readResponseBody(res);
  demoResultsCache = (data as DemoResults) ?? { results: [] };
  return demoResultsCache;
};

const loadDemoPathways = async () => {
  if (demoPathwaysCache) return demoPathwaysCache;
  const url = resolvePublicAssetUrl("demo/demoPathways.json");
  const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  const { data } = await readResponseBody(res);
  demoPathwaysCache = data;
  return demoPathwaysCache;
};

const buildDemoReport = async (reportId: number) => {
  const demoResults = await loadDemoResults();
  const demoPathways = await loadDemoPathways();
  const timestamp = new Date().toISOString();

  return {
    report: {
      id: reportId,
      clinicId: "demo",
      demographics: {
        firstName: "Jordan",
        lastName: "Reed",
        age: 42,
        email: "demo@neurovantage.health",
        visitType: "full-assessment",
      },
      medicalHistory: {
        sleep: "Inconsistent",
        diet: "Omnivore",
      },
      screenerScores: {
        summary: {
          assessmentType: "Full cognitive assessment",
          highLevelFlags: ["Attention variability noted", "Mood resilience appears stable"],
        },
      },
      cognitiveScores: {
        orientation: 5,
        cpt: 520,
        symbol: 1150,
        trails: 78,
        stroop: 145,
        go_no_go: { rawScore: 72 },
        digit_span: 5,
        visual_memory: 9,
        list: 18,
        fluency: 22,
        missingTasks: [],
      },
      recommendations: [],
      status: "Review",
      createdAt: timestamp,
      metabolomics: {
        results: demoResults.results,
        pathways: demoPathways,
      },
      metaboliteResults: demoResults.results,
      patientContext: {
        renalConcern: false,
        supplementUse: "Omega-3",
      },
    },
  };
};

const buildDemoClinicReports = async () => {
  const reportOne = await buildDemoReport(1001);
  const reportTwo = await buildDemoReport(1002);
  reportTwo.report.demographics = {
    ...(reportTwo.report.demographics as Record<string, unknown>),
    firstName: "Avery",
    lastName: "Morgan",
  } as typeof reportTwo.report.demographics;
  reportTwo.report.status = "Stable";
  reportTwo.report.createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString();
  return {
    reports: [reportOne.report, reportTwo.report],
  };
};

const tryServeDemoResponse = async <T>(method: string, path: string): Promise<T | null> => {
  if (!appConfig.demoMode || method !== "GET") return null;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath.startsWith("/api/patient/report/")) {
    const idString = normalizedPath.replace("/api/patient/report/", "");
    const reportId = Number(idString) || 1001;
    return (await buildDemoReport(reportId)) as T;
  }
  if (normalizedPath.startsWith("/api/clinic/") && normalizedPath.endsWith("/reports")) {
    return (await buildDemoClinicReports()) as T;
  }
  return null;
};

export const apiClient = async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
  const method = String(options.method ?? "GET").toUpperCase();

  const demoResponse = await tryServeDemoResponse<T>(method, path);
  if (demoResponse) {
    logApiCall({
      id: `demo-${Date.now()}`,
      method,
      url: resolveRequestUrl(path),
      status: 200,
      ok: true,
      ms: 1,
      timestamp: new Date().toISOString(),
    });
    return demoResponse;
  }

  const url = resolveRequestUrl(path);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  let attempt = 0;
  const maxAttempts = method === "GET" ? MAX_GET_RETRIES + 1 : 1;

  while (attempt < maxAttempts) {
    const start = nowMs();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal ?? controller.signal,
        credentials: "include",
      });
      const elapsed = Math.round(nowMs() - start);
      const { data } = await readResponseBody(res);

      logApiCall({
        id: `${Date.now()}-${attempt}`,
        method,
        url,
        status: res.status,
        ok: res.ok,
        ms: elapsed,
        timestamp: new Date().toISOString(),
      });

      if (!res.ok) {
        const message =
          typeof data === "object" && data
            ? (data as Record<string, any>).message || (data as Record<string, any>).error || res.statusText
            : res.statusText;
        const apiError = new ApiError(message || "Request failed", {
          status: res.status,
          url,
          method,
          details: data,
        });
        setLastApiError(apiError.toJSON());
        if (attempt < maxAttempts - 1 && shouldRetry(method, apiError)) {
          await sleep(BACKOFF_MS * Math.pow(2, attempt));
          attempt += 1;
          continue;
        }
        throw apiError;
      }

      setLastApiError(undefined);
      return data as T;
    } catch (error) {
      const apiError = normalizeError(error, url, method);
      setLastApiError(apiError.toJSON());
      const elapsed = Math.round(nowMs() - start);
      logApiCall({
        id: `${Date.now()}-${attempt}`,
        method,
        url,
        status: apiError.status,
        ok: false,
        ms: elapsed,
        timestamp: new Date().toISOString(),
      });
      if (attempt < maxAttempts - 1 && shouldRetry(method, apiError)) {
        await sleep(BACKOFF_MS * Math.pow(2, attempt));
        attempt += 1;
        continue;
      }
      throw apiError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new ApiError("Request failed after retries", { url, method });
};

export const isDemoMode = () => appConfig.demoMode;
export const getApiBaseUrl = () => appConfig.apiBaseUrl;
