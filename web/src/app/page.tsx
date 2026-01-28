import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Prime State Health — At-home brain check-ins",
  description: "Measure attention, speed, and memory in 3–6 minutes. See results instantly. Create an account to track trends over time.",
  openGraph: {
    title: "Prime State Health — At-home brain check-ins",
    description: "Measure attention, speed, and memory in 3–6 minutes. See results instantly. Create an account to track trends over time.",
    url: "https://primestatehealth.com",
    siteName: "Prime State Health",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prime State Health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime State Health — At-home brain check-ins",
    description: "Measure attention, speed, and memory in 3–6 minutes. See results instantly. Create an account to track trends over time.",
    images: ["/og-image.png"],
  },
};

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

function CheckInCard({
  href,
  title,
  subtitle,
  meta,
  eventName,
}: {
  href: string;
  title: string;
  subtitle: string;
  meta: string;
  eventName: string;
}) {
  return (
    <Link
      href={href}
      data-psh-event={eventName}
      className={cn(
        "group relative block rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm",
        "transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
      )}
      aria-label={`Start ${title} check-in`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
        </div>
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-hover:border-slate-300" aria-hidden="true">
          →
        </span>
      </div>
      <div className="mt-4 text-xs text-slate-500">{meta}</div>
    </Link>
  );
}

function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{question}</h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{answer}</div>
    </div>
  );
}

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this a medical diagnosis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Prime State Health is for measurement and trend tracking only — not diagnosis or treatment. If you have concerns about your cognitive health, talk with a licensed clinician."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "3–6 minutes total. Each brain check-in task takes approximately 1–3 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "What affects my score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Many factors can affect your score including sleep quality, stress levels, caffeine intake, time of day, distractions in your environment, and the device you're using."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, you don't need an account to take a free brain check-in and see your results. However, creating an account lets you save your history and track trends over time."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Your data is private and secure. We use industry-standard encryption and never share your personal information without your explicit consent. See our Privacy Policy for full details."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 rounded-lg">
            <div className="flex h-9 w-9 items-center justify-center">
              <Image
                src="/logo.png"
                alt="Prime State Health logo"
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

          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex" aria-label="Main navigation">
              <Link
                className="transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 rounded"
                href="/how-it-works"
                data-psh-event="nav_how_it_works"
              >
                How it works
              </Link>
              <Link
                className="transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 rounded"
                href="/try"
                data-psh-event="nav_try_free"
              >
                Try free check-in
              </Link>
            </nav>

            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                data-psh-event="nav_login"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                data-psh-event="cta_create_account_nav"
              >
                Create account
              </Link>
            </div>
          </div>

          <Link
            href="/signup"
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 sm:hidden"
            data-psh-event="cta_create_account_mobile"
          >
            Create account
          </Link>
        </header>

        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill>Free check-in</Pill>
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
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                  data-psh-event="cta_try_free"
                >
                  Take a free brain check-in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                  data-psh-event="cta_create_account"
                >
                  Create account to track
                </Link>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                For measurement and trend tracking — not diagnosis or treatment.{" "}
                <Link href="/how-it-works" className="underline hover:text-slate-700">
                  Learn more
                </Link>
              </p>
            </div>

            {/* Right panel: quick features */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Feature title="Fast baseline" desc="Get a snapshot today before guessing what to change." />
              <Feature title="See what works" desc="Trends reveal which habits actually move the needle." />
              <Feature title="Low friction" desc="No appointments. No equipment. Just your device." />
              <Feature title="Repeat monthly" desc="Consistent check-ins enable clean comparisons over time." />
            </div>
          </div>
        </section>

        {/* What you'll see */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">What you'll see</h2>
            <p className="mt-2 text-sm text-slate-600">
              Each brain check-in gives you clear, actionable information:
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Your snapshot score (today)</div>
                    <div className="text-sm text-slate-600">See your performance right now</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Simple context</div>
                    <div className="text-sm text-slate-600">What factors can affect your score</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">A trend line over time</div>
                    <div className="text-sm text-slate-600">Track progress with an account</div>
                  </div>
                </div>
              </div>

              {/* Preview card */}
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Preview</div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">Executive function</div>
                      <div className="text-2xl font-bold text-slate-900">72</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      Compared to last month: <span className="font-semibold text-emerald-600">+4</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    * Example only. Your actual results will vary.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Check-ins */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Quick brain check-ins</h2>
              <p className="mt-1 text-sm text-slate-600">
                Pick what you want to measure today. Each takes just a few minutes.
              </p>
            </div>
            <Link
              href="/try"
              className="hidden text-sm font-semibold text-slate-700 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 rounded sm:inline"
              data-psh-event="view_all_checkins"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <CheckInCard
              href="/cognitive-test/executive"
              title="Executive function"
              subtitle="Stroop task (focus + inhibition)"
              meta="~2 minutes • attention + control"
              eventName="test_card_executive"
            />
            <CheckInCard
              href="/cognitive-test/memory"
              title="Memory"
              subtitle="Short-term visual memory"
              meta="~2–3 minutes • recall"
              eventName="test_card_memory"
            />
            <CheckInCard
              href="/cognitive-test/reaction-time"
              title="Reaction time"
              subtitle="Simple response speed"
              meta="~1–2 minutes • processing speed"
              eventName="test_card_reaction"
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
              <Feature title="1) Check in" desc="Complete a quick brain check-in task." />
              <Feature title="2) See your snapshot" desc="Clear score + simple context." />
              <Feature title="3) Pick one change" desc="Try one habit or intervention." />
              <Feature title="4) Repeat" desc="Watch your trend over time." />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
            <p className="mt-2 text-sm text-slate-600">
              Common questions about brain check-ins and how Prime State Health works.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <FAQItem
              question="Is this a medical diagnosis?"
              answer={
                <>
                  No. Prime State Health is for measurement and trend tracking only — not diagnosis or treatment.
                  If you have concerns about your cognitive health, talk with a licensed clinician.
                </>
              }
            />
            <FAQItem
              question="How long does it take?"
              answer="3–6 minutes total. Each brain check-in task takes approximately 1–3 minutes."
            />
            <FAQItem
              question="What affects my score?"
              answer="Many factors can affect your score including sleep quality, stress levels, caffeine intake, time of day, distractions in your environment, and the device you're using."
            />
            <FAQItem
              question="Do I need an account?"
              answer="No, you don't need an account to take a free brain check-in and see your results. However, creating an account lets you save your history and track trends over time."
            />
            <FAQItem
              question="Is my data private?"
              answer={
                <>
                  Yes. Your data is private and secure. We use industry-standard encryption and never share
                  your personal information without your explicit consent.{" "}
                  <Link href="/privacy" className="font-medium text-slate-900 underline hover:text-slate-700">
                    See our Privacy Policy
                  </Link>{" "}
                  for full details.
                </>
              }
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Ready to get started?</h2>
              <p className="mt-2 text-base text-slate-600">
                Take your first brain check-in now. No signup required.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                  data-psh-event="cta_try_free_footer"
                >
                  Take a free brain check-in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2"
                  data-psh-event="cta_create_account_footer"
                >
                  Create account to track
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                For measurement and trend tracking — not diagnosis or treatment.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
