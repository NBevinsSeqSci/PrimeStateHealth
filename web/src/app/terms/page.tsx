export const metadata = {
  title: "Terms of Service | PrimeState Health",
  description: "Terms that govern your use of PrimeState Health.",
};

const EFFECTIVE_DATE = "January 24, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          These terms explain how PrimeState Health works and what you can
          expect when using the service.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Effective date: <span className="font-medium">{EFFECTIVE_DATE}</span>
        </p>
      </header>

      <section className="space-y-8 text-sm text-slate-300 md:text-base">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1) Agreement</h2>
          <p>
            By accessing or using PrimeState Health (the &quot;Service&quot;), you agree
            to these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use
            the Service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            2) What the Service is (and isn&apos;t)
          </h2>
          <p>
            The Service provides tools for measurement and trend tracking (for
            example, brief cognitive check-ins, summaries, and suggestions). The
            Service does <strong>not</strong> provide medical advice, diagnosis,
            or treatment, and it is not a substitute for care from a licensed
            clinician. If you have urgent symptoms or concerns, seek medical
            attention.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">3) Eligibility</h2>
          <p>
            You must be at least 18 years old (or the age of majority where you
            live) to use the Service. By using the Service, you represent you
            meet these requirements.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            4) Accounts and secure sign-in links
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              You may need an account to use parts of the Service. We may use
              passwordless &quot;magic links&quot; sent to your email.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of access
              to your email account and for all activity under your account.
            </li>
            <li>
              You agree to provide accurate information and to keep your
              account information up to date.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            5) Acceptable use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use the Service in a way that violates any law or regulation.</li>
            <li>
              Attempt to interfere with or disrupt the Service (including
              probing, scanning, or testing vulnerabilities).
            </li>
            <li>
              Reverse engineer, scrape, or extract data from the Service except
              as allowed by law or with our permission.
            </li>
            <li>
              Use the Service to develop or train a competing product using our
              content, results formats, or UI.
            </li>
            <li>
              Share, resell, or provide access to the Service to others except
              as expressly allowed.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            6) Your content and inputs
          </h2>
          <p>
            You may provide inputs (such as responses during a check-in). You
            retain rights in your inputs. You grant us a worldwide,
            non-exclusive, royalty-free license to host, store, process, and
            use your inputs and results to provide, maintain, secure, and
            improve the Service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            7) Results and suggestions
          </h2>
          <p>
            Results may vary based on environment, device, fatigue,
            distractions, and other factors. Any suggestions are general
            informational guidance and may not be appropriate for everyone. You
            are responsible for how you use the Service and for decisions you
            make based on it.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            8) Intellectual property
          </h2>
          <p>
            The Service, including software, design, text, graphics, logos, and
            content (excluding your inputs), is owned by PrimeState Health or
            its licensors and is protected by intellectual property laws. We
            grant you a limited, revocable, non-transferable license to use the
            Service for your personal, non-commercial use in accordance with
            these Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            9) Third-party services
          </h2>
          <p>
            The Service may rely on third-party services (for example, hosting,
            analytics, and email delivery). We are not responsible for
            third-party services, and your use of them may be governed by their
            terms and policies.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            10) Changes to the Service
          </h2>
          <p>
            We may change, suspend, or discontinue any part of the Service at
            any time, with or without notice. We are not liable for any
            modification, suspension, or discontinuation.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">11) Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time
            for any reason (including suspected misuse or security risk), with
            or without notice. You may stop using the Service at any time.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            12) Disclaimer of warranties
          </h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM
            EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR
            IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT
            THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT RESULTS
            WILL BE ACCURATE OR RELIABLE FOR ANY PARTICULAR PURPOSE.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            13) Limitation of liability
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRIMESTATE HEALTH AND ITS
            AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, AND SUPPLIERS WILL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE,
            GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO
            YOUR USE OF (OR INABILITY TO USE) THE SERVICE.
          </p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY
            CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL
            NOT EXCEED THE GREATER OF (A) AMOUNTS YOU PAID TO USE THE SERVICE IN
            THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM OR (B) $100.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            14) Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless PrimeState Health
            and its affiliates, officers, employees, agents, and suppliers from
            any claims, liabilities, damages, losses, and expenses (including
            reasonable attorneys&apos; fees) arising out of or related to your use
            of the Service, your violation of these Terms, or your violation of
            any rights of another.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            15) Dispute resolution
          </h2>
          <p>
            Before filing a claim, you agree to contact us to try to resolve
            the dispute informally. If we can&apos;t resolve it, disputes will be
            resolved in the courts located in the jurisdiction where PrimeState
            Health is organized (unless applicable law requires otherwise).
          </p>
          <p className="text-xs text-slate-400">
            (Optional upgrade later: add arbitration and class-action waiver if
            you want maximum protection.)
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            16) Governing law
          </h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where
            PrimeState Health is organized, without regard to conflict of law
            principles.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            17) Changes to these Terms
          </h2>
          <p>
            We may update these Terms from time to time. If we make material
            changes, we will post the updated Terms here and update the
            effective date. Your continued use of the Service after changes
            become effective means you accept the updated Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">18) Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a
              className="font-medium text-emerald-300 hover:text-emerald-200"
              href="mailto:support@primestatehealth.com"
            >
              support@primestatehealth.com
            </a>
            .
          </p>
        </div>

        <hr className="border-slate-800" />
        <p className="text-xs text-slate-400">
          This page is a general template and not legal advice. Consider having
          counsel review before launch.
        </p>
      </section>
    </main>
  );
}
