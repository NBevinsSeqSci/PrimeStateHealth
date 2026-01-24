import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrackedLink } from "@/components/TrackedLink";
import { CTA_LABELS } from "@/lib/copy";

export default function BloodTesting() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center">
      <div className="mb-12">
        <div className="relative w-[260px] h-[260px] mx-auto">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/80 via-cyan-400/70 to-amber-400/80 blur-2xl opacity-60" />
          <div className="relative h-full rounded-[32px] border border-white/60 bg-white/70 shadow-2xl backdrop-blur">
            <svg viewBox="0 0 320 320" className="h-full w-full p-8 text-primary">
              <defs>
                <linearGradient id="bars" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="dots" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect x="30" y="30" width="110" height="110" rx="16" fill="#e0f2fe" />
              <path
                d="M50 110 Q70 70 90 95 T130 70"
                stroke="#0284c7"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <rect x="180" y="60" width="110" height="180" rx="24" fill="#fef3c7" />
              <rect x="205" y="110" width="20" height="110" rx="6" fill="url(#bars)" />
              <rect x="235" y="80" width="20" height="140" rx="6" fill="url(#bars)" opacity="0.7" />
              <rect x="265" y="140" width="20" height="80" rx="6" fill="url(#bars)" opacity="0.5" />
              <rect x="40" y="180" width="120" height="90" rx="20" fill="#fee2e2" />
              <circle cx="80" cy="220" r="22" fill="url(#dots)" />
              <circle cx="125" cy="220" r="22" fill="url(#dots)" opacity="0.6" />
              <path
                d="M40 198 H160"
                stroke="#f87171"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto text-center px-4">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Advanced Blood Testing
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mt-4 leading-tight">
          Coming Soon: Mass Spectrometry
          <br />
          Blood Testing
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Deep metabolomic and biomarker panels for brain, metabolic, and vascular health.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Planned capabilities include:</p>
          <ul className="mt-3 space-y-2 text-left text-slate-700">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>High-sensitivity metabolomic and biomarker panels run on mass spectrometry.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Early signals related to inflammation, vascular risk, metabolic status, and hormone response.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Integrates lab findings into the NeuroVantage cognitive summary.</span>
            </li>
          </ul>
        </div>
          <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button className="px-6" asChild>
              <TrackedLink
                href="/blood-testing/waitlist"
                cta="notify_me_mass_spec"
                location="blood_testing"
              >
                {CTA_LABELS.notifyMe}
              </TrackedLink>
            </Button>
            <Button variant="outline" className="px-6" asChild>
              <TrackedLink
                href="/blood-testing/metabolomics"
                cta="explore_metabolomics"
                location="blood_testing"
              >
                {CTA_LABELS.exploreMetabolomics}
              </TrackedLink>
            </Button>
            <Button variant="secondary" className="px-6" asChild>
              <TrackedLink
                href="/blood-testing/metabolomics/example"
                cta="view_example_report"
                location="blood_testing"
              >
                {CTA_LABELS.viewSampleReport}
              </TrackedLink>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            We&apos;ll only contact you about this feature and won&apos;t share your email with third parties.
          </p>
        </div>
        <div className="mt-8 w-full">
          <div className="rounded-2xl border border-primary/20 bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.3em]">New</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-2">Metabolomics pilot coming soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pair deep LC/MS metabolite panels with NeuroVantage cognitive biomarkers for longitudinal tracking.
            </p>
            <Button variant="ghost" className="px-0 text-primary mt-2 hover:bg-transparent" asChild>
              <Link href="/blood-testing/metabolomics">{CTA_LABELS.exploreMetabolomics}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
