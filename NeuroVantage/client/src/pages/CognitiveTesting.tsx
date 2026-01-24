import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import { TrackedLink } from "@/components/TrackedLink";
import { CTA_LABELS } from "@/lib/copy";
import { CTA } from "@/lib/cta";

const HERO_BULLETS = [
  "Turn brain fog, fatigue, and low motivation into structured domains.",
  "Layer cognitive and symptom data with hormones, sleep, and metabolic markers.",
  "Deliver clinic-branded summaries with clear talking points.",
];

const WHY_CLINICS_BULLETS = [
  "Turn vague symptoms into measurable domains.",
  "Increase visit-to-plan conversion with objective baselines.",
  "Improve retention with longitudinal progress tracking patients understand.",
  "Differentiate your clinic beyond labs and symptom checklists.",
];

const WORKFLOW_STEPS = [
  {
    title: "Online screener",
    body: "Patients complete a brief screener from your website or a QR code, with basic history and mood/attention questions and clinic opt-in.",
  },
  {
    title: "In-clinic full test",
    body: "Patients complete the full battery during intake or before the clinician enters. Self-administered on tablet or computer with on-screen guidance.",
  },
  {
    title: "Actionable report",
    body: "Clinicians receive a structured summary with symptom scores, cognitive domains, and next-step prompts.",
  },
];

const WHO_WE_ARE_POINTS = [
  "Background in clinical pathology and cognitive neuroscience",
  "Experience running CLIA / CAP-accredited laboratories",
  "Focus on clinic-friendly tools, not research-only prototypes",
];

export default function CognitiveTesting() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Solutions • Cognitive Testing</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
              Quantify Brain Fog, Fatigue, and Focus—In Minutes
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              NeuroVantage turns subjective complaints into objective, trackable brain-health metrics your
              clinic can use to anchor care plans and show improvement over time.
            </p>
            <p className="text-xs md:text-sm text-slate-500">
              Designed for hormone/TRT clinics, med spas, longevity practices, and functional medicine.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-display font-semibold text-slate-900">Why clinics use cognitive testing</h2>
            <ul className="space-y-2">
              {WHY_CLINICS_BULLETS.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="space-y-3">
            {HERO_BULLETS.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <TrackedLink href={CTA.primary.href} cta="try_free_screener" location="cognitive_testing">
              <Button size="lg">{CTA.primary.label}</Button>
            </TrackedLink>
            <TrackedLink
              href="/sample-report"
              cta="view_sample_report"
              location="cognitive_testing"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {CTA_LABELS.viewSampleReport}
            </TrackedLink>
            <TrackedLink
              href="/full-assessment"
              cta="access_full_test"
              location="cognitive_testing"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {CTA_LABELS.accessFullTest}
            </TrackedLink>
          </div>
          <p className="text-xs text-slate-500">
            Runs in a browser • No special hardware • Self-administered with on-screen guidance • Typical completion: 10-20 minutes (full test)
          </p>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-primary">
              Turn vague symptoms into measurable signals
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Brain fog, fatigue, and low motivation are real but hard to track with labs alone.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Cognitive testing converts complaints into measurable domains like attention and memory.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Objective scores create a baseline before treatment changes.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Repeat testing shows directional change over time.</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-primary">Built for Repeat Measurement</h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Tests are brief and repeatable, making follow-ups practical.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Results are shown as clear trends, not one-time snapshots.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Clinics can monitor response to hormones, sleep, and lifestyle changes.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Visible progress supports follow-up cadence and retention.</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-6">
          <h2 className="text-2xl font-display font-bold text-primary">How it fits into your workflow</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </span>
                  {step.title}
                </div>
                <p className="text-sm text-slate-700">{step.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="px-2">
          <Link href={CTA.secondary.href} className="text-sm font-semibold text-primary hover:underline">
            {CTA.secondary.label} →
          </Link>
        </div>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-5">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-primary">Validated Testing</h2>
            <p className="text-sm font-semibold text-slate-900">
              <strong>Evidence-informed, clinic-ready assessments</strong>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 leading-relaxed">
              <li>
                Built on <strong>core elements of widely used instruments</strong> such as PHQ-style mood scales and
                GAD-style anxiety screeners.
              </li>
              <li>
                Uses established paradigms for <strong>attention, processing speed, executive function, and memory</strong>{" "}
                (e.g., reaction time, set-shifting, inhibition, span, and recall).
              </li>
              <li>
                Adapted for <strong>wellness and hormone clinics</strong>, without requiring neuropsychological training or
                billing.
              </li>
              <li>
                <strong>Scoring and cut points</strong> are aligned with commonly used instruments where applicable.
              </li>
            </ul>
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="validated-testing-references" className="border-slate-200">
                <AccordionTrigger className="text-slate-800">
                  References
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/11556941/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>J Gen Intern Med</em>. 2001;16(9):606-613. PMID: 11556941.
                      </p>
                      <p className="text-xs text-slate-500">PHQ-9 is a validated depression severity measure with defined scoring bands.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/16717171/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Spitzer RL, Kroenke K, Williams JB, Lowe B. A brief measure for assessing generalized anxiety disorder: the GAD-7.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Arch Intern Med</em>. 2006;166(10):1092-1097. PMID: 16717171.
                      </p>
                      <p className="text-xs text-slate-500">Validated anxiety screener with clear severity cut points.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/28446889/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Scarpina F, Tagini S. The Stroop Color and Word Test.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Front Psychol</em>. 2017;8:557. doi:10.3389/fpsyg.2017.00557. PMID: 28446889.
                      </p>
                      <p className="text-xs text-slate-500">Classic inhibition/interference paradigm used in neuropsych assessment.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/10674802/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Salthouse TA, Fristoe NM, McGuthry KE, Hambrick DZ. Effects of aging on efficiency of task switching in a variant of the Trail Making Test.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Neuropsychology</em>. 2000;14(1):102-111. PMID: 10674802.
                      </p>
                      <p className="text-xs text-slate-500">Trail Making variants reflect switching and executive processes.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/30124583/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Jaeger J. Digit Symbol Substitution Test: The Case for Sensitivity Over Specificity in Neuropsychological Testing.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>J Clin Psychopharmacol</em>. 2018;38(5):513-519. doi:10.1097/JCP.0000000000000941. PMID: 30124583.
                      </p>
                      <p className="text-xs text-slate-500">Widely used processing-speed measure suitable for brief clinical tracking.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/25910198/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Egeland J. Measuring Working Memory With Digit Span and the Letter-Number Sequencing Subtests From the WAIS-IV.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Appl Neuropsychol Adult</em>. 2015;22(6):445-451. doi:10.1080/23279095.2014.992069. PMID: 25910198.
                      </p>
                      <p className="text-xs text-slate-500">Standard paradigm for attention span and working memory.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/10726605/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Shapiro AM, Benedict RHB, Schretlen D, Brandt J. Construct and concurrent validity of the Hopkins Verbal Learning Test-Revised.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Clin Neuropsychol</em>. 1999;13(3):348-358. PMID: 10726605.
                      </p>
                      <p className="text-xs text-slate-500">Validated measure of verbal learning and memory, including recall and recognition.</p>
                    </li>
                    <li>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/16594792/"
                        className="font-semibold text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Der G, Deary IJ. Age and sex differences in reaction time in adulthood.
                      </a>
                      <p className="text-xs text-slate-600">
                        <em>Psychol Aging</em>. 2006;21(1):62-73. PMID: 16594792.
                      </p>
                      <p className="text-xs text-slate-500">Reaction time norms help contextualize processing-speed measures.</p>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="text-xs text-muted-foreground">
              NeuroVantage is not a diagnostic tool and does not replace formal neuropsychological testing.
            </p>
          </div>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary">Aligned with Clinical Trial Endpoints</h2>
          <p className="text-sm font-semibold text-slate-900">
            <strong>Measuring domains used in brain-health research</strong>
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 leading-relaxed">
            <li>
              Tracks domains commonly reported in <strong>neurology, psychiatry, and Alzheimer’s research</strong>,
              including mood, anxiety, attention, processing speed, memory, and executive function.
            </li>
            <li>
              Draws on task structures similar to <strong>PHQ-, GAD-, Trails-, Stroop-, and list-learning paradigms</strong>.
            </li>
            <li>
              Enables clinics to use a <strong>shared language</strong> across wellness care, specialty care, and research.
            </li>
            <li>
              Supports <strong>longitudinal monitoring and pre-screening context</strong>, not trial eligibility or outcomes.
            </li>
          </ul>
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="aligned-trial-endpoints-references" className="border-slate-200">
              <AccordionTrigger className="text-slate-800">
                References
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/24886908/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Donohue MC, Sperling RA, Salmon DP, et al. The preclinical Alzheimer cognitive composite: measuring amyloid-related decline.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>JAMA Neurol</em>. 2014;71(8):961-970. doi:10.1001/jamaneurol.2014.803. PMID: 24886908.
                    </p>
                    <p className="text-xs text-slate-500">
                      Preclinical AD trial endpoint spanning episodic memory, timed executive function/processing speed, and global cognition.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/27713359/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Cummings J, et al. Measurement of neuropsychiatric symptoms in clinical trials targeting Alzheimer’s disease and related disorders.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>Pharmaceuticals (Basel)</em>. 2010;3(8):2387-2397. PMID: 27713359.
                    </p>
                    <p className="text-xs text-slate-500">
                      Describes use of NPI and related measures for mood, anxiety, and behavioral endpoints in trials.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/21889116/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Lyketsos CG, et al. Neuropsychiatric symptoms in Alzheimer’s disease.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>Alzheimers Dement</em>. 2011;7(5):532-539. doi:10.1016/j.jalz.2011.05.2410. PMID: 21889116.
                    </p>
                    <p className="text-xs text-slate-500">
                      Background on depression, anxiety, and other neuropsychiatric domains across the AD continuum.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/11556941/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>J Gen Intern Med</em>. 2001;16(9):606-613. PMID: 11556941.
                    </p>
                    <p className="text-xs text-slate-500">
                      Widely used mood severity screener in clinical care and research.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/16717171/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Spitzer RL, Kroenke K, Williams JB, Lowe B. A brief measure for assessing generalized anxiety disorder: the GAD-7.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>Arch Intern Med</em>. 2006;166(10):1092-1097. PMID: 16717171.
                    </p>
                    <p className="text-xs text-slate-500">
                      Widely used anxiety screener with established scoring.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/29213956/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Moreira HS, Costa AS, Castro SL, Lima CF, Vicente SG. The most frequently used tests for assessing executive functions in aging.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>Dement Neuropsychol</em>. 2015;9(2):149-155. doi:10.1590/1980-57642015DN92000009. PMID: 29213956.
                    </p>
                    <p className="text-xs text-slate-500">
                      Highlights Trails, Stroop, and verbal fluency as common executive-function measures.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/10726605/"
                      className="font-semibold text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Shapiro AM, Benedict RHB, Schretlen D, Brandt J. Construct and concurrent validity of the Hopkins Verbal Learning Test-Revised.
                    </a>
                    <p className="text-xs text-slate-600">
                      <em>Clin Neuropsychol</em>. 1999;13(3):348-358. PMID: 10726605.
                    </p>
                    <p className="text-xs text-slate-500">
                      Validated list-learning and recall paradigm used in older adults and dementia contexts.
                    </p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-xs text-slate-600">
            NeuroVantage is not a clinical trial instrument and does not determine eligibility, outcomes, or diagnoses.
          </p>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-4">
          <h2 className="text-2xl font-display font-bold text-primary">Who we are</h2>
          <p className="text-sm text-muted-foreground">
            NeuroVantage is built by a small team with experience in clinical pathology, cognitive neuroscience,
            and running regulated laboratory operations. We focus on pragmatic, clinic-friendly tools that
            translate research-grade thinking into day-to-day workflows.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            {WHO_WE_ARE_POINTS.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-4 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-primary">Ready to see it in your clinic?</h2>
            <p className="text-sm text-muted-foreground">
              Invite us into your workflow and learn how NeuroVantage can complement labs, hormone replacement,
              weight-loss programs, and longevity protocols.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <TrackedLink href={CTA.primary.href} cta="try_free_screener" location="cognitive_testing">
              <Button size="lg">{CTA.primary.label}</Button>
            </TrackedLink>
          </div>
        </Card>
      </div>
    </div>
  );
}
