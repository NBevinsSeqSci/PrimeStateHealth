import Link from "next/link";

type Props = {
  variant?: "default" | "compact";
  title?: string;
  subtitle?: string;
};

export default function SignupEnticement({
  variant = "default",
  title = "Want to track your trend?",
  subtitle = "Create a free account to save results, see your history, and get simple comparisons over time.",
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Trendline</p>
            <p className="mt-0.5 text-xs text-slate-600">See month-to-month change at a glance.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Comparisons</p>
            <p className="mt-0.5 text-xs text-slate-600">Compare today vs your baseline.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">All tests</p>
            <p className="mt-0.5 text-xs text-slate-600">Keep all your scores together.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
