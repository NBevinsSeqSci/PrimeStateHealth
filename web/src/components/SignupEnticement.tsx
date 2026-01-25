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
    <div
      className={[
        "mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        "sm:p-5",
        variant === "compact" ? "bg-slate-50" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
          <p className="font-semibold text-slate-900">Trendline</p>
          <p className="mt-1">See month-to-month change at a glance.</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
          <p className="font-semibold text-slate-900">Comparisons</p>
          <p className="mt-1">Compare today vs your baseline and recent average.</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
          <p className="font-semibold text-slate-900">All tests</p>
          <p className="mt-1">Keep executive, memory, and reaction scores together.</p>
        </div>
      </div>
    </div>
  );
}
