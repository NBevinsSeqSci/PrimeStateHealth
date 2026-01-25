"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

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
  backHref?: string;
  backLabel?: string;
  children: (args: { onComplete: (raw: unknown) => void; isComplete: boolean }) => ReactNode;
  scoreFromRaw: (raw: unknown) => number;
  resultCallout?: ReactNode;
};

export default function TestScaffold({
  title,
  description,
  kind,
  backHref,
  backLabel,
  children,
  scoreFromRaw,
  resultCallout,
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

  const backTarget = backHref ?? "/cognitive-test";
  const backText = backLabel ?? "Back to check-in";

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <Link
        href={backTarget}
        className="text-xs uppercase tracking-[0.3em] text-brand-600 transition hover:text-brand-500"
      >
        {backText}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink-900">{title}</h1>
      {description ? (
        <p className="mt-2 text-ink-600">{description}</p>
      ) : null}
      <p className="mt-2 text-sm text-ink-500">
        Tip: Do this in a quiet spot. Close other tabs for the cleanest results.
      </p>

      <section className="mt-8 rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
        {children({ onComplete: setRaw, isComplete: raw != null })}
      </section>

      <section className="mt-6 rounded-3xl border border-ink-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="text-sm text-ink-500">Your score</div>
            <div className="text-4xl font-semibold text-ink-900">
              {score == null ? "-" : score}
              {score == null ? "" : (
                <span className="text-base text-ink-500">/100</span>
              )}
            </div>
            <div className="mt-2 text-sm text-ink-500">
              Scores are for tracking your baseline and trend - not diagnosis or
              treatment.
            </div>
            {resultCallout}
          </div>
          <button
            className="rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:text-brand-600 disabled:opacity-50"
            disabled={score == null || saving}
            onClick={save}
            type="button"
          >
            {saving ? "Saving..." : "Save result"}
          </button>
        </div>
        {saveMsg ? <div className="mt-3 text-sm text-ink-500">{saveMsg}</div> : null}
      </section>
    </main>
  );
}
