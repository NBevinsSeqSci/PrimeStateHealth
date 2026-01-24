import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTA_LABELS } from "@/lib/copy";

const pipelineSteps = [
  {
    title: "Triple quadrupole LC/MS",
    detail: "Triple quad instruments with polarity switching quantify core pathways like energy utilization, inflammatory response, and lipid remodeling.",
  },
  {
    title: "Knowledge graph scoring",
    detail: "Each metabolite is projected into our cognitive risk graph to quantify how it modulates vascular, metabolic, and neuroprotective domains.",
  },
  {
    title: "Clinical narrative",
    detail: "Findings are distilled into clear next steps with linked references and a shareable PDF for care teams.",
  },
];

const useCases = [
  {
    title: "Metabolic reserve",
    detail: "Track NAD+, glutathione, and short-chain fatty acid pathways that correlate with mitochondrial efficiency and cognitive stamina.",
  },
  {
    title: "Inflammation + vascular drift",
    detail: "Resolve subtle changes in eicosanoids and amino acid catabolites linked to microglial priming, sleep fragmentation, and vascular stiffness.",
  },
  {
    title: "Therapeutic monitoring",
    detail: "Measure before/after impact of GLP-1s, ketogenic protocols, or hormone therapy on systemic metabolism to personalize dosing.",
  },
];

export default function Metabolomics() {
  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center space-y-6">
          <Badge className="bg-cyan-500/20 text-cyan-200 uppercase tracking-[0.35em]">
            Metabolomics
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight text-white">
            Metabolomics + cognitive biomarkers in a single workflow
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl">
            Our targeted panel pairs deep LC/MS coverage with NeuroVantage&apos;s cognitive assessment
            to translate metabolic signals into practical care plans.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <Link href="/blood-testing/waitlist">{CTA_LABELS.joinWaitlist}</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 border-slate-600 text-white hover:bg-slate-900" asChild>
              <Link href="/blood-testing">{CTA_LABELS.backToBloodTesting}</Link>
            </Button>
            <Button variant="secondary" size="lg" className="px-8" asChild>
              <Link href="/blood-testing/metabolomics/example">{CTA_LABELS.viewSampleReport}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-slate-900/30">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-display text-white">From drop of blood to action</h2>
            <p className="text-slate-400">We manage end-to-end logistics, ensuring a simple experience for clinicians and patients.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pipelineSteps.map((step) => (
              <Card key={step.title} className="bg-slate-950/60 border-slate-800">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Clinical signals</p>
            <h2 className="text-3xl font-display text-white">Map metabolic drift before symptoms escalate</h2>
            <p className="text-slate-400">
              We benchmark each participant against age-matched cohorts to surface accelerating pathways and compensatory signals.
              Reports include suggested retest cadence, nutrition and lifestyle insights, and clinician-facing interpretation notes.
            </p>
            <div className="grid gap-4">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-6 rounded-[32px] bg-cyan-500/20 blur-3xl" />
            <div className="relative rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pilot study</p>
              <h3 className="text-2xl font-display text-white mt-3">Metabolomics x NeuroVantage Insight Layer</h3>
              <ul className="mt-6 space-y-4 text-slate-300 text-sm">
                <li>• 40 participant cohort launching Q1 2026.</li>
                <li>• Raw data access via secure API and clinician dashboard exports.</li>
                <li>• Integrated recommendations spanning metabolic, vascular, and lifestyle levers.</li>
              </ul>
              <Button className="mt-8 w-full" asChild>
                <Link href="/blood-testing/waitlist">{CTA_LABELS.reservePilotSlot}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
