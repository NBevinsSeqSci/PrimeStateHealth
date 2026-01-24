import Link from "next/link";

export default function TryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
            Free check-in
          </p>
          <h1 className="text-4xl font-semibold text-white">Free brain check-in</h1>
          <p className="text-lg text-slate-200">
            Get your Brain Clarity Snapshot in 3-6 minutes.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Measures attention, speed, and memory.</li>
            <li>Works best in a quiet spot on a laptop or desktop.</li>
            <li>Repeat monthly to track your trend.</li>
          </ul>
          <p className="text-xs text-slate-400">
            Not diagnosis or treatment. If you have concerns, talk with a
            licensed clinician.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Ready to start?
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Begin the check-in now, or create a secure link to save your
            results.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cognitive-test"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Start check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
