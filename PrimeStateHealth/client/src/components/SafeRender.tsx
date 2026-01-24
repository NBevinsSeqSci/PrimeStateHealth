import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type SafeRenderProps = {
  children: ReactNode;
  context?: string;
};

export function SafeRender({ children, context }: SafeRenderProps) {
  return (
    <ErrorBoundary context={context} showHomeLink>
      {children}
    </ErrorBoundary>
  );
}
