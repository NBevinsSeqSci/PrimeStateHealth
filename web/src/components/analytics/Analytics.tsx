"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const gaId = process.env.NEXT_PUBLIC_GA4_ID;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

const initPosthog = () => {
  const alreadyLoaded = (posthog as { __loaded?: boolean }).__loaded;
  if (!posthogKey || alreadyLoaded) return;
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false,
  });
};

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPosthog();
  }, []);

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ""}`;
    if (gaId && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", gaId, { page_path: url });
    }
    if (posthogKey) {
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
