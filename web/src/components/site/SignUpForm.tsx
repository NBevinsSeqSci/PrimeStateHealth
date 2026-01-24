"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus("sending");
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
      callbackUrl: "/cognitive-test",
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
      className="rounded-3xl border border-white/10 bg-slate-900/80 p-8"
    >
      <label className="text-xs uppercase tracking-[0.3em] text-emerald-200">
        Email sign-up
      </label>
      <p className="mt-3 text-2xl font-semibold text-white">Start the free check-in.</p>
      <p className="mt-2 text-sm text-slate-300">
        Enter your email to get a secure link. You'll be able to start right away.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          {status === "sending" ? "Sending..." : "Send link"}
        </button>
      </div>
      {status === "sent" && (
        <p className="mt-4 text-sm text-emerald-200">
          Check your inbox for the sign-in link.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-rose-200">
          Something went wrong. Try again in a moment.
        </p>
      )}
    </form>
  );
}
