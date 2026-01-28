import React from "react";

type RefLink = { label: string; href: string };

const refs: RefLink[] = [
  {
    label:
      "FDA (2024) — Early Alzheimer's Disease: Developing Drugs for Treatment (Guidance for Industry)",
    href: "https://www.fda.gov/media/110903/download",
  },
  {
    label: "NIH Toolbox — Cognition Assessments (overview)",
    href: "https://nihtoolbox.org/domain/cognition/",
  },
  {
    label:
      "NIH Toolbox Cognition Battery (peer-reviewed overview; Tulsky et al., 2013, PMC)",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4427028/",
  },
  {
    label:
      "NIH Toolbox Pattern Comparison Processing Speed Test (Carlozzi et al., 2014, PMC)",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4424947/",
  },
  {
    label:
      "Digit Symbol Substitution Test (DSST) — sensitivity & utility review (Jaeger, 2018, PMC)",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6291255/",
  },
];

export function ClinicalTrialAlignment() {
  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">
          How our modalities align with clinical trial endpoints
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Cognitive outcomes in clinical trials are typically captured using{" "}
          <span className="font-medium text-slate-900">Clinical Outcome Assessments (COAs)</span>{" "}
          that quantify change over time in core domains—processing speed, attention, executive
          control, and memory. PrimeState&apos;s short digital tasks are designed to map cleanly onto
          these domains so you can track trends with low friction.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-sm font-semibold text-slate-900">Executive function</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
              <li>
                Inhibition &amp; cognitive control (e.g., Stroop-like interference paradigms)
              </li>
              <li>Often represented in trial batteries alongside attention and flexibility tasks</li>
              <li>
                Useful for monitoring &ldquo;mental control&rdquo; changes that can affect real-world function
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-sm font-semibold text-slate-900">Processing speed / reaction time</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
              <li>
                Closely related to common endpoints like DSST-style measures and NIH Toolbox
                processing speed tests
              </li>
              <li>Highly sensitive to fatigue, medication effects, and longitudinal change</li>
              <li>Easy to repeat frequently, making it practical for trend tracking</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-sm font-semibold text-slate-900">Memory</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
              <li>Episodic / short-term visual memory tasks support &ldquo;memory domain&rdquo; tracking</li>
              <li>
                Memory is a central domain in many neurodegenerative and neuropsychiatric trial
                outcomes
              </li>
              <li>
                Repeated brief check-ins can complement longer formal batteries used in trials
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="text-sm font-semibold text-slate-900">Important context</div>
          <p className="mt-2 text-sm text-slate-600">
            PrimeState is for tracking and education—{" "}
            <span className="font-medium text-slate-900">not</span> diagnosis or treatment. While
            our tasks are designed to align with domains measured by common trial COAs, your results
            should be interpreted in context (sleep, stress, illness, medications, practice effects).
            For clinical concerns, discuss trends with a licensed clinician.
          </p>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-slate-900">References</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {refs.map((r) => (
              <li key={r.href}>
                <a
                  className="underline underline-offset-2 hover:text-slate-900"
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
