"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type TurnstileWidgetProps = {
  onVerify: (token: string) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const tryRender = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        timeout = setTimeout(tryRender, 200);
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
      });
    };

    tryRender();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [siteKey, onVerify]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white p-4"
      />
    </>
  );
}
