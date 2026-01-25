"use client";

import { useMemo, useState } from "react";
import TurnstileWidget from "@/components/site/TurnstileWidget";

type FormState = "idle" | "submitting" | "success" | "error";

const requiresTurnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const canSubmit = useMemo(() => {
    if (state === "submitting") return false;
    if (!name.trim()) return false;
    if (!isEmail(email)) return false;
    if (!subject.trim()) return false;
    if (message.trim().length < 10) return false;
    if (requiresTurnstile && !turnstileToken) return false;
    return true;
  }, [email, message, name, state, subject, turnstileToken]);

  const resetTurnstile = () => {
    if (!requiresTurnstile) return;
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setCompany("");
  };

  const resetForm = () => {
    setState("idle");
    setError(null);
    clearFields();
    resetTurnstile();
  };

  const completeSuccess = () => {
    setState("success");
    setError(null);
    clearFields();
    resetTurnstile();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (company.trim()) {
      completeSuccess();
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message is too short.");
      return;
    }
    if (requiresTurnstile && !turnstileToken) {
      setError("Please complete the verification step.");
      return;
    }

    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          company,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || (data as { ok?: boolean }).ok !== true) {
        const msg =
          (data as { error?: string } | null)?.error ??
          "Something went wrong. Please try again.";
        setState("error");
        setError(msg);
        resetTurnstile();
        return;
      }

      completeSuccess();
    } catch {
      setState("error");
      setError("Network error. Please try again.");
      resetTurnstile();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {state === "success" ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-sm font-semibold text-emerald-200">
            Message sent.
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Thanks - we will get back to you soon.
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/30"
            onClick={resetForm}
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200"
            >
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-white" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                placeholder="Your name"
                required
                disabled={state === "submitting"}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                placeholder="you@example.com"
                required
                disabled={state === "submitting"}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              placeholder="How can we help?"
              required
              disabled={state === "submitting"}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              placeholder="Tell us what is on your mind..."
              minLength={10}
              required
              disabled={state === "submitting"}
            />
            <p className="mt-2 text-xs text-slate-400">
              Please do not include sensitive health information.
            </p>
          </div>

          <div className="hidden">
            <label className="text-sm font-medium text-white" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              autoComplete="off"
              tabIndex={-1}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {requiresTurnstile ? (
            <TurnstileWidget
              key={turnstileKey}
              onVerify={(token) => setTurnstileToken(token)}
            />
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "submitting" ? "Sending..." : "Send message"}
          </button>
        </>
      )}
    </form>
  );
}
