import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = {
  title: "Free Check-in | Prime State Health",
};

const TESTS = [
  {
    title: "Executive function",
    subtitle: "Stroop test",
    description: "Measures focus + inhibition (classic color-word interference).",
    href: "/cognitive-test/executive",
    cta: "Start Stroop",
  },
  {
    title: "Memory",
    subtitle: "Visual memory",
    description: "Measures short-term visual memory with a simple game-like task.",
    href: "/cognitive-test/memory",
    cta: "Start Memory",
  },
  {
    title: "Reaction time",
    subtitle: "Response speed",
    description: "Measures simple response speed (best on laptop/desktop).",
    href: "/cognitive-test/reaction-time",
    cta: "Start Reaction",
  },
];

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.1a1 1 0 0 1-1.418.002L3.29 8.88a1 1 0 1 1 1.414-1.414l3.225 3.224 6.363-6.39a1 1 0 0 1 1.412-.01Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function TryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-ink-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <section className="rounded-3xl border border-ink-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
              Free check-in • No signup required
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Get a quick Brain Clarity Snapshot
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-600 sm:text-lg">
              3–6 minutes. A short set of science-based tasks that estimate attention, speed, and memory—then gives you a
              simple score you can track over time.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-3">
              <li className="flex items-start gap-2 rounded-2xl bg-ink-50 p-3">
                <CheckIcon className="mt-0.5 h-5 w-5 text-brand-500" />
                <span>Best on laptop/desktop in a quiet spot</span>
              </li>
              <li className="flex items-start gap-2 rounded-2xl bg-ink-50 p-3">
                <CheckIcon className="mt-0.5 h-5 w-5 text-brand-500" />
                <span>Repeat monthly to see your trend</span>
              </li>
              <li className="flex items-start gap-2 rounded-2xl bg-ink-50 p-3">
                <CheckIcon className="mt-0.5 h-5 w-5 text-brand-500" />
                <span>Simple results, no jargon</span>
              </li>
            </ul>
          </div>

          {/* Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TESTS.map((t) => (
              <div
                key={t.href}
                className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-ink-900">{t.title}</h2>
                    <p className="text-xs font-medium text-ink-500">{t.subtitle}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                    →
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{t.description}</p>
                <LinkButton
                  href={t.href}
                  variant="primary"
                  size="md"
                  className="mt-5 w-full"
                >
                  {t.cta}
                </LinkButton>
              </div>
            ))}
          </div>

          {/* Optional account nudge */}
          <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-ink-50 p-4 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Want to save results and track your history?{" "}
              <span className="text-ink-500">(Optional)</span>
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-100"
            >
              Create an account
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs leading-relaxed text-ink-500">
            Important: This is not medical advice, diagnosis, or treatment. If you’re worried about symptoms, talk with a
            licensed clinician. If you think you may be having an emergency, call 911.
          </p>
        </section>

        {/* Footer note */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink-500">
          Tip: For the most consistent results, take the check-in at a similar time of day each month.
        </p>
      </div>
    </main>
  );
}
