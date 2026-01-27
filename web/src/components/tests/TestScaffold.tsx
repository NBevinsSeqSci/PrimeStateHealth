"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";

export type TestKind =
  | "reaction-time"
  | "executive-function"
  | "visual-memory";

export type TestResultPayload = {
  kind: TestKind;
  score: number;
  raw?: unknown;
  createdAt?: string;
};

type Props = {
  title: string;
  description?: string;
  kind: TestKind;
  backHref?: string;
  backLabel?: string;
  children: (args: { onComplete: (raw: unknown) => void; isComplete: boolean }) => ReactNode;
  scoreFromRaw: (raw: unknown) => number;
  resultCallout?: ReactNode;
  getPercentile?: (score: number) => number | null;
};

export default function TestScaffold({
  title,
  description,
  kind,
  backHref,
  backLabel,
  children,
  scoreFromRaw,
  resultCallout,
  getPercentile,
}: Props) {
  const [raw, setRaw] = useState<unknown | null>(null);
  const { data: session, status } = useSession();

  const score = useMemo(() => {
    if (raw == null) return null;
    const computed = scoreFromRaw(raw);
    if (!Number.isFinite(computed)) return null;
    return Math.max(0, Math.min(100, Math.round(computed)));
  }, [raw, scoreFromRaw]);

  const percentile = useMemo(() => {
    if (score == null || !getPercentile) return null;
    return getPercentile(score);
  }, [score, getPercentile]);

  const isAuthenticated = status === "authenticated";
  const backTarget = backHref ?? "/cognitive-test";
  const backText = backLabel ?? "Back to check-in";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <Link
          href={backTarget}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backText}
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 text-base text-slate-600">{description}</p>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>For best results: Find a quiet spot and close other tabs before starting.</span>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children({ onComplete: setRaw, isComplete: raw != null })}
        </section>

        {score != null && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-500">Your score</div>
                  {isAuthenticated && percentile != null && (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        {percentile}th percentile
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-5xl font-bold text-slate-900">{score}</div>
                  <div className="text-xl font-medium text-slate-400">/100</div>
                </div>
                {isAuthenticated && percentile != null ? (
                  <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p>
                      Your score is in the <strong className="font-semibold text-slate-900">{percentile}th percentile</strong> compared to age-matched reference data. This means you performed better than {percentile}% of people in your age group.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Create an account to unlock more</p>
                        <p className="mt-1 text-amber-800">
                          See how you compare to others, save your results, and track your progress over time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <p className="mt-4 text-xs text-slate-500">
                  These scores are for tracking your baseline and trend — not for diagnosis or treatment.
                </p>
              </div>
              {!isAuthenticated && resultCallout}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
