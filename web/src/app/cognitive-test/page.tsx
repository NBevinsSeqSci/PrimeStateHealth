import Link from "next/link";

export default function CognitiveTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Free Brain Check-in
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Choose your cognitive test
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Pick one test to measure attention, speed, or memory. Each takes just a few minutes and gives you a score you can track over time.
          </p>

          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">For best results</p>
              <p className="mt-1 text-blue-800">Find a quiet spot, close other tabs, and silence notifications before starting.</p>
            </div>
          </div>
        </div>

        {/* Test Cards */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Available tests</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Free • No signup required
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/cognitive-test/reaction-time"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-slate-200">
                  →
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Reaction Time</h3>
              <p className="mt-1 text-sm text-slate-600">
                Measures processing speed and response consistency
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~1–2 minutes
              </div>
            </Link>

            <Link
              href="/cognitive-test/executive-function"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 ring-1 ring-inset ring-purple-600/10">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-slate-200">
                  →
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Executive Function</h3>
              <p className="mt-1 text-sm text-slate-600">
                Tests focus and inhibition control (Stroop task)
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~2 minutes
              </div>
            </Link>

            <Link
              href="/cognitive-test/visual-memory"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-slate-200">
                  →
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Visual Memory</h3>
              <p className="mt-1 text-sm text-slate-600">
                Measures short-term memory for patterns
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~2–3 minutes
              </div>
            </Link>
          </div>
        </section>

        {/* Account CTA */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Want to track your progress?</p>
              <p className="mt-1 text-sm text-slate-600">
                Create a free account to save results, see population comparisons, and track changes over time.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          These tests are for tracking your baseline and trend — not for diagnosis or treatment.
          If you have concerns, talk with a licensed clinician.
        </p>
      </div>
    </div>
  );
}
