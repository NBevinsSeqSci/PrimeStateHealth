import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Users, FileSpreadsheet, LineChart, Brain, TestTube } from "lucide-react";
import { InlineCTALink, PrimaryCTAButton } from "@/components/cta";
import { Link } from "wouter";
import { TrackedLink } from "@/components/TrackedLink";
import { CognitiveVsTestosteroneMiniChart } from "@/components/marketing/CognitiveVsTestosteroneMiniChart";
import { QualificationBlock } from "@/components/QualificationBlock";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingSection } from "@/components/MarketingSection";
import { CTA_LABELS } from "@/lib/copy";
import { CTA } from "@/lib/cta";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const reduceMotion = prefersReducedMotion || isMobile;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Brain size={16} />
                <span>Workflow Integration</span>
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6">
                How NeuroVantage works
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Attract patients, standardize assessment, and connect existing treatments to measurable brain outcomes.
              </p>
            </motion.div>
            <QualificationBlock className="mt-6" />
          </div>
        </div>
      </section>

      {/* Why clinics adopt NeuroVantage */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold text-primary">
              Why clinics adopt NeuroVantage
            </h2>
            <p className="mt-2 max-w-3xl text-muted-foreground text-base leading-relaxed">
              Turn objective brain data into revenue and retention with clearer, trackable care plans.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Increase visit-to-plan conversion with objective data</CardTitle>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Improve retention through visible progress tracking</CardTitle>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Justify ongoing hormone, wellness, and longevity programs</CardTitle>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Differentiate beyond labs and symptom checklists</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-20">
            
            {/* Step 1: Lead Gen */}
            <motion.div 
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1 max-w-xl">
                <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                  <Users size={24} />
                </div>
                <MarketingSection
                  title="1. Turn screeners into booked visits"
                  titleAs="h2"
                  titleClassName="text-3xl font-display font-bold text-primary"
                  subtitle="Add a white-labeled screener to your website. Patients finish in about 3 minutes and send you a ready-to-book lead."
                  bullets={[
                    "Patient-friendly summary they can download or email.",
                    "Captures contact info and consent for follow-up.",
                    "Highlights higher-risk patterns for faster outreach.",
                    "White-labeled to match your brand.",
                  ]}
                  subtitleClassName="text-lg text-muted-foreground leading-relaxed text-left"
                  listClassName="text-sm text-slate-600 text-left"
                  bulletClassName="bg-accent"
                />
              </div>
              <div className="order-1 md:order-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden group mt-6 md:mt-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                   <div className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                     <div className="h-2 w-3/4 bg-slate-200 rounded mb-2" />
                     <div className="h-2 w-1/2 bg-slate-200 rounded" />
                   </div>
                   <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg mb-2 transition-transform group-hover:scale-110">
                     <ArrowRight size={20} />
                   </div>
                   <div className="w-full p-4 bg-primary/5 rounded-xl border border-primary/10 text-left relative">
                     <p className="font-bold text-primary">New Patient Lead</p>
                     <p className="text-sm text-muted-foreground">Score: 72/100 • Priority: High</p>
                     <p className="text-xs text-muted-foreground mt-1">Source: Website cognitive quiz</p>
                     <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                       Review needed
                     </span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: In-Office Assessment */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden group order-1 md:order-1">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full -ml-8 -mb-8 transition-all group-hover:scale-110" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                    <FileSpreadsheet className="text-primary" size={20} />
                    <div>
                      <span className="font-medium text-sm block">Medical History</span>
                      <span className="text-[11px] text-muted-foreground">Structured intake + risk factors</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                    <Brain className="text-primary" size={20} />
                    <div>
                      <span className="font-medium text-sm block">Comprehensive Cognitive Test</span>
                      <span className="text-[11px] text-muted-foreground">Brief, validated-style tasks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                    <TestTube className="text-primary" size={20} />
                    <div>
                      <span className="font-medium text-sm block">Lab Panel Recommendations</span>
                      <span className="text-[11px] text-muted-foreground">Auto-suggested labs by protocol</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 md:order-2 max-w-xl mt-6 md:mt-0">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <FileSpreadsheet size={24} />
                </div>
                <MarketingSection
                  title="2. Turn visits into clear brain-health plans"
                  titleAs="h2"
                  titleClassName="text-3xl font-display font-bold text-primary"
                  subtitle="One guided flow captures history, screeners, and cognitive tasks. Clinicians review everything in one place."
                  subtitleClassName="text-lg text-muted-foreground leading-relaxed"
                  listClassName="text-sm text-slate-600"
                  bulletClassName="bg-primary"
                >
                  <div>
                    <h3 className="mt-6 text-sm font-semibold tracking-wide text-slate-700">
                      What clinicians get
                    </h3>
                    <ul className="mt-3 space-y-3 text-base text-slate-700">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Flags across memory, attention, and processing speed.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Suggested lab panels aligned to your clinic’s menu.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Care options and talking points for shared decisions.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Baseline metrics to track progress over time.</span>
                      </li>
                    </ul>
                  </div>
                </MarketingSection>
                <div className="mb-8">
                  <h2 className="mt-10 text-2xl font-display font-bold text-primary mb-3">
                    Connect your existing care to brain health
                  </h2>
                  <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                    Add clear metrics that help patients understand the “why”—and help your team track change over time.
                  </p>
                  <p className="mt-6 text-sm font-medium text-slate-700">
                    Examples your team can explain and monitor:
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Hormone optimization tied to focus, energy, and clarity.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Vitamins and nutrients that support cognitive function.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Sleep support to improve attention and processing speed.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Metabolic and inflammation support for long-term resilience.</span>
                    </li>
                  </ul>
                  <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
                    NeuroVantage doesn’t prescribe treatment. It supports clinician decision-making by tracking baseline status and change over time.
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Coming soon</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Custom metabolomics panels tied directly into NeuroVantage reports.
                  </p>
                  <InlineCTALink asChild className="px-0 text-primary mt-1">
                    <Link href="/blood-testing">{CTA_LABELS.previewMetabolomics}</Link>
                  </InlineCTALink>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Longitudinal Data */}
            <motion.div 
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1 max-w-xl">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <LineChart size={24} />
                </div>
                <MarketingSection
                  title="3. Track progress over time"
                  titleAs="h2"
                  titleClassName="text-3xl font-display font-bold text-primary"
                  subtitle="NeuroVantage schedules follow-ups, tracks scores, and links change to labs and care plans."
                  bullets={[
                    "See how each plan affects brain scores over time.",
                    "Track key labs alongside cognitive results.",
                    "Flag stalls early and adjust sooner.",
                    "Share simple progress reports patients understand.",
                  ]}
                  subtitleClassName="text-lg text-muted-foreground leading-relaxed"
                  listClassName="text-sm text-slate-600"
                  bulletClassName="bg-purple-400"
                />
              </div>
              <div className="order-1 md:order-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden group">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all" />
                 <div className="relative z-10 space-y-4">
                   <CognitiveVsTestosteroneMiniChart />
                   <div className="text-center">
                     <p className="font-bold text-primary">Treatment Response Dashboard</p>
                     <p className="text-xs text-muted-foreground">Example: Cognitive composite and total testosterone over 6 months.</p>
                     <p className="text-[11px] text-muted-foreground mt-1">
                       Patient cohort example: average +18-point improvement in cognitive composite as total testosterone rose into the clinic's target range.
                     </p>
                   </div>
                 </div>
              </div>
            </motion.div>

          </div>

          <div className="mt-20 text-center">
            <PrimaryCTAButton
              size="lg"
              className="h-16 px-12 text-xl font-bold rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 ring-4 ring-primary/10"
              asChild
            >
              <TrackedLink href={CTA.primary.href} cta="try_screener" location="how_it_works">
                {CTA.primary.label} <ArrowRight className="ml-2 h-6 w-6" />
                {/* TODO: route to demo screener or signup flow */}
              </TrackedLink>
            </PrimaryCTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
