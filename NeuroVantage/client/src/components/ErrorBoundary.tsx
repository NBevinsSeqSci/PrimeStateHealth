import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getDiagnosticsSnapshot } from "@/lib/diagnosticsStore";

type ErrorBoundaryProps = {
  children: ReactNode;
  context?: string;
  showHomeLink?: boolean;
  homeHref?: string;
};

type ErrorBoundaryState = {
  error?: Error;
  errorId?: string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return {
      error,
      errorId: `err-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", this.props.context ?? "root", error);
  }

  private buildDebugPayload(error: Error) {
    const snapshot = getDiagnosticsSnapshot();
    return {
      errorId: this.state.errorId,
      context: this.props.context ?? "app",
      route:
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "unknown",
      buildVersion: snapshot.config.buildVersion,
      timestamp: new Date().toISOString(),
      lastApiError: snapshot.lastError ?? null,
      error: {
        message: error.message,
        stack: error.stack ?? "",
      },
    };
  }

  private handleCopy = async () => {
    if (!this.state.error) return;
    const payload = this.buildDebugPayload(this.state.error);
    const text = JSON.stringify(payload, null, 2);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return;
    }
    window.prompt("Copy debug info:", text);
  };

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private handleReturnHome = () => {
    if (typeof window !== "undefined") {
      window.location.assign(this.props.homeHref ?? "/");
    }
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Something went wrong
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            We hit an unexpected error.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Try reloading the page. If this keeps happening, share the debug info below with the team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={this.handleReload}>Reload</Button>
            {this.props.showHomeLink && (
              <Button variant="outline" onClick={this.handleReturnHome}>
                Return home
              </Button>
            )}
            <Button variant="outline" onClick={this.handleCopy}>
              Copy debug info
            </Button>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Error ID: {this.state.errorId}
          </div>
        </div>
      </div>
    );
  }
}
