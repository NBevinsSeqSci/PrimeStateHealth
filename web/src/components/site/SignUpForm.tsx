"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import posthog from "posthog-js";

const TERMS_VERSION = "2026-01-28";

export default function SignUpForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const validateTerms = (): boolean => {
    if (!termsAccepted) {
      setTermsError("You must accept the Terms of Use to create an account.");
      return false;
    }
    setTermsError(null);
    return true;
  };

  const recordTermsAcceptance = async (userEmail: string) => {
    try {
      await fetch("/api/auth/accept-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          termsVersion: TERMS_VERSION,
        }),
      });
    } catch {
      // Terms recording failure should not block the flow
      console.error("Failed to record terms acceptance");
    }
  };

  const validateName = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return false;
    }
    return true;
  };

  const handleMagicLinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    if (!validateName()) return;
    if (!validateTerms()) return;

    setStatus("sending");
    setError(null);

    // Track signup started
    posthog.capture("signup_started", {
      method: "magic_link",
      email: email,
    });

    try {
      await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Marketing sign-up failures should not block auth.
    }

    // Pre-create or update the user with name before sending magic link
    try {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          termsAccepted: true,
          termsVersion: TERMS_VERSION,
          magicLinkOnly: true,
        }),
      });
    } catch {
      // If pre-creation fails (e.g. user exists), the magic link flow will still work
    }

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setStatus("error");
      setError("Something went wrong. Try again in a moment.");
      posthog.capture("signup_failed", {
        method: "magic_link",
        error: result.error,
      });
    } else {
      await recordTermsAcceptance(email);
      setStatus("sent");

      // Identify user and track signup completed
      posthog.identify(email, {
        email: email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
      });
      posthog.capture("signup_completed", {
        method: "magic_link",
      });
    }
  };

  const handlePasswordSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    if (!validateName()) return;
    if (!validateTerms()) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setStatus("sending");
    setError(null);

    // Track signup started
    posthog.capture("signup_started", {
      method: "password",
      email: email,
    });

    try {
      // Subscribe to marketing
      try {
        await fetch("/api/marketing/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // Marketing failures should not block signup
      }

      // Create account with password and terms acceptance
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          termsAccepted: true,
          termsVersion: TERMS_VERSION,
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setStatus("error");
        setError(signupData.error || "Failed to create account");
        posthog.capture("signup_failed", {
          method: "password",
          error: signupData.error || "Failed to create account",
        });
        return;
      }

      // Sign in with the new credentials
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setStatus("error");
        setError("Account created but sign-in failed. Please try logging in.");
        posthog.capture("signup_failed", {
          method: "password",
          error: "sign_in_after_create_failed",
        });
      } else if (result?.ok) {
        // Identify user and track signup completed
        posthog.identify(email, {
          email: email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
        });
        posthog.capture("signup_completed", {
          method: "password",
        });

        // Redirect to dashboard
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      posthog.captureException(err);
    } finally {
      if (status !== "idle") {
        setStatus("idle");
      }
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setTermsError(null);
    }
  };

  const isSubmitDisabled = status === "sending" || !termsAccepted;

  return (
    <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
      <label className="text-xs uppercase tracking-[0.3em] text-brand-600">
        Email sign-up
      </label>
      <p className="mt-3 text-2xl font-semibold text-ink-900">
        Start the free check-in.
      </p>

      {mode === "magic" ? (
        <>
          <p className="mt-2 text-sm text-ink-500">
            Enter your email to get a secure link. You&apos;ll be able to start right away.
          </p>
          <form onSubmit={handleMagicLinkSubmit}>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                className="rounded-2xl border border-ink-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
                autoComplete="given-name"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                className="rounded-2xl border border-ink-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
                autoComplete="family-name"
              />
            </div>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-2xl border border-ink-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending..." : "Send link"}
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="mt-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsAcceptedMagic"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  aria-invalid={termsError ? "true" : "false"}
                  aria-describedby={termsError ? "terms-error-magic" : undefined}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label
                  htmlFor="termsAcceptedMagic"
                  className="text-sm text-slate-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-brand-600 underline hover:text-brand-500"
                  >
                    Terms of Use
                  </Link>
                </label>
              </div>
              {termsError && (
                <p
                  id="terms-error-magic"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {termsError}
                </p>
              )}
            </div>

            {status === "sent" && (
              <p className="mt-4 text-sm text-brand-600">
                Check your inbox for the sign-in link.
              </p>
            )}
            {status === "error" && error && (
              <p className="mt-4 text-sm text-rose-600">{error}</p>
            )}
          </form>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setMode("password")}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Sign up with password instead
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-500">
            Create your account with email and password.
          </p>
          <form onSubmit={handlePasswordSignup} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  First name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Last name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoComplete="new-password"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsAcceptedPassword"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  aria-invalid={termsError ? "true" : "false"}
                  aria-describedby={termsError ? "terms-error-password" : undefined}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                <label
                  htmlFor="termsAcceptedPassword"
                  className="text-sm text-slate-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-slate-900 underline hover:text-slate-700"
                  >
                    Terms of Use
                  </Link>
                </label>
              </div>
              {termsError && (
                <p
                  id="terms-error-password"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {termsError}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setMode("magic")}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Use email link instead
            </button>
          </div>
        </>
      )}
    </div>
  );
}
