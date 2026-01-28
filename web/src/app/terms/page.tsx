export const metadata = {
  title: "Terms of Service | PrimeState Health",
  description: "Terms that govern your use of PrimeState Health.",
};

const EFFECTIVE_DATE = "January 28, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-ink-900 md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-ink-600 md:text-base">
          These Terms govern your access to and use of PrimeState Health and
          our websites, applications, and services.
        </p>
        <p className="mt-2 text-xs text-ink-500">
          Effective date: <span className="font-medium">{EFFECTIVE_DATE}</span>
        </p>
      </header>

      <section className="space-y-8 text-sm text-ink-600 md:text-base">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-500">
          PLEASE READ CAREFULLY. THESE TERMS CONTAIN A BINDING ARBITRATION
          AGREEMENT, A WAIVER OF JURY TRIAL, AND A WAIVER OF CLASS, COLLECTIVE,
          REPRESENTATIVE, AND PRIVATE-ATTORNEY-GENERAL ACTIONS THAT AFFECT YOUR
          LEGAL RIGHTS.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">1) Agreement</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms and our Privacy Policy. If you do not agree, do not use the
            Service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            2) What the Service Is (and Isn&apos;t)
          </h2>
          <p>
            The Service provides tools for measurement, self-tracking,
            education, and trend visualization (including brief cognitive
            check-ins, summaries, and general suggestions).
          </p>
          <p className="font-semibold text-ink-900">
            THE SERVICE IS NOT A MEDICAL DEVICE, DIAGNOSTIC TOOL, OR CLINICAL
            DECISION-SUPPORT SYSTEM AND IS NOT INTENDED TO DIAGNOSE, TREAT, CURE,
            OR PREVENT ANY DISEASE OR CONDITION.
          </p>
          <p>
            The Service does not provide medical advice and does not replace
            care from a licensed clinician. No physician-patient or
            clinician-patient relationship is created through use of the
            Service.
          </p>
          <p>
            Do not rely on the Service for emergencies. Seek immediate medical
            attention for urgent symptoms or concerns.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">3) Eligibility</h2>
          <p>
            You must be at least eighteen (18) years old (or the age of majority
            where you live). By using the Service, you represent and warrant
            that you meet this requirement.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            4) Accounts and Secure Access
          </h2>
          <p>
            Certain features require an account. We may provide passwordless
            sign-in links or other authentication methods.
          </p>
          <p>
            You are responsible for safeguarding access to your account and for
            all activity conducted under it. You agree to provide accurate,
            current information and to keep it updated.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            5) Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use the Service unlawfully or in violation of regulations.</li>
            <li>Interfere with or disrupt security or performance.</li>
            <li>Attempt to reverse engineer, scrape, or extract data.</li>
            <li>Use outputs for clinical or professional decision-making.</li>
            <li>Develop competing services using our materials.</li>
            <li>Resell or share access without permission.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            6) Your Inputs and License
          </h2>
          <p>
            You may submit information or responses (&quot;Inputs&quot;). You retain
            ownership of your Inputs.
          </p>
          <p>
            You grant PrimeState a worldwide, non-exclusive, royalty-free
            license to host, store, process, analyze, and use Inputs and derived
            results to operate, secure, maintain, and improve the Service,
            subject to our Privacy Policy.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            7) Results, Suggestions, and Variability
          </h2>
          <p>
            Results may vary based on device differences, environment, fatigue,
            medications, health conditions, or other factors.
          </p>
          <p>
            Any summaries or suggestions are informational only and may not
            apply to you.
          </p>
          <p>You are solely responsible for how you use the Service.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            8) Intellectual Property
          </h2>
          <p>
            The Service and its content (excluding your Inputs) are owned by
            PrimeState or its licensors and protected by intellectual-property
            laws.
          </p>
          <p>
            We grant you a limited, revocable, non-transferable, non-commercial
            license to use the Service in accordance with these Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            9) Third-Party Services
          </h2>
          <p>
            The Service may integrate third-party providers. We are not
            responsible for those services, and their terms govern your use.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            10) Changes to the Service
          </h2>
          <p>
            We may modify, suspend, or discontinue any part of the Service at
            any time without liability.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">11) Termination</h2>
          <p>
            We may suspend or terminate access at any time for suspected
            misuse, legal risk, or operational reasons.
          </p>
          <p>You may stop using the Service at any time.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            12) Disclaimer of Warranties
          </h2>
          <p className="font-semibold text-ink-900">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot;
          </p>
          <p className="font-semibold text-ink-900">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
            EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            13) Limitation of Liability
          </h2>
          <p className="font-semibold text-ink-900">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRIME STATE HEALTH AND ITS
            AFFILIATES SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL,
            CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST
            PROFITS, DATA, OR GOODWILL.
          </p>
          <p className="font-semibold text-ink-900">
            OUR TOTAL LIABILITY ARISING OUT OF OR RELATING TO THE SERVICE OR
            THESE TERMS SHALL NOT EXCEED THE GREATER OF (A) FEES YOU PAID IN THE
            SIX (6) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM OR (B)
            $100.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            14) Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless PrimeState and its
            affiliates, officers, employees, and agents from any claims arising
            from:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your use of the Service.</li>
            <li>Reliance on results.</li>
            <li>Violation of these Terms.</li>
            <li>Violation of law or third-party rights.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            15) Binding Arbitration; Waiver of Class and Representative Actions
          </h2>
          <p className="font-semibold text-ink-900">PLEASE READ CAREFULLY.</p>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-900">
              a) Arbitration Agreement
            </h3>
            <p>
              Except for matters that may be brought in small-claims court, any
              dispute arising from or relating to these Terms or the Service
              shall be resolved exclusively by binding arbitration administered
              by the American Arbitration Association under its Consumer
              Arbitration Rules.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-900">b) Location</h3>
            <p>
              Arbitration shall take place in San Diego County, California,
              unless the parties agree otherwise.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-900">
              c) No Class or Representative Actions
            </h3>
            <p>
              You agree to bring claims only in your individual capacity. You
              waive any right to participate in class, collective,
              representative, or private-attorney-general actions, including
              claims under California&apos;s Private Attorneys General Act
              (&quot;PAGA&quot;), to the maximum extent permitted by law.
            </p>
            <p>
              If a court determines that the PAGA waiver is unenforceable, PAGA
              claims shall be stayed while individual claims are arbitrated.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-900">
              d) Jury Trial Waiver
            </h3>
            <p>You waive the right to a trial by jury.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-900">e) Opt-Out</h3>
            <p>
              You may opt out of this arbitration agreement within thirty (30)
              days of creating an account by emailing{" "}
              <a
                className="font-medium text-brand-600 hover:text-brand-500"
                href="mailto:support@primestatehealth.com"
              >
                support@primestatehealth.com
              </a>{" "}
              with your name and account email.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            16) Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of the State of California,
            without regard to conflict-of-laws principles.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            17) Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Service after changes take effect constitutes acceptance.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">18) Force Majeure</h2>
          <p>
            We are not liable for delays or failures caused by events beyond
            our reasonable control, including natural disasters, cyber
            incidents, power outages, government actions, labor disputes, or
            telecommunications failures.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            19) Assumption of Risk
          </h2>
          <p>
            You acknowledge inherent uncertainty in measurement tools and
            assume all risks associated with reliance on results, technical
            limitations, data inaccuracies, or user-specific factors.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            20) Beta and Experimental Features
          </h2>
          <p>
            Features labeled &quot;beta,&quot; &quot;experimental,&quot; or &quot;preview&quot;
            are provided without warranties and may change or be discontinued
            at any time.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">
            21) Export Controls
          </h2>
          <p>You agree to comply with U.S. export laws and sanctions regulations.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink-900">22) Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a
              className="font-medium text-brand-600 hover:text-brand-500"
              href="mailto:support@primestatehealth.com"
            >
              support@primestatehealth.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
