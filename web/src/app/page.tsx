import Link from "next/link";
import ValueCard from "@/components/ValueCard";
import { LinkButton } from "@/components/ui/link-button";

export default function HomePage() {
  const steps = [
    {
      n: "01",
      title: "Check in",
      body: "Complete a short set of tasks.",
    },
    {
      n: "02",
      title: "See your snapshot",
      body: "Get clear scores and context.",
    },
    {
      n: "03",
      title: "Pick one change",
      body: "Choose a simple next step.",
    },
    {
      n: "04",
      title: "Repeat monthly",
      body: "Watch your trendline over time.",
    },
  ];

  const valueCards = [
    {
      title: "Get a baseline fast",
      description: "Know how you're doing today — before guessing what to change.",
    },
    {
      title: "See what's working",
      description: "Trends show which habits and interventions actually help.",
    },
    {
      title: "Stay consistent",
      description: "Same tests, month to month, for clean comparisons.",
    },
    {
      title: "Low friction",
      description: "No appointments. No equipment. Just your device.",
    },
  ];

  const faqs = [
    {
      q: "Is this a medical diagnosis?",
      a: "No. It's a measurement and tracking tool. If you're worried about symptoms, talk with a licensed clinician.",
    },
    {
      q: "How often should I do it?",
      a: "Monthly works well for most people. If you're testing a change, you can recheck weekly for a short stretch.",
    },
    {
      q: "Is my data private?",
      a: "You control your account and results. We aim for privacy-first defaults and minimal data needed to run the service.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-brand-200/60 blur-3xl" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-brand-200/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600">
                <span aria-hidden="true">•</span> At-home brain check-ins
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Know where you stand.
                <span className="block text-ink-600">Track your trend.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600">
                Measure attention, speed, and memory in minutes, then follow your progress over time.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton href="/try" variant="secondary" size="lg">
                  Try free check-in
                </LinkButton>
                <LinkButton href="/signup" variant="primary" size="lg">
                  Get started
                </LinkButton>
              </div>

              <p className="mt-3 text-xs text-ink-500">
                All testing is free. See results instantly - no account required. Create an account only if you want to
                save and track results over time.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-medium text-ink-500">3-6 minutes</div>
                  <div className="mt-1 text-sm font-semibold text-ink-900">Quick check-in</div>
                </div>
                <div className="rounded-2xl border border-ink-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-medium text-ink-500">No equipment</div>
                  <div className="mt-1 text-sm font-semibold text-ink-900">Just your device</div>
                </div>
                <div className="rounded-2xl border border-ink-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-xs font-medium text-ink-500">Do it anywhere</div>
                  <div className="mt-1 text-sm font-semibold text-ink-900">Quiet spot helps</div>
                </div>
              </div>

              <p className="mt-6 rounded-2xl border border-ink-200 bg-white/70 p-4 text-xs leading-relaxed text-ink-500">
                Prime State Health is for measurement and trend tracking - not diagnosis or treatment. If you have
                concerns, talk with a licensed clinician.
              </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink-900">Start with one test</h2>
                  <p className="mt-1 text-sm text-ink-600">Pick what you want to measure today.</p>
                </div>
                <span className="rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-500">
                  Free
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/cognitive-test/executive"
                  className="group rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-900">Executive function</div>
                      <div className="mt-1 text-xs text-ink-500">Stroop task (focus + inhibition)</div>
                    </div>
                    <span className="text-xs text-ink-500 group-hover:text-brand-600">Start -&gt;</span>
                  </div>
                </Link>

                <Link
                  href="/cognitive-test/memory"
                  className="group rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-900">Memory</div>
                      <div className="mt-1 text-xs text-ink-500">Short-term visual memory</div>
                    </div>
                    <span className="text-xs text-ink-500 group-hover:text-brand-600">Start -&gt;</span>
                  </div>
                </Link>

                <Link
                  href="/cognitive-test/reaction-time"
                  className="group rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-900">Reaction time</div>
                      <div className="mt-1 text-xs text-ink-500">Simple response speed</div>
                    </div>
                    <span className="text-xs text-ink-500 group-hover:text-brand-600">Start -&gt;</span>
                  </div>
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border border-ink-200 bg-ink-50 p-4 text-xs text-ink-500">
                Tip: For the most consistent results, test at a similar time of day.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900">How it works — and why it matters</h2>
            <p className="mt-2 text-sm text-ink-600">
              Four simple steps to get your baseline and see what actually moves your brain-health trend.
            </p>
          </div>
          <Link
            href="/try"
            className="hidden rounded-xl border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600 sm:inline-flex"
          >
            Try free check-in
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-ink-200 bg-white/80 p-5 shadow-sm">
              <div className="text-xs font-medium text-ink-500">{s.n}</div>
              <div className="mt-2 text-sm font-semibold text-ink-900">{s.title}</div>
              <div className="mt-1 text-sm text-ink-600">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card) => (
            <ValueCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-medium text-ink-500">FAQ</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">Quick answers</h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-ink-200 bg-white/80 p-5 shadow-sm">
              <div className="text-sm font-semibold text-ink-900">{f.q}</div>
              <div className="mt-2 text-sm text-ink-600">{f.a}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
          <div>
            <div className="text-lg font-semibold text-ink-900">Get your baseline in under 6 minutes.</div>
            <div className="mt-1 text-sm text-ink-600">Free testing. No signup required for results.</div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
            >
              Try free check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
