import { useCallback } from "react";
import { Link } from "wouter";
import Screener from "@/pages/Screener";
import { CTA_LABELS } from "@/lib/copy";

export default function ClinicDemo() {
  const handleScrollToDemo = useCallback(() => {
    document.getElementById("demo-screener")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-10">
        <section className="text-center">
          <p className="text-xs tracking-[0.25em] text-emerald-500 text-center mb-3">
            CLINIC DEMO
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 text-center max-w-3xl mx-auto">
            Experience the NeuroVantage cognitive screener as your patients do.
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-600 text-center max-w-3xl mx-auto">
            Walk through a trimmed-down demo flow, see an example report, and understand how the full clinic version fits into your workflow.
          </p>
          <div className="flex flex-col items-center gap-2">
            <button
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800"
              onClick={handleScrollToDemo}
            >
              {CTA_LABELS.launchDemoScreener}
            </button>
            <Link href="/clinic/login">
              <a className="mt-2 block text-xs text-slate-500 hover:text-slate-700">
                Already a client? Go to Clinic Login →
              </a>
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              What you&apos;ll see in this demo
            </h3>
            <ul className="mt-2 space-y-2 text-xs md:text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Patient-facing screener with mood, attention, and speed tasks.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>An example report generated with fictitious data.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Approximate completion time: 2–3 minutes.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">
              What the full clinic version adds
            </h3>
            <ul className="mt-2 space-y-2 text-xs md:text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Clinic-branded setup (logo, colors, intake questions).</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Real patient data with longitudinal tracking and dashboards.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Lab panel and protocol mapping aligned with your offerings.</span>
              </li>
            </ul>
          </div>
        </section>

        <section
          id="demo-screener"
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm px-4 py-6 md:px-8 md:py-8 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Interactive Demo Screener
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                This demo uses sample data and does not store information. It is for demonstration only and is not medical advice.
              </p>
            </div>
            <div>
              <Screener />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
