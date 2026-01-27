"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DemographicsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    sex: "",
    education: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/signup");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/demographics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save demographics");
      }

      // Redirect to tests page after successful save
      router.push("/try");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
            Step 1 of 1
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tell us a bit about yourself
          </h1>
          <p className="text-base text-slate-600">
            This helps us provide age-appropriate comparisons and better track your cognitive health over time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-900">
                  Date of birth
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  We use this to provide age-matched comparisons
                </p>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                />
              </div>

              {/* Sex */}
              <div>
                <label htmlFor="sex" className="block text-sm font-semibold text-slate-900">
                  Sex assigned at birth
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Used for demographic analysis only
                </p>
                <select
                  id="sex"
                  name="sex"
                  required
                  value={formData.sex}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other/Prefer not to say</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-sm font-semibold text-slate-900">
                  Highest level of education
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Education level can affect cognitive test norms
                </p>
                <select
                  id="education"
                  name="education"
                  required
                  value={formData.education}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                >
                  <option value="">Select...</option>
                  <option value="high-school">High school or equivalent</option>
                  <option value="some-college">Some college</option>
                  <option value="bachelors">Bachelor's degree</option>
                  <option value="masters">Master's degree</option>
                  <option value="doctorate">Doctoral degree</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-slate-900">
                  Country
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Where you currently live
                </p>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., United States"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                />
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-semibold">Your information is private</p>
                <p className="mt-1 text-blue-800">
                  We use this data only to provide you with personalized insights and will never share it without your explicit consent.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Continue to tests"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
