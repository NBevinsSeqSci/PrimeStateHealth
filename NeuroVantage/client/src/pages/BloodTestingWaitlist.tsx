import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackAppEvent } from "@/lib/events";
import { getUTMs, trackWaitlistSubmit } from "@/lib/tracking";
import { CTA_LABELS } from "@/lib/copy";

export default function BloodTestingWaitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; consent?: string }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    clinic: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setErrors((prev) => ({ ...prev, consent: undefined }));
    setFormData((prev) => ({ ...prev, consent: checked }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: typeof errors = {};
    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.consent) {
      nextErrors.consent = "Please confirm consent to be contacted.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    const utms = getUTMs();
    void trackAppEvent({
      type: "METABOLOMICS_PILOT_SIGNUP_ATTEMPTED",
      userEmail: formData.email,
      userName: formData.fullName,
      path: window.location.pathname,
      meta: {
        clinic: formData.clinic || undefined,
        ...utms,
      },
    });
    trackWaitlistSubmit({
      form: "blood_testing_waitlist",
      ...utms,
    });
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Blood Testing Waitlist
          </p>
          <h1 className="text-3xl font-display font-bold text-primary">
            Get Notified When Mass Spectrometry Panels Launch
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill out the short form below, and we&apos;ll reach out as soon as the
            Brain + Biomarker lab offering is available for pilot clinics.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center space-y-2">
            <p className="text-lg font-semibold text-emerald-700">
              Thanks for your interest!
            </p>
            <p className="text-sm text-slate-600">
              We&apos;ll reach out soon with next steps to join the early access
              program.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Jordan Rivera"
                value={formData.fullName}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-xs text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@yourclinic.com"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="clinic"
                className="text-sm font-medium text-slate-700"
              >
                Clinic or Practice Name
              </label>
              <Input
                id="clinic"
                name="clinic"
                placeholder="NeuroVantage Wellness Center"
                value={formData.clinic}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-slate-600" htmlFor="consent">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                  required
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                />
                <span>I agree to be contacted about the blood testing pilot program.</span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="text-xs text-red-600">
                  {errors.consent}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : CTA_LABELS.joinWaitlist}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
