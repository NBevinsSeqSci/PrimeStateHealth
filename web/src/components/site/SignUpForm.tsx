"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleMagicLinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus("sending");
    setError(null);

    try {
      await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Marketing sign-up failures should not block auth.
    }

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/onboarding/demographics",
    });

    if (result?.error) {
      setStatus("error");
      setError("Something went wrong. Try again in a moment.");
    } else {
      setStatus("sent");
    }
  };

  const handlePasswordSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

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

      // Create account with password
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setStatus("error");
        setError(signupData.error || "Failed to create account");
        return;
      }

      // Sign in with the new credentials
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: "/onboarding/demographics",
      });

      if (result?.error) {
        setStatus("error");
        setError("Account created but sign-in failed. Please try logging in.");
      } else if (result?.ok) {
        // Redirect to demographics
        window.location.href = "/onboarding/demographics";
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    } finally {
      if (status !== "idle") {
        setStatus("idle");
      }
    }
  };

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
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
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
                disabled={status === "sending"}
                className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send link"}
              </button>
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

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
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
