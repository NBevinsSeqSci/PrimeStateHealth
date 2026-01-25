import Link from "next/link";

export const metadata = {
  title: "Free Check-in | Prime State Health",
  description: "Get a quick Brain Clarity Snapshot in 3–6 minutes and track your trend over time.",
};

export default function TryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        {/* Left: Hero copy */}
        <div>
          <p className="text-sm font-medium opacity-70">Free check-in</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Get a quick <span className="whitespace-nowrap">Brain Clarity Snapshot</span> (3–6 minutes)
          </h1>
          <p className="mt-4 text-base leading-relaxed opacity-80">
            A short set of science-based tasks that estimate <strong>attention</strong>, <strong>speed</strong>, and{" "}
            <strong>memory</strong>—then gives you a simple score you can track over time.
          </p>

          <ul className="mt-6 space-y-3 text-sm opacity-85">
            <li className="flex gap-2">
              <span aria-hidden="true">✓</span>
              <span>
                Works best on a <strong>laptop/desktop</strong> in a quiet spot
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">✓</span>
              <span>Repeat monthly to see your trend</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">✓</span>
              <span>Simple results, no jargon</span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <p className="text-sm font-medium opacity-80">Pick a test (no signup required):</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/cognitive-test/executive"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium shadow-sm"
              >
                Executive function
              </Link>
              <Link
                href="/cognitive-test/memory"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium shadow-sm"
              >
                Memory
              </Link>
              <Link
                href="/cognitive-test/reaction-time"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium shadow-sm"
              >
                Reaction time
              </Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium opacity-90"
              >
                Create account to save results
              </Link>
              <span className="text-xs opacity-65">
                (Optional — you can take any test and see results without signing up.)
              </span>
            </div>
          </div>

          <p className="mt-6 rounded-2xl border p-4 text-xs leading-relaxed opacity-75">
            <strong>Important:</strong> This is not medical advice, diagnosis, or treatment. If you’re worried about
            symptoms, talk with a licensed clinician. If you think you may be having an emergency, call 911.
          </p>
        </div>

        {/* Right: “How it works” card */}
        <aside className="rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">How it works</h2>
          <p className="mt-2 text-sm opacity-80">Take one quick test and get an immediate result.</p>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm font-semibold">Executive function (Stroop)</p>
              <p className="mt-1 text-sm opacity-80">Measures focus + inhibition (classic color-word interference).</p>
              <Link
                href="/cognitive-test/executive"
                className="mt-3 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Start Stroop
              </Link>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm font-semibold">Memory</p>
              <p className="mt-1 text-sm opacity-80">Measures short-term visual memory with a simple game-like task.</p>
              <Link
                href="/cognitive-test/memory"
                className="mt-3 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Start Memory
              </Link>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm font-semibold">Reaction time</p>
              <p className="mt-1 text-sm opacity-80">Measures simple response speed (best on laptop/desktop).</p>
              <Link
                href="/cognitive-test/reaction-time"
                className="mt-3 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Start Reaction
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-xs opacity-70">
            Tip: For the most consistent results, try to take the check-in at a similar time of day each month.
          </div>
        </aside>
      </section>
    </main>
  );
}
