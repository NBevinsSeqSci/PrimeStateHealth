"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  NORMATIVE_REFERENCE,
  calculateAge,
  getAgeBucket,
  getReferenceDescription,
} from "@/lib/norms";

export type TestKind =
  | "reaction-time"
  | "executive-function"
  | "visual-memory"
  | "orientation"
  | "digit-span"
  | "go-nogo"
  | "fluency"
  | "symbol-coding"
  | "trails"
  | "verbal-list";

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
  /** Optional test-specific explanation shown to authenticated users after the score. */
  aboutScore?: ReactNode;
};

type UserProfile = {
  dateOfBirth: string | null;
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
  aboutScore,
}: Props) {
  const [raw, setRaw] = useState<unknown | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showReferenceDetails, setShowReferenceDetails] = useState(false);
  const savedRef = useRef(false);
  const { status } = useSession();

  const score = useMemo(() => {
    if (raw == null) return null;
    const computed = scoreFromRaw(raw);
    if (!Number.isFinite(computed)) return null;
    return Math.max(0, Math.min(100, Math.round(computed)));
  }, [raw, scoreFromRaw]);

  // Fetch user profile to get DOB for age calculation
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setUserProfile({ dateOfBirth: data.dateOfBirth });
          }
        })
        .catch(() => {
          // Silently fail - age will just not be available
        });
    }
  }, [status]);

  // Save result to database when test completes
  useEffect(() => {
    if (score == null || status !== "authenticated" || savedRef.current) return;

    const saveResult = async () => {
      savedRef.current = true;
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/test-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, score, answers: raw }),
        });
        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    };

    saveResult();
  }, [score, status, kind, raw]);

  const percentile = useMemo(() => {
    if (score == null || !getPercentile) return null;
    return getPercentile(score);
  }, [score, getPercentile]);

  // Calculate user's age if DOB is available
  const userAge = useMemo(() => {
    if (!userProfile?.dateOfBirth) return null;
    const age = calculateAge(userProfile.dateOfBirth);
    return age >= 18 ? age : null; // Only use if 18+
  }, [userProfile]);

  const ageBucket = useMemo(() => {
    if (userAge === null) return null;
    return getAgeBucket(userAge);
  }, [userAge]);

  const referenceInfo = useMemo(() => {
    return getReferenceDescription(userAge);
  }, [userAge]);

  const isAuthenticated = status === "authenticated";
  const backTarget = backHref ?? "/cognitive-test";
  const backText = backLabel ?? "Back to check-in";

  // Format reference string for display
  const referenceString = useMemo(() => {
    const parts = [NORMATIVE_REFERENCE.name];
    if (NORMATIVE_REFERENCE.version) {
      parts[0] += ` ${NORMATIVE_REFERENCE.version}`;
    }
    if (NORMATIVE_REFERENCE.sampleSize) {
      parts.push(`N=${NORMATIVE_REFERENCE.sampleSize.toLocaleString()}`);
    }
    if (NORMATIVE_REFERENCE.dateRange) {
      parts.push(`collected ${NORMATIVE_REFERENCE.dateRange}`);
    }
    if (!NORMATIVE_REFERENCE.sampleSize && !NORMATIVE_REFERENCE.dateRange) {
      parts.push("(details coming soon)");
    }
    return parts.join(" ");
  }, []);

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
                        {percentile}th percentile ({referenceInfo.percentileLabel})
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-5xl font-bold text-slate-900">{score}</div>
                  <div className="text-xl font-medium text-slate-400">/100</div>
                </div>

                {/* Percentile explanation - only when authenticated and percentile available */}
                {isAuthenticated && percentile != null && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {userAge !== null ? (
                      <p>
                        Your score is in the <strong className="font-semibold text-slate-900">{percentile}th percentile</strong> compared to age-matched reference data ({ageBucket} years). This means you performed better than {percentile}% of people in your age group.
                      </p>
                    ) : (
                      <p>
                        Your score is in the <strong className="font-semibold text-slate-900">{percentile}th percentile</strong> based on general adult reference data. This means you performed better than {percentile}% of adults in our reference population.
                      </p>
                    )}
                  </div>
                )}

                {/* Upsell - only for unauthenticated users */}
                {!isAuthenticated && (
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

                {/* Score Details section - only show for authenticated users with percentile */}
                {isAuthenticated && percentile != null && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">Score details</h4>
                      <button
                        type="button"
                        onClick={() => setShowReferenceDetails(!showReferenceDetails)}
                        className="text-xs font-medium text-brand-600 hover:text-brand-500"
                      >
                        {showReferenceDetails ? "Hide details" : "Learn more"}
                      </button>
                    </div>

                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Age:</dt>
                        <dd className="font-medium text-slate-700">
                          {userAge !== null ? `${userAge} years` : "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Norms used:</dt>
                        <dd className="font-medium text-slate-700 text-right">
                          {referenceInfo.normsUsed}
                        </dd>
                      </div>
                      <div className="flex justify-between items-start">
                        <dt className="text-slate-500">Reference:</dt>
                        <dd className="font-medium text-slate-700 text-right max-w-[200px]">
                          {NORMATIVE_REFERENCE.url ? (
                            <Link
                              href={NORMATIVE_REFERENCE.url}
                              className="text-brand-600 hover:text-brand-500 underline"
                            >
                              {referenceString}
                            </Link>
                          ) : (
                            referenceString
                          )}
                        </dd>
                      </div>
                    </dl>

                    {/* CTA to add age if not provided */}
                    {userAge === null && (
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">
                          Percentile shown is based on general adult reference data (age not provided).
                        </p>
                        <Link
                          href="/onboarding/demographics"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add age to personalize
                        </Link>
                      </div>
                    )}

                    {/* Expanded reference details */}
                    {showReferenceDetails && (
                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                        <p>
                          <strong>What is a percentile?</strong> A percentile indicates how your score compares to others. A 70th percentile means you performed better than 70% of the reference group.
                        </p>
                        {userAge !== null ? (
                          <p>
                            <strong>Age-matched comparison:</strong> Your score is compared to others in the {ageBucket} age group, providing a more relevant comparison for your life stage.
                          </p>
                        ) : (
                          <p>
                            <strong>General comparison:</strong> Without your age, we compare your score to the general adult population. Adding your age enables more precise, age-appropriate comparisons.
                          </p>
                        )}
                        <p>
                          <strong>Limitations:</strong> {NORMATIVE_REFERENCE.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Test-specific "About this score" block (authenticated only) */}
                {isAuthenticated && aboutScore && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    {aboutScore}
                    {saveStatus === "saved" && (
                      <p className="mt-2 text-xs text-slate-500">
                        Because you are signed in, this result has been saved and will appear in your Trends dashboard.
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-4 text-xs text-slate-500">
                  These scores are for tracking your baseline and trend — not for diagnosis or treatment.
                </p>
                {isAuthenticated && saveStatus === "saved" && !aboutScore && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Result saved to your account
                  </p>
                )}
              </div>
              {!isAuthenticated && resultCallout}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
