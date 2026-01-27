import Link from "next/link";
import Image from "next/image";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
      {children}
    </span>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function TestCard({
  href,
  title,
  subtitle,
  meta,
}: {
  href: string;
  title: string;
  subtitle: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm",
        "transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
        </div>
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-hover:border-slate-300">
          →
        </span>
      </div>
      <div className="mt-4 text-xs text-slate-500">{meta}</div>
    </Link>
  );
}

export default function Page() {
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
          className="sm:hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Free testing</Pill>
              <Pill>No signup required</Pill>
              <Pill>3–6 minutes</Pill>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Know where you stand.
              <span className="block text-slate-600">Track your trend.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Measure attention, speed, and memory in minutes. See results instantly — then
              create an account only if you want to save and track progress over time.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/try"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Try free check-in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
              >
                Create account to track
              </Link>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Prime State Health is for measurement and trend tracking — not diagnosis or treatment.
              If you have concerns, talk with a licensed clinician.
            </p>
          </div>

          {/* Right panel: quick features */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Feature title="Fast baseline" desc="Get a snapshot today before guessing what to change." />
            <Feature title="See what works" desc="Trends reveal which habits actually move the needle." />
            <Feature title="Low friction" desc="No appointments. No equipment. Just your device." />
            <Feature title="Repeat monthly" desc="Consistent tests enable clean comparisons over time." />
          </div>
        </div>
      </section>

      {/* Tests */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Start with one test</h2>
            <p className="mt-1 text-sm text-slate-600">
              Pick what you want to measure today. Tip: test at a similar time of day for consistency.
            </p>
          </div>
          <Link href="/try" className="hidden text-sm font-semibold text-slate-700 hover:text-slate-900 sm:inline">
            View all →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TestCard
            href="/cognitive-test/executive"
            title="Executive function"
            subtitle="Stroop task (focus + inhibition)"
            meta="~2 minutes • attention + control"
          />
          <TestCard
            href="/cognitive-test/memory"
            title="Memory"
            subtitle="Short-term visual memory"
            meta="~2–3 minutes • recall"
          />
          <TestCard
            href="/cognitive-test/reaction-time"
            title="Reaction time"
            subtitle="Simple response speed"
            meta="~1–2 minutes • processing speed"
          />
        </div>
      </section>

      {/* How it works (simplified) */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Four steps. No fluff. The goal is a clean baseline and a simple way to measure change.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature title="1) Check in" desc="Complete a short task (or three)." />
            <Feature title="2) See your snapshot" desc="Clear score + simple context." />
            <Feature title="3) Pick one change" desc="Try one habit or intervention." />
            <Feature title="4) Repeat" desc="Watch your trend over time." />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Try free check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
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
            <Link className="hover:text-slate-700" href="/terms">Terms</Link>
            <Link className="hover:text-slate-700" href="/privacy">Privacy</Link>
            <Link className="hover:text-slate-700" href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
