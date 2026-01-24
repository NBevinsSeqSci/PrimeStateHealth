import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDiagnosticsEnvVars } from "@/lib/appConfig";
import { getDiagnosticsSnapshot, subscribeDiagnostics, type DiagnosticsState } from "@/lib/diagnosticsStore";
import { cn } from "@/lib/utils";

export function DiagnosticsOverlay() {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<DiagnosticsState>(getDiagnosticsSnapshot());

  const envEntries = useMemo(() => getDiagnosticsEnvVars(), []);

  useEffect(() => subscribeDiagnostics((next) => setSnapshot(next)), []);

  useEffect(() => {
    if (!import.meta.env?.DEV) return;
    const handler = (event: KeyboardEvent) => {
      const isToggle = (event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "d";
      if (isToggle) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!import.meta.env?.DEV || !open) {
    return null;
  }

  const route =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "unknown";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Diagnostics</p>
            <p className="text-sm text-slate-600">Cmd/Ctrl + Shift + D to toggle</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
        <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Runtime</h3>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Route</span>
                <span className="font-mono">{route}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">Build</span>
                <span className="font-mono">{snapshot.config.buildVersion}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">API Base</span>
                <span className="font-mono">{snapshot.config.apiBaseUrl || "not set"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">DEMO_MODE</span>
                <span className={cn("font-mono", snapshot.config.demoMode ? "text-emerald-600" : "text-slate-600")}>
                  {snapshot.config.demoMode ? "true" : "false"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Env vars</h4>
              <div className="mt-2 max-h-56 overflow-auto rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs">
                {envEntries.length === 0 ? (
                  <p className="text-slate-500">No public env vars detected.</p>
                ) : (
                  envEntries.map((entry) => (
                    <div key={entry.key} className="flex items-center justify-between py-1 text-slate-700">
                      <span className="font-mono text-[11px] text-slate-500">{entry.key}</span>
                      <span className="ml-3 font-mono text-[11px]">{entry.value || "—"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">API activity</h3>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-700">
              <p className="text-slate-500">Last API error</p>
              {snapshot.lastError ? (
                <div className="mt-2 space-y-1 font-mono text-[11px]">
                  <div>{snapshot.lastError.message}</div>
                  <div className="text-slate-500">
                    {snapshot.lastError.method} {snapshot.lastError.url}
                  </div>
                  <div className="text-slate-500">Status: {snapshot.lastError.status ?? "—"}</div>
                </div>
              ) : (
                <div className="mt-2 text-slate-500">No recent API errors.</div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last 5 calls</h4>
              <div className="mt-2 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs">
                {snapshot.apiCalls.length === 0 ? (
                  <p className="text-slate-500">No API calls yet.</p>
                ) : (
                  snapshot.apiCalls.map((call) => (
                    <div key={call.id} className="py-2">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-mono text-[11px]">{call.method}</span>
                        <span className={cn("font-mono text-[11px]", call.ok ? "text-emerald-600" : "text-rose-600")}>
                          {call.status ?? "—"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate">{call.url}</span>
                        <span className="ml-2 font-mono">{call.ms}ms</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
