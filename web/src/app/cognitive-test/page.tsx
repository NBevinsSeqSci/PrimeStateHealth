import Link from "next/link";
import CognitiveTestForm from "@/components/site/CognitiveTestForm";

export default function CognitiveTestPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
            Brain check-in
          </p>
          <h1 className="text-4xl font-semibold text-ink-900">Brain check-in</h1>
          <p className="text-lg text-ink-600">
            Take your time. Go as fast as you comfortably can while staying
            accurate.
          </p>
          <p className="text-sm text-ink-500">
            Tip: Close other tabs and silence notifications for the cleanest
            results.
          </p>
        </div>
        <CognitiveTestForm />
      </div>

      <section className="mt-12 rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink-900">Choose a test</h2>
        <p className="mt-2 text-sm text-ink-500">
          Pick one module. You will get a simple score at the end. Most people
          start with Reaction Time.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link
            href="/cognitive-test/reaction-time"
            className="rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300"
          >
            <div className="font-semibold text-ink-900">Reaction Time</div>
            <div className="mt-1 text-sm text-ink-600">
              Speed and consistency. Quick baseline.
            </div>
          </Link>

          <Link
            href="/cognitive-test/executive-function"
            className="rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300"
          >
            <div className="font-semibold text-ink-900">Executive Function</div>
            <div className="mt-1 text-sm text-ink-600">
              Inhibition and control (Stroop-style).
            </div>
          </Link>

          <Link
            href="/cognitive-test/visual-memory"
            className="rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-brand-300"
          >
            <div className="font-semibold text-ink-900">Visual Memory</div>
            <div className="mt-1 text-sm text-ink-600">
              Short-term memory for patterns.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
