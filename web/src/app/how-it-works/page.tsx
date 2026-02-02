import Link from "next/link";

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

function InfoCard({ title, content }: { title: React.ReactNode; content: string }) {
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
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Know where you stand. Track your trend.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Quick, evidence-based brain check-ins you can repeat monthly—then follow a clear plan with coaching prompts and mini-courses to actually improve what you measure.
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              Coming soon
            </span>
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Create free account
            </Link>
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
            >
              Try free check-in (no signup)
            </Link>
          </div>
        </div>
      </section>

      <section id="coaching" className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">Coaching &amp; Courses</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              Coming soon
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Prime State pairs measurement with practical guidance&mdash;weekly coaching prompts and mini-courses designed to help you run simple experiments and track what actually works.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            For measurement and education&mdash;not diagnosis or treatment.
          </p>
        </div>
      </section>

      {/* Why an Account */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Why create an account?</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save your baseline so each check-in becomes a meaningful trendline</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>See your progress over time (not just a one-time score)</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Get reminders to re-test monthly</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="flex flex-wrap items-center gap-2">
                <span>Unlock coaching prompts, mini-courses, and community accountability</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Coming soon
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* The Process */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-8 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">The Four-Step Process</h2>

        <div className="space-y-6">
          <Step
            number="1"
            title="Take a check-in (3–8 minutes)"
            description="Choose one or more quick cognitive tests to establish your baseline."
            details={[
              "Executive function (focus + inhibition; Stroop task)",
              "Visual memory (short-term pattern recall)",
              "Reaction time (processing speed + consistency)",
              "Each test takes ~1–3 minutes and works on any device",
            ]}
          />

          <Step
            number="2"
            title="Get your snapshot instantly"
            description="Clear scores with plain-English context."
            details={[
              "Clear scores with plain-English context",
              "See where you fall vs age-based reference ranges (not a diagnosis)",
              "Identify your strongest and weakest domains",
            ]}
          />
        </div>
      </section>

      {/* Inline CTA after Step 2 */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Create free account to save your baseline</p>
          <Link
            href="/signup"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* Steps 3 & 4 */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <div className="space-y-6">
          <Step
            number="3"
            title="Choose ONE lever to test (2–4 weeks)"
            description="Pick one specific, measurable change."
            details={[
              "Sleep schedule",
              "Exercise routine",
              "Caffeine timing",
              "Stress management",
              "Change one variable at a time for clean cause-and-effect",
            ]}
          />

          <Step
            number="4"
            title="Repeat monthly & watch your trend"
            description="Re-test monthly at a similar time of day."
            details={[
              "Trends matter more than any single result",
              "With an account, your results build a personal trendline you can actually learn from",
            ]}
          />
        </div>
      </section>

      {/* What You Get With a Free Account */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">What you get with a free account</h2>
          <p className="mb-6 text-sm text-slate-600">Your results become a system</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="Baseline + trendline tracking"
              content="Track your results across all tests over time to see genuine patterns emerge."
            />
            <InfoCard
              title="Monthly check-in reminders"
              content="Get notified when it's time to re-test, helping you stay consistent without having to remember."
            />
            <InfoCard
              title="Notes on what you changed"
              content="Record what habits or interventions you've tried so you can correlate changes with performance."
            />
            <InfoCard
              title="Faster repeat testing"
              content="Your test setup is saved, making monthly check-ins quicker and more convenient."
            />
            <InfoCard
              title={
                <span className="flex flex-wrap items-center gap-2">
                  <span>Coaching + courses + community access</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Coming soon
                  </span>
                </span>
              }
              content="Unlock coaching prompts, structured lessons, and community support that turn data into action."
            />
          </div>
        </div>
      </section>

      {/* Course + Community */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Turn scores into progress</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Testing tells you &ldquo;what.&rdquo; Coaching prompts and mini-courses help you decide &ldquo;what to do next,&rdquo; and the community keeps you consistent.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Coaching + Courses + Community</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Coming soon
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Weekly coaching prompts and mini-courses: sleep, stress, training, nutrition, focus, recovery</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>&ldquo;One-change&rdquo; experiments and tracking templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Community discussions and support</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Accountability: monthly re-test cadence + challenges</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Create free account
              </Link>
              <Link
                href="/course"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
              >
                Explore the course
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Get cleaner data (so changes are real)</h2>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Test at a consistent time of day</h4>
            <p className="mt-1 text-sm text-slate-600">
              Cognitive performance varies throughout the day. Testing at the same time reduces variability and makes trends clearer.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Minimize distractions</h4>
            <p className="mt-1 text-sm text-slate-600">
              Quiet room, notifications off. Give yourself a minute to settle before starting.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Don&rsquo;t over-test</h4>
            <p className="mt-1 text-sm text-slate-600">
              Monthly is ideal to reduce practice effects. Testing too frequently makes it harder to see real changes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Focus on trends over 3–6 check-ins</h4>
            <p className="mt-1 text-sm text-slate-600">
              One score is a snapshot. A series of scores becomes a trendline—far more useful for understanding what actually works.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Change one thing at a time</h4>
            <p className="mt-1 text-sm text-slate-600">
              Test one intervention at a time for clearer insights into cause and effect.
            </p>
          </div>
        </div>
      </section>

      {/* Important Limitations */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Important: this is tracking, not diagnosis</h2>

          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-600">
              Prime State Health is a measurement and tracking tool. It does not diagnose cognitive impairment, dementia, ADHD, or any medical condition.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              If you&rsquo;re experiencing concerning symptoms or significant cognitive changes, consult a licensed healthcare professional.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Ready to establish your baseline?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with a free check-in now—then create an account to track your trend and unlock coaching, courses, and community.
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              Coming soon
            </span>
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Create free account
            </Link>
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
            >
              Try free check-in
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
