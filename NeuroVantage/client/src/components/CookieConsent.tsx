import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getConsent, initGA4, initMetaPixel, setConsent, storeUTMsFromLocation } from "@/lib/tracking";

export function CookieConsent() {
  const [hasConsent, setHasConsent] = useState(() => getConsent() !== null);

  if (hasConsent) return null;

  const handleAllow = () => {
    setConsent(true);
    storeUTMsFromLocation();
    initGA4(import.meta.env.VITE_GA4_ID);
    initMetaPixel(import.meta.env.VITE_META_PIXEL_ID);
    setHasConsent(true);
  };

  const handleDecline = () => {
    setConsent(false);
    setHasConsent(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <Card className="w-full max-w-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Analytics consent</p>
            <p className="text-xs text-slate-600">
              We use analytics to understand traffic and improve the experience. No tracking runs
              until you allow it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              Decline
            </Button>
            <Button size="sm" onClick={handleAllow}>
              Allow analytics
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
