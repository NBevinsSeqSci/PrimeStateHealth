"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const gaId = process.env.NEXT_PUBLIC_GA4_ID;

// Note: PostHog is now initialized via instrumentation-client.ts in Next.js 16.x
// Pageviews are automatically captured via the defaults: '2025-11-30' configuration.

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ""}`;
    if (gaId && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", gaId, { page_path: url });
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
