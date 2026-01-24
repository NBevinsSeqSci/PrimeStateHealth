import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PrimeState Health",
  description: "How PrimeState Health collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16 text-slate-200">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base text-slate-300 md:text-lg">
          We aim for privacy-first defaults and collect only what we need to provide the service.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Effective date: <span className="font-medium text-slate-200">January 24, 2026</span>
        </p>
      </header>

      <section className="space-y-10">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Quick summary</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We collect your email to create a secure sign-in link and deliver your results.</li>
            <li>We store your check-in results so you can view trends over time.</li>
            <li>We use basic analytics to improve the product (you can opt out where required).</li>
            <li>We do not sell your personal information.</li>
            <li>You can request access, export, or deletion of your data.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white md:text-2xl">What we collect</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Information you provide</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-white">Account info:</span> email address (used
                for secure magic-link login).
              </li>
              <li>
                <span className="font-semibold text-white">Support messages:</span> any information
                you include when you contact us.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              Information generated when you use the service
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-white">Check-in results:</span> task performance
                metrics (for example, scores and timing) used to show your snapshot and trends over
                time.
              </li>
              <li>
                <span className="font-semibold text-white">Device and usage data:</span> browser
                type, pages visited, and approximate usage patterns (to keep the service reliable
                and improve it).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Cookies and similar technologies</h3>
            <p>
              We use cookies or similar technologies for sign-in, security, and analytics. You can
              control cookies in your browser settings. Some cookies are required for the site to
              function.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">How we use information</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide the service (sign-in links, check-ins, results, and trend tracking).</li>
            <li>Maintain safety and security (fraud prevention, abuse detection, and debugging).</li>
            <li>
              Improve product experience (fix issues, understand what is working, and build
              features).
            </li>
            <li>Communicate with you (service emails, support replies, and important updates).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            How we share information
          </h2>
          <p>
            We share information only as needed to run the service, comply with law, or protect our
            users and systems. We do not sell your personal information.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-white">Service providers:</span> vendors that help
              us operate the site (hosting, databases, email delivery, analytics). They are
              permitted to use data only to provide services to us.
            </li>
            <li>
              <span className="font-semibold text-white">Legal and safety:</span> if required by law
              or to protect rights, safety, and security.
            </li>
            <li>
              <span className="font-semibold text-white">Business changes:</span> if we are involved
              in a merger, acquisition, or asset sale, we may transfer information as part of that
              transaction.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            Your choices and rights
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-white">Access / export:</span> request a copy of
              your information.
            </li>
            <li>
              <span className="font-semibold text-white">Correction:</span> ask us to correct
              inaccurate information.
            </li>
            <li>
              <span className="font-semibold text-white">Deletion:</span> request deletion of your
              account and associated data (subject to legal requirements and limited security
              logs).
            </li>
            <li>
              <span className="font-semibold text-white">Analytics controls:</span> you may be able
              to opt out of certain analytics via browser settings or in-product controls where
              available.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Data retention</h2>
          <p>
            We keep your information for as long as needed to provide the service and maintain
            records for legitimate business purposes (like security and compliance). You can
            request deletion at any time.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Security</h2>
          <p>
            We use reasonable administrative, technical, and physical safeguards designed to
            protect your information. No method of transmission or storage is 100% secure, but we
            work hard to protect your data.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Health note</h2>
          <p>
            PrimeState Health is designed for measurement and trend tracking and is not a medical
            diagnosis or treatment service. If you have concerns about symptoms, please talk with a
            licensed clinician.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            Children&apos;s privacy
          </h2>
          <p>
            PrimeState Health is not intended for children under 13 (or the minimum age required in
            your jurisdiction). We do not knowingly collect information from children.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">International users</h2>
          <p>
            If you access the service from outside the United States, your information may be
            processed in the U.S. or other locations where our service providers operate.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. If we make material changes, we will post
            the updated policy here and update the effective date above.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">Contact</h2>
          <p>
            Questions or requests? Contact us at{" "}
            <a
              className="font-semibold text-emerald-300 underline decoration-emerald-400/60 underline-offset-4 hover:text-emerald-200"
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
