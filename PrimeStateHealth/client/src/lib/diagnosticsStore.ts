export type DiagnosticsApiError = {
  message: string;
  status?: number;
  url: string;
  method: string;
  code?: string;
  details?: unknown;
};

export type DiagnosticsApiCall = {
  id: string;
  method: string;
  url: string;
  status?: number;
  ok: boolean;
  ms: number;
  timestamp: string;
};

export type DiagnosticsConfig = {
  apiBaseUrl: string;
  demoMode: boolean;
  buildVersion: string;
  mode: string;
};

export type DiagnosticsState = {
  apiCalls: DiagnosticsApiCall[];
  lastError: DiagnosticsApiError | undefined;
  config: DiagnosticsConfig;
};

const state: DiagnosticsState = {
  apiCalls: [],
  lastError: undefined,
  config: {
    apiBaseUrl: "",
    demoMode: false,
    buildVersion: "development",
    mode: "development",
  },
};

const listeners = new Set<(snapshot: DiagnosticsState) => void>();

const emitChange = () => {
  const snapshot: DiagnosticsState = {
    apiCalls: [...state.apiCalls],
    lastError: state.lastError,
    config: { ...state.config },
  };
  listeners.forEach((listener) => listener(snapshot));
};

export const getDiagnosticsSnapshot = (): DiagnosticsState => ({
  apiCalls: [...state.apiCalls],
  lastError: state.lastError,
  config: { ...state.config },
});

export const subscribeDiagnostics = (listener: (snapshot: DiagnosticsState) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const logApiCall = (record: DiagnosticsApiCall) => {
  state.apiCalls = [record, ...state.apiCalls].slice(0, 5);
  emitChange();
};

export const setLastApiError = (error?: DiagnosticsApiError) => {
  state.lastError = error;
  emitChange();
};

export const setDiagnosticsConfig = (config: Partial<DiagnosticsConfig>) => {
  state.config = { ...state.config, ...config };
  emitChange();
};
