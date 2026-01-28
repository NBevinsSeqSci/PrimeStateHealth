import Link from "next/link";

export const metadata = {
  title: "Getting Better | Prime State Health",
  description: "Evidence-based strategies to improve cognitive performance and brain health.",
};

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

export default function GettingBetterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Evidence-based strategies
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Getting Better
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Evidence-based strategies to support cognitive performance and brain health. Test what works for you.
          </p>
        </div>
      </section>

      {/* Key Lifestyle Factors */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Key lifestyle factors</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TipCard
            title="Sleep (7–9 hours)"
            description="Consistent sleep schedule supports memory consolidation and attention. Poor sleep impairs cognitive performance more than most people realize."
          />
          <TipCard
            title="Exercise (150 min/week)"
            description="Aerobic exercise increases blood flow to the brain and promotes neuroplasticity. Even walking counts."
          />
          <TipCard
            title="Nutrition"
            description="Mediterranean-style diet with omega-3s, antioxidants, and minimal processed foods supports brain health over time."
          />
          <TipCard
            title="Stress management"
            description="Chronic stress impairs memory and executive function. Regular breaks, meditation, or simple breathing exercises help."
          />
          <TipCard
            title="Social connection"
            description="Regular social interaction is linked to better cognitive outcomes and slower decline with aging."
          />
          <TipCard
            title="Mental stimulation"
            description="Learning new skills, reading, puzzles—activities that challenge your brain can help maintain cognitive function."
          />
        </div>
      </section>

      {/* Test What Works */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-slate-900">Test what works for you</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Everyone is different. Use Prime State Health to establish your baseline, then test one change at a time:
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">1) Get baseline</div>
              <div className="mt-1 text-sm text-slate-600">Take a test to know where you stand today.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">2) Pick one thing</div>
              <div className="mt-1 text-sm text-slate-600">Choose one factor to improve (e.g., sleep schedule).</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">3) Track 2–4 weeks</div>
              <div className="mt-1 text-sm text-slate-600">Give the change time to show an effect.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">4) Re-test</div>
              <div className="mt-1 text-sm text-slate-600">See if the change actually moved the needle.</div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Ready to get your baseline?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Take a free cognitive test to see where you stand today.
                </p>
              </div>
              <Link
                href="/try"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Try free check-in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold">Not medical advice</p>
              <p className="mt-1 text-amber-800">
                This information is for educational purposes only. It is not medical advice, diagnosis, or treatment.
                If you have concerns about your health or cognitive function, consult a licensed healthcare professional.
              </p>
            </div>
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
