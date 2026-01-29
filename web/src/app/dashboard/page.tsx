"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileIntakeTrigger } from "@/components/ProfileIntakeTrigger";
import QuickCheckIn from "@/components/QuickCheckIn";

const ctaClass = [
  "inline-flex items-center justify-center gap-1.5",
  "h-10 px-4",
  "rounded-xl",
  "whitespace-nowrap",
  "bg-slate-900 text-white",
  "font-semibold text-sm",
  "shadow-sm",
  "hover:bg-slate-800",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
  "active:translate-y-[1px]",
  "dark:bg-white dark:text-slate-900",
  "dark:hover:bg-slate-100",
].join(" ");

type TestResultsData = {
  displayName: string | null;
  totalTests: number;
  completedTestKinds: string[];
  latestByKind: Record<string, { score: number; createdAt: string }>;
  recentResults: Array<{
    id: string;
    kind: string | null;
    score: number;
    createdAt: string;
  }>;
};

const cognitiveTests = [
  {
    href: "/cognitive-test/executive",
    kind: "executive-function",
    label: "Executive Function",
    description: "Stroop color-word test",
    duration: "2-3 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/memory",
    kind: "visual-memory",
    label: "Visual Memory",
    description: "Pattern recall test",
    duration: "3-4 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/reaction-time",
    kind: "reaction-time",
    label: "Reaction Time",
    description: "Speed & response test",
    duration: "1-2 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/digit-span",
    kind: "digit-span",
    label: "Digit Span",
    description: "Working memory test",
    duration: "3-5 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/go-nogo",
    kind: "go-nogo",
    label: "Go/No-Go",
    description: "Impulse control test",
    duration: "4-5 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/orientation",
    kind: "orientation",
    label: "Orientation",
    description: "Temporal awareness test",
    duration: "1-2 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/fluency",
    kind: "fluency",
    label: "Verbal Fluency",
    description: "Language generation test",
    duration: "1 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/symbol-coding",
    kind: "symbol-coding",
    label: "Symbol Coding",
    description: "Processing speed test",
    duration: "90 sec",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/trails",
    kind: "trails",
    label: "Trails",
    description: "Visual attention test",
    duration: "1-2 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/verbal-list",
    kind: "verbal-list",
    label: "Verbal List Learning",
    description: "Episodic memory test",
    duration: "5-7 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: "/cognitive-test/health-questionnaire",
    kind: "health-questionnaire",
    label: "Health Questionnaire",
    description: "Mood & attention screening",
    duration: "2-3 min",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const testKindLabels: Record<string, string> = {
  "executive-function": "Executive Function",
  "visual-memory": "Visual Memory",
  "reaction-time": "Reaction Time",
  "digit-span": "Digit Span",
  "go-nogo": "Go/No-Go",
  "orientation": "Orientation",
  "fluency": "Verbal Fluency",
  "symbol-coding": "Symbol Coding",
  "trails": "Trails",
  "verbal-list": "Verbal List",
  "health-questionnaire": "Health Questionnaire",
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [resultsData, setResultsData] = useState<TestResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/test-results")
        .then((res) => res.json())
        .then((data) => {
          setResultsData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const completedCount = resultsData?.completedTestKinds.length ?? 0;
  const totalTestTypes = cognitiveTests.length;
  const greeting = resultsData?.displayName
    ? `Welcome back, ${resultsData.displayName}`
    : "Your dashboard";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="space-y-8">
        {/* Header with Personalization */}
        <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
          {status === "authenticated" && session?.user?.email && (
            <p className="mb-2 text-xs text-ink-400">
              Signed in as {session.user.name || session.user.email}
            </p>
          )}
          <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink-900">
            {loading ? "Loading..." : greeting}
          </h1>
          <p className="mt-3 text-sm text-ink-500">
            Track your cognitive health, take tests, and monitor your progress over time.
          </p>

          {/* Progress Stats */}
          {status === "authenticated" && !loading && (
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink-900">{completedCount}/{totalTestTypes}</p>
                  <p className="text-xs text-ink-500">Tests completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink-900">{resultsData?.totalTests ?? 0}</p>
                  <p className="text-xs text-ink-500">Total assessments</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cognitive Tests Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink-900">Cognitive Tests</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cognitiveTests.map((test) => {
              const isCompleted = resultsData?.completedTestKinds.includes(test.kind);
              const latestResult = resultsData?.latestByKind[test.kind];

              return (
                <div
                  key={test.href}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute right-3 top-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-600">
                    {test.icon}
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
                    {test.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{test.description}</p>

                  {/* Last score if available */}
                  {latestResult && (
                    <p className="mt-2 text-xs text-slate-500">
                      Last: {latestResult.score}/100 • {formatRelativeTime(latestResult.createdAt)}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">
                      {test.duration}
                    </p>
                    <Link
                      href={test.href}
                      className={ctaClass}
                    >
                      {isCompleted ? "Retake" : "Start"}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {status === "authenticated" && resultsData && resultsData.recentResults.length > 0 && (
          <div className="rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-ink-900">Recent Activity</h2>
            <div className="space-y-3">
              {resultsData.recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {result.kind ? testKindLabels[result.kind] || result.kind : "Assessment"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(result.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{result.score}</p>
                    <p className="text-xs text-slate-500">/100</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Check-In */}
        <QuickCheckIn />

        {/* Demographics Prompt */}
        <div className="rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">
                Share your demographics &amp; health history
              </p>
              <p className="text-sm text-ink-500">
                Optional details help us normalize your scores and personalize future insights.
              </p>
            </div>
            <ProfileIntakeTrigger />
          </div>
        </div>

      </div>
    </div>
  );
}
