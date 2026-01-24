import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
          Your Brain Clarity Snapshot
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Score: {result.score}
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          These scores help you track your baseline and trend over time.
        </p>
        <p className="mt-3 text-sm text-slate-300">
          {insightFromScore(result.score)}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Email
            </p>
            <p className="mt-2 text-sm text-slate-200">{result.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Completed
            </p>
            <p className="mt-2 text-sm text-slate-200">
              {result.createdAt.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/cognitive-test"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Run another check-in
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Return home
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Prime State is for measurement and trend tracking - not diagnosis or
          treatment. If you have concerns, talk with a licensed clinician.
        </p>
      </div>
    </div>
  );
}
