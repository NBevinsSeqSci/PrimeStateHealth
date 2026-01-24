export default function TermsOfUse() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
            Legal
          </p>
          <h1 className="text-3xl font-display font-bold text-primary">
            Terms of Use
          </h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary">Extensive Data Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            By using Prime State Health you authorize us to collect, retain, analyze,
            combine, and commercialize any information that you or your devices
            provide while you access our services. This includes identifiable
            health metrics, feedback, device telemetry, session recordings, and
            derived analytics. We may use or share this data for research,
            product development, AI model training, benchmarking, or any other
            operational or commercial purpose that supports our mission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary">
            Data Protection &amp; Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement administrative, technical, and physical safeguards aligned with industry
            security standards and applicable privacy regulations. For EU/UK residents, we process
            personal data under GDPR Art. 6(1)(a) consent and Art. 9(2)(a) explicit consent for
            health information. You may request access, corrections, portability, or deletion
            (subject to legitimate retention needs), and we will respond within the timelines
            mandated by applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary">
            Broad Sharing Permissions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            You specifically authorize us to share de-identified or aggregated
            insights without restriction and to disclose identifiable
            information to trusted processors, research collaborators, clinical
            partners, or acquirers, provided each recipient agrees to protect
            the data consistent with applicable privacy obligations, such as GDPR.
            We may store
            data globally and retain it for as long as it remains useful for the
            purposes described above.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary">
            Acceptance &amp; Updates
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Continued use of Prime State Health signifies your acceptance of these
            terms and any future updates. We will post revisions here with a new
            effective date, and your ongoing use constitutes renewed consent.
            Please contact privacy@primestatehealth.com with regulatory inquiries or
            to exercise your rights.
          </p>
        </section>
      </div>
    </div>
  );
}
