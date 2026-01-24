import Link from "next/link";

export default function ResultsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
          Results
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Your Brain Clarity Snapshot
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          These scores help you track your baseline and trend over time.
          Complete the check-in to generate your snapshot.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cognitive-test"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Take the check-in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
