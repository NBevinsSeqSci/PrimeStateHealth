"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";

const TERMS_VERSION = "2026-01-28";

function AcceptTermsContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users to login
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleAccept = async () => {
    if (!accepted || !session?.user?.email) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/accept-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          termsVersion: TERMS_VERSION,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to record acceptance");
      }

      // Refresh the session so acceptedTermsAt is updated in the JWT
      await update();

      // Track terms acceptance on client side
      posthog.capture("terms_accepted", {
        termsVersion: TERMS_VERSION,
        email: session.user.email,
      });

      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Terms of Use
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Before continuing, please review and accept our Terms of Use. This is
          required to use Prime State Health.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-700">
            By accepting, you agree to our{" "}
            <Link
              href="/terms"
              target="_blank"
              className="font-medium text-slate-900 underline hover:text-slate-700"
            >
              Terms of Use
            </Link>{" "}
            (effective {TERMS_VERSION}), including the arbitration agreement,
            class action waiver, and data usage policies described therein.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAccept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <label htmlFor="termsAccept" className="text-sm text-slate-700">
              I have read and agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-slate-900 underline hover:text-slate-700"
              >
                Terms of Use
              </Link>
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleAccept}
          disabled={!accepted || submitting}
          className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Accept and continue"}
        </button>
      </div>
    </div>
  );
}

export default function AcceptTermsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      }
    >
      <AcceptTermsContent />
    </Suspense>
  );
}
