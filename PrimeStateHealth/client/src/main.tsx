import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DiagnosticsOverlay } from "@/components/DiagnosticsOverlay";
import { setDiagnosticsConfig } from "@/lib/diagnosticsStore";
import { appConfig } from "@/lib/appConfig";

const queryClient = new QueryClient();

setDiagnosticsConfig(appConfig);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary context="root">
        <App />
        <DiagnosticsOverlay />
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>,
);
