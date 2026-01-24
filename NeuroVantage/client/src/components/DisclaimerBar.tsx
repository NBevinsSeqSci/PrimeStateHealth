import { useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "nv_disclaimer_dismissed";

const readDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export function DisclaimerBar() {
  const [dismissed, setDismissed] = useState(readDismissed);

  if (dismissed) return null;

  return (
    <div className="w-full border-b border-amber-100 bg-amber-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs text-amber-900 sm:text-sm">
        <p className="leading-snug">
          NeuroVantage is for screening and progress tracking. It does not diagnose conditions or replace
          clinical evaluation.
        </p>
        <button
          type="button"
          aria-label="Dismiss disclaimer"
          className="rounded-full p-1 text-amber-700 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          onClick={() => {
            setDismissed(true);
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(STORAGE_KEY, "true");
              } catch {
                // ignore storage failures
              }
            }
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
