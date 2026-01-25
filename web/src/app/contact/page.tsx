import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact | Prime State Health",
  description: "Questions or feedback? Send us a note and we will get back to you.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-16">
      <header className="mb-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
          Contact
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Contact us
        </h1>
        <p className="text-sm text-slate-300 md:text-base">
          Questions or feedback? Send us a note and we&apos;ll get back to you.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <h2 className="text-lg font-semibold text-white">Send a message</h2>
          <p className="mt-2 text-sm text-slate-300">
            We read every message. For medical emergencies, call 911.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <h2 className="text-lg font-semibold text-white">
            Other ways to reach us
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Prefer email? You can also reach our team directly.
          </p>
          <dl className="mt-6 space-y-4 text-sm text-slate-300">
            <div>
              <dt className="font-medium text-white">Email</dt>
              <dd className="mt-1">
                <a
                  className="text-emerald-200 underline underline-offset-4"
                  href="mailto:support@primestatehealth.com"
                >
                  support@primestatehealth.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-white">Response time</dt>
              <dd className="mt-1 text-slate-300">
                Typically within 1-2 business days.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-white">Privacy</dt>
              <dd className="mt-1 text-slate-300">
                Please avoid sharing sensitive personal health information in
                this form.
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
