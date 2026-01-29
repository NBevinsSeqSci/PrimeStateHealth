import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPostHogClient } from "@/lib/posthog-server";

type ResultsPageProps = {
  params: { id: string };
};

const insightFromScore = (score: number) => {
  if (score >= 16) {
    return "Strong snapshot today. Keep the routines that are working and consider one small upgrade.";
  }
  if (score >= 10) {
    return "A mixed snapshot today. Small changes to sleep, stress, or focus habits can move the trend.";
  }
  return "This snapshot suggests room for improvement. Try one change for a week and recheck in a similar setting.";
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = params;
  const result = await prisma.cognitiveTest.findUnique({ where: { id } });

  if (!result) {
    notFound();
  }

  // Track result viewed (server-side)
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: result.email ?? result.userId ?? "anonymous",
    event: "result_viewed",
    properties: {
      resultId: result.id,
      testKind: result.kind,
      score: result.score,
      source: "server",
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
          Your Brain Clarity Snapshot
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink-900">
          Score: {result.score}
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          These scores help you track your baseline and trend over time.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          {insightFromScore(result.score)}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-500">
              Email
            </p>
            <p className="mt-2 text-sm text-ink-700">{result.email}</p>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-500">
              Completed
            </p>
            <p className="mt-2 text-sm text-ink-700">
              {result.createdAt.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cognitive-test"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Run another check-in
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
          >
            Return home
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-500">
          Prime State is for measurement and trend tracking - not diagnosis or
          treatment. If you have concerns, talk with a licensed clinician.
        </p>
      </div>
    </div>
  );
}
