"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type TestKind =
  | "reaction-time"
  | "executive-function"
  | "visual-memory";

export type TestResultPayload = {
  kind: TestKind;
  score: number;
  raw?: unknown;
  createdAt?: string;
};

type Props = {
  title: string;
  description?: string;
  kind: TestKind;
  children: (args: { onComplete: (raw: unknown) => void; isComplete: boolean }) => JSX.Element;
  scoreFromRaw: (raw: unknown) => number;
};

export default function TestScaffold({
  title,
  description,
  kind,
  children,
  scoreFromRaw,
}: Props) {
  const [raw, setRaw] = useState<unknown | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const score = useMemo(() => {
    if (raw == null) return null;
    const computed = scoreFromRaw(raw);
    if (!Number.isFinite(computed)) return null;
    return Math.max(0, Math.min(100, Math.round(computed)));
  }, [raw, scoreFromRaw]);

  async function save() {
    if (score == null) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload: TestResultPayload = {
        kind,
        score,
        raw,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaveMsg("Saved.");
    } catch {
      setSaveMsg("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <Link
        href="/cognitive-test"
        className="text-xs uppercase tracking-[0.3em] text-emerald-200 transition hover:text-emerald-100"
      >
        Back to check-in
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-white">{title}</h1>
      {description ? (
        <p className="mt-2 text-slate-200">{description}</p>
      ) : null}
      <p className="mt-2 text-sm text-slate-300">
        Tip: Do this in a quiet spot. Close other tabs for the cleanest results.
      </p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        {children({ onComplete: setRaw, isComplete: raw != null })}
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-300">Your score</div>
            <div className="text-4xl font-semibold text-white">
              {score == null ? "-" : score}
              {score == null ? "" : (
                <span className="text-base text-slate-300">/100</span>
              )}
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Scores are for tracking your baseline and trend - not diagnosis or
              treatment.
            </div>
          </div>
          <button
            className="rounded-2xl border border-emerald-300/40 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/80 hover:text-white disabled:opacity-50"
            disabled={score == null || saving}
            onClick={save}
            type="button"
          >
            {saving ? "Saving..." : "Save result"}
          </button>
        </div>
        {saveMsg ? <div className="mt-3 text-sm text-slate-300">{saveMsg}</div> : null}
      </section>
    </main>
  );
}
