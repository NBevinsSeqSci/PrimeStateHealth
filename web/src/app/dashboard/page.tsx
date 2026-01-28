import Link from "next/link";
import { ProfileIntakeTrigger } from "@/components/ProfileIntakeTrigger";
import QuickCheckIn from "@/components/QuickCheckIn";

const cognitiveTests = [
  {
    href: "/cognitive-test/executive",
    label: "Executive Function",
    description: "Stroop color-word test",
    duration: "2-3 min",
  },
  {
    href: "/cognitive-test/memory",
    label: "Visual Memory",
    description: "Pattern recall test",
    duration: "3-4 min",
  },
  {
    href: "/cognitive-test/reaction-time",
    label: "Reaction Time",
    description: "Speed & response test",
    duration: "1-2 min",
  },
  {
    href: "/cognitive-test/digit-span",
    label: "Digit Span",
    description: "Working memory test",
    duration: "3-5 min",
  },
  {
    href: "/cognitive-test/go-nogo",
    label: "Go/No-Go",
    description: "Impulse control test",
    duration: "4-5 min",
  },
  {
    href: "/cognitive-test/orientation",
    label: "Orientation",
    description: "Temporal awareness test",
    duration: "1-2 min",
  },
  {
    href: "#",
    label: "Verbal Fluency",
    description: "Language generation test",
    duration: "Coming soon",
    disabled: true,
  },
  {
    href: "#",
    label: "Symbol Coding",
    description: "Processing speed test",
    duration: "Coming soon",
    disabled: true,
  },
  {
    href: "#",
    label: "Trails",
    description: "Visual attention test",
    duration: "Coming soon",
    disabled: true,
  },
  {
    href: "#",
    label: "Verbal List Learning",
    description: "Episodic memory test",
    duration: "Coming soon",
    disabled: true,
  },
];

const dashboardLinks = [
  { href: "/dashboard/my-results", label: "My Results" },
  { href: "/dashboard/trends", label: "Trends" },
  { href: "/dashboard/suggestions", label: "Suggestions" },
  { href: "/dashboard/retest", label: "Retest" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink-900">
            Your dashboard
          </h1>
          <p className="mt-3 text-sm text-ink-500">
            Track your cognitive health, take tests, and monitor your progress over time.
          </p>
        </div>

        {/* Try a Test Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink-900">Cognitive Tests</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cognitiveTests.map((test) =>
              test.disabled ? (
                <div
                  key={test.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm opacity-60"
                >
                  <h3 className="text-base font-semibold text-slate-700">
                    {test.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{test.description}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {test.duration}
                  </p>
                </div>
              ) : (
                <Link
                  key={test.href}
                  href={test.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
                    {test.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{test.description}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {test.duration}
                  </p>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Quick Check-In */}
        <QuickCheckIn />

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

        {/* Dashboard Links */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-ink-900">Your Data</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-ink-200 bg-ink-50 px-5 py-4 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
