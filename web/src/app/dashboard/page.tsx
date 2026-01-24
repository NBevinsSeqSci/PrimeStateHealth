import Link from "next/link";

const dashboardLinks = [
  { href: "/dashboard/my-results", label: "My Results" },
  { href: "/dashboard/trends", label: "Trends" },
  { href: "/dashboard/suggestions", label: "Suggestions" },
  { href: "/dashboard/retest", label: "Retest" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Your dashboard
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Track your snapshot, trends, and next steps in one place.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/60"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Sign in is required to view your dashboard.
        </p>
      </div>
    </div>
  );
}
