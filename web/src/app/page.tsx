import Link from "next/link";

const howItWorks = [
  { n: "01", title: "Check in", body: "Complete a short set of tasks." },
  { n: "02", title: "See your snapshot", body: "Get clear scores and context." },
  { n: "03", title: "Pick one change", body: "Choose a simple next step." },
  { n: "04", title: "Repeat monthly", body: "Watch your trendline over time." },
];

const whyPeopleUseIt = [
  { title: "Get a baseline fast", body: "Know how you're doing today." },
  { title: "See what's working", body: "Keep the habits that move the trend." },
  { title: "Stay consistent", body: "Same check-in, month to month." },
  { title: "Low friction", body: "No appointments. No equipment." },
];

const faqs = [
  {
    question: "Is this a medical diagnosis?",
    answer:
      "No. It's a measurement and tracking tool. If you're worried about symptoms, talk with a licensed clinician.",
  },
  {
    question: "How often should I do it?",
    answer:
      "Monthly works well for most people. If you're testing a change, you can recheck weekly for a short stretch.",
  },
  {
    question: "Is my data private?",
    answer:
      "You control your account and results. We aim for privacy-first defaults and minimal data needed to run the service.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-sm opacity-80">
            <span className="font-semibold">Prime State Health</span>
            <span className="opacity-60">•</span>
            <span className="opacity-70">At-home brain check-ins</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Know where you stand.
            <br />
            Track your trend.
          </h1>

          <p className="max-w-2xl text-lg opacity-85 md:text-xl">
            Measure attention, speed, and memory in minutes, then follow your progress over time.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-medium text-white"
            >
              Try the free check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-5 py-3 font-medium"
            >
              Get started
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm opacity-70">
            <span>3-6 minutes</span>
            <span>•</span>
            <span>No equipment</span>
            <span>•</span>
            <span>Do it anywhere</span>
          </div>

          <p className="max-w-3xl text-xs opacity-60">
            Prime State Health is for measurement and trend tracking - not
            diagnosis or treatment. If you have concerns, talk with a licensed
            clinician.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl border-t border-black/5 px-6 py-10"
      >
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {howItWorks.map((step) => (
            <div key={step.n} className="rounded-2xl border border-black/10 p-5">
              <div className="text-xs opacity-60">{step.n}</div>
              <div className="mt-2 font-semibold">{step.title}</div>
              <div className="mt-1 text-sm opacity-80">{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="why"
        className="mx-auto max-w-6xl border-t border-black/5 px-6 py-10"
      >
        <h2 className="text-2xl font-semibold">Why PrimeState</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {whyPeopleUseIt.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-black/10 p-5">
              <div className="font-semibold">{reason.title}</div>
              <div className="mt-1 text-sm opacity-80">{reason.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black/5 px-6 py-10">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-5 grid gap-4">
          {faqs.map((item) => (
            <details key={item.question} className="rounded-2xl border border-black/10 p-5">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-2 text-sm opacity-80">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black/5 px-6 py-14">
        <div className="rounded-3xl border border-black/10 p-8 md:p-10">
          <h3 className="text-2xl font-semibold md:text-3xl">
            Get your baseline in under 6 minutes.
          </h3>
          <p className="mt-3 max-w-2xl text-base opacity-85 md:text-lg">
            Take the free check-in today and track your trend over time.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/try"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-medium text-white"
            >
              Try free check-in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-5 py-3 font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
