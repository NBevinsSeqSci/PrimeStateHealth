"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : null;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus("sending");
    const signInCallbackUrl = callbackUrl ?? "/dashboard";
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: signInCallbackUrl,
    });

    if (result?.error) {
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-ink-200 bg-white/90 p-8 shadow-sm"
    >
      <label className="text-xs uppercase tracking-[0.3em] text-brand-600">
        Log in
      </label>
      <p className="mt-3 text-2xl font-semibold text-ink-900">
        Access your account
      </p>
      <p className="mt-2 text-sm text-ink-500">
        We&apos;ll email you a secure link. No password required.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-2xl border border-ink-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          {status === "sending" ? "Sending..." : "Send link"}
        </button>
      </div>
      {status === "sent" && (
        <p className="mt-4 text-sm text-brand-600">
          Check your inbox for the sign-in link.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-rose-600">
          Something went wrong. Try again in a moment.
        </p>
      )}
      {callbackUrl && (
        <Link
          href={callbackUrl}
          className="mt-4 inline-flex text-sm font-semibold text-brand-600"
        >
          Return to dashboard
        </Link>
      )}
    </form>
  );
}
