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
      <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink-900">
          Your dashboard
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Track your snapshot, trends, and next steps in one place.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-ink-500">
          Sign in is required to view your dashboard.
        </p>
      </div>
    </div>
  );
}
