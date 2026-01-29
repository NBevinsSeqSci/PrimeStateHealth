"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import posthog from "posthog-js";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : null;

  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleMagicLinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus("sending");
    setError(null);

    // Track login started
    posthog.capture("login_started", {
      method: "magic_link",
    });

    const signInCallbackUrl = callbackUrl ?? "/dashboard";
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: signInCallbackUrl,
    });

    if (result?.error) {
      setStatus("error");
      setError("Something went wrong. Try again in a moment.");
      posthog.capture("login_failed", {
        method: "magic_link",
        error: result.error,
      });
    } else {
      setStatus("sent");
      // Identify user on login
      posthog.identify(email, { email: email });
      posthog.capture("login_completed", {
        method: "magic_link",
      });
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    setStatus("sending");
    setError(null);

    // Track login started
    posthog.capture("login_started", {
      method: "password",
    });

    const signInCallbackUrl = callbackUrl ?? "/dashboard";

    try {
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: signInCallbackUrl,
      });

      if (result?.error) {
        setStatus("error");
        setError("Invalid email or password. Please try again.");
        posthog.capture("login_failed", {
          method: "password",
          error: "invalid_credentials",
        });
      } else if (result?.ok) {
        // Identify user on login
        posthog.identify(email, { email: email });
        posthog.capture("login_completed", {
          method: "password",
        });

        // Redirect on success
        window.location.href = signInCallbackUrl;
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

  return (
    <div className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm">
      <label className="text-xs uppercase tracking-[0.3em] text-brand-600">
        Log in
      </label>
      <p className="mt-3 text-2xl font-semibold text-ink-900">
        Access your account
      </p>

      {mode === "magic" ? (
        <>
          <p className="mt-2 text-sm text-ink-500">
            We&apos;ll email you a secure link. No password required.
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
              Use email &amp; password instead
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-500">
            Sign in with your email and password.
          </p>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
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
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoComplete="current-password"
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
              {status === "sending" ? "Signing in…" : "Sign in"}
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

      {callbackUrl && (
        <Link
          href={callbackUrl}
          className="mt-4 inline-flex text-sm font-semibold text-brand-600"
        >
          Return to dashboard
        </Link>
      )}
    </div>
  );
}
