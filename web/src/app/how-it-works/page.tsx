import Link from "next/link";
import Image from "next/image";

function Step({
  number,
  title,
  description,
  details,
}: {
  number: string;
  title: string;
  description: string;
  details: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
          <ul className="mt-3 space-y-1.5">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{content}</p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Prime State Health"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Prime State Health</div>
            <div className="text-xs text-slate-500">At-home brain check-ins</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
          <Link className="hover:text-slate-900" href="/how-it-works">
            How it works
          </Link>
          <Link className="hover:text-slate-900" href="/try">
            Free Tests
          </Link>
          <Link className="hover:text-slate-900" href="/login">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Get started
          </Link>
        </nav>

        <Link
          href="/signup"
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 sm:hidden"
        >
          Get started
        </Link>
      </header>

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How Prime State Health works
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            A simple, evidence-based approach to tracking your cognitive performance over time.
          </p>
        </div>
      </section>

      {/* The Process */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">The Four-Step Process</h2>

        <div className="space-y-6">
          <Step
            number="1"
            title="Complete a check-in"
            description="Choose one or more quick cognitive tests to establish your baseline."
            details={[
              "Executive function test measures focus and inhibition control (Stroop task)",
              "Memory test assesses short-term visual recall with pattern sequences",
              "Reaction time test tracks processing speed and response consistency",
              "Each test takes 1–3 minutes and can be done on any device",
            ]}
          />

          <Step
            number="2"
            title="See your snapshot"
            description="Get immediate results with clear scores and context."
            details={[
              "View your raw scores alongside age-based normative ranges",
              "Understand what each score means in practical terms",
              "No complex jargon—just straightforward metrics",
              "Results appear instantly after completing each test",
            ]}
          />

          <Step
            number="3"
            title="Pick one change"
            description="Identify a single habit or intervention to test."
            details={[
              "Choose something specific and measurable (e.g., sleep schedule, exercise routine)",
              "Focus on one variable at a time for clearer cause-and-effect",
              "Give the change at least 2–4 weeks to show potential effects",
              "Keep other factors consistent to isolate what works",
            ]}
          />

          <Step
            number="4"
            title="Repeat and track"
            description="Re-test monthly to build a trendline and see what's actually working."
            details={[
              "Test at a similar time of day for consistency",
              "Monthly check-ins work well for most lifestyle changes",
              "Create an account to save and compare results over time",
              "Watch for trends rather than reacting to single data points",
            ]}
          />
        </div>
      </section>

      {/* What Makes It Work */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">What makes this approach effective</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="Evidence-based tests"
              content="All tests are based on validated cognitive assessments used in research and clinical settings. They measure real, meaningful aspects of brain function."
            />
            <InfoCard
              title="Consistent methodology"
              content="Using the same tests in the same way over time creates clean comparisons. This helps you spot genuine trends instead of random noise."
            />
            <InfoCard
              title="Low barrier to entry"
              content="No appointments, no equipment, no lengthy questionnaires. Just quick, focused tasks you can complete whenever it's convenient."
            />
            <InfoCard
              title="Trend over time"
              content="Single scores are snapshots. A series of scores becomes a trendline—far more useful for understanding what actually affects your performance."
            />
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Best practices for accurate tracking</h2>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Test at a consistent time</h4>
            <p className="mt-1 text-sm text-slate-600">
              Cognitive performance varies throughout the day. Testing at the same time (e.g., every first Monday
              morning) reduces variability and makes trends clearer.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Minimize distractions</h4>
            <p className="mt-1 text-sm text-slate-600">
              Find a quiet space where you can focus. Turn off notifications, close extra tabs, and give yourself a
              minute to settle before starting.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Don't over-test</h4>
            <p className="mt-1 text-sm text-slate-600">
              Monthly check-ins work well for most people. Testing too frequently can lead to practice effects (getting
              better just from repetition) and make it harder to see real changes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Focus on trends, not single scores</h4>
            <p className="mt-1 text-sm text-slate-600">
              One bad score doesn't mean much—you might have been tired, stressed, or distracted. Look at the pattern
              over 3–6 data points to spot real trends.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Change one thing at a time</h4>
            <p className="mt-1 text-sm text-slate-600">
              If you change sleep, diet, and exercise all at once, you won't know which made the difference. Test one
              intervention at a time for clearer insights.
            </p>
          </div>
        </div>
      </section>

      {/* Important Limitations */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Important: What this is NOT</h2>

          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-600">
              Prime State Health is a <strong>measurement and tracking tool</strong>, not a diagnostic instrument. It
              does not diagnose cognitive impairment, dementia, ADHD, or any medical condition.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              If you're experiencing concerning symptoms, memory problems, or significant cognitive changes, consult a
              licensed healthcare professional. These tests are meant to help you understand trends in your own
              performance—not to replace clinical assessment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Ready to establish your baseline?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with a free check-in. No signup required to see your results.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Try free check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
            >
              Create account to track
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-slate-500 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-slate-700">Prime State Health</div>
            <div className="text-xs">Know where you stand. Track your trend.</div>
          </div>
          <div className="flex gap-5">
            <Link className="hover:text-slate-700" href="/terms">
              Terms
            </Link>
            <Link className="hover:text-slate-700" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-slate-700" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
