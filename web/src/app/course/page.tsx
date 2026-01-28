import Link from "next/link";

export default function CoursePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
          Coming soon
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Course + Community
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Turn your test scores into actionable improvements. Weekly lessons on sleep, stress, nutrition, focus, and recovery—plus a community to keep you consistent.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Get early access</h2>
          <p className="mt-2 text-sm text-slate-600">
            Create a free account now to be notified when the course launches.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Create free account
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-slate-900">What to expect:</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Evidence-based strategies for cognitive health</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>One-change experiments to test what works for you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Monthly check-in accountability and challenges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Community support from others tracking their brain health</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
