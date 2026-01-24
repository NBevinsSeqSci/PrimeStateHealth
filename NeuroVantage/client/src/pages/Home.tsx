import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MarketingSection } from "@/components/MarketingSection";
import { CTA } from "@/lib/cta";
import { useIsMobile } from "@/hooks/use-mobile";
import heroBg from "@assets/generated_images/abstract_medical_technology_background_with_neural_network_connections_in_teal_and_navy.png";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const reduceMotion = prefersReducedMotion || isMobile;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src={heroBg} 
            alt="Background" 
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90" />
        </div>
        
        <div className="mx-auto max-w-5xl pt-14 pb-16 text-center">
          <div className="mx-auto max-w-5xl text-center space-y-6">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6 border border-accent/20">
                <Brain size={16} />
                <span>Objective brain metrics that grow your clinic</span>
              </span>
              <h1 className="text-5xl sm:text-6xl font-display font-semibold leading-[1.1] tracking-tight text-slate-900">
                <span className="block">Turn Brain Fog into Revenue</span>
              </h1>
              <div className="mx-auto mt-8 max-w-4xl">
                <div className="grid gap-8 text-left md:grid-cols-2 md:gap-10">
                  <div className="rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                    <MarketingSection
                      title="What clinics get"
                      titleAs="h2"
                      titleClassName="text-base font-semibold text-slate-900"
                      bullets={[
                        "Fast brain check for hormone, longevity, weight loss, and functional medicine clinics.",
                        "Turns “brain fog” into clear findings and billable plans.",
                        "Improves consult-to-program conversion and supports higher-value labs and therapies.",
                        "Boosts retention with repeat testing that shows progress over time.",
                      ]}
                    />
                  </div>

                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <MarketingSection
                      title="How it fits into visits"
                      titleAs="h2"
                      titleClassName="text-base font-semibold text-slate-900"
                      bullets={[
                        "Runs in any browser with no special hardware.",
                        "Self-administered on tablet or computer with step-by-step guidance.",
                        "Add a ~10-minute brain check to new visits and follow-ups.",
                        "Built for longitudinal tracking by a clinical lab team.",
                      ]}
                      listClassName="text-sm text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.2 }}
              className="flex flex-col items-center gap-3 mt-10"
            >
              <Link href={CTA.primary.href}>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                  {CTA.primary.label} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="text-xs text-slate-500">
                Takes ~2 minutes to preview • No signup required
              </div>
              <div className="text-sm text-slate-500">
                <Link href={CTA.secondary.href}>
                  <a className="hover:text-slate-700 underline underline-offset-4">{CTA.secondary.label}</a>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-slate-50/60 p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Designed for</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li>Hormone &amp; TRT clinics</li>
                <li>Med spas &amp; longevity practices</li>
                <li>Functional &amp; integrative medicine clinics</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50/60 p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Not designed for</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li>Diagnostic neuropsychology</li>
                <li>Neurology billing workflows</li>
                <li>One-off academic testing</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            NeuroVantage supports measurement and monitoring - not diagnosis.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Why clinics add cognitive testing</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0 }}
              className="p-8 rounded-2xl border border-border bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Clarify symptoms</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li><strong>Brain fog</strong> becomes objective domain scores.</li>
                <li>Baseline metrics improve clinical conversations.</li>
                <li>Less reliance on vague self-report alone.</li>
              </ul>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.1 }}
              className="p-8 rounded-2xl border border-border bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Improve conversion</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li>Objective data supports <strong>visit-to-plan</strong> decisions.</li>
                <li>Patients understand "why" behind recommendations.</li>
                <li>Reports help your team stay consistent.</li>
              </ul>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2 }}
              className="p-8 rounded-2xl border border-border bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Boost retention</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li>Repeat testing shows <strong>progress over time</strong>.</li>
                <li>Creates a clear follow-up cadence.</li>
                <li>Increases perceived value of ongoing care.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">
              What clinicians review during visits
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <ul className="space-y-5 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">Patient-generated medical history</p>
                    <p>Symptoms, sleep, mood, energy, medications, lifestyle, and goals in one view.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">High-level cognitive findings</p>
                    <p>Clear summaries of attention, processing speed, memory, and executive function.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">Suggested next steps</p>
                    <p>Follow-up options for labs, hormone optimization, and wellness plans.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">Integration at a glance</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-slate-50/60 p-6 text-center">
              <p className="text-sm font-semibold text-slate-900 mb-2">1) Patient completes screener</p>
              <p className="text-sm text-slate-600">Short, browser-based tasks fit into intake or pre-visit flow.</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50/60 p-6 text-center">
              <p className="text-sm font-semibold text-slate-900 mb-2">2) Clinic reviews structured results</p>
              <p className="text-sm text-slate-600">Domain scores align with how you already discuss care plans.</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50/60 p-6 text-center">
              <p className="text-sm font-semibold text-slate-900 mb-2">3) Repeat to track progress</p>
              <p className="text-sm text-slate-600">Follow-up testing documents change over time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">See it in action</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start with the free screener to see how NeuroVantage fits your workflow.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2">
              <Link href={CTA.primary.href}>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                  {CTA.primary.label} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <Link href={CTA.secondary.href}>
                  <a className="hover:text-slate-900 hover:underline">{CTA.secondary.label}</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
