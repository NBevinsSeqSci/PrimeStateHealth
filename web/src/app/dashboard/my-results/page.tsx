import Link from "next/link";

export default function MyResultsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">My Results</h1>
      <p className="mt-3 text-sm text-slate-300">
        View your latest Brain Clarity Snapshot and past check-ins.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex text-sm font-semibold text-emerald-200"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
