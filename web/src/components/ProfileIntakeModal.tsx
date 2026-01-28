"use client";

import * as React from "react";

type SexAtBirth = "female" | "male" | "intersex" | "prefer_not";
type YesNo = "yes" | "no";

type HistoryFieldProps = {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-ink-900">{children}</label>;
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-ink-500">{children}</p>;
}

function RadioPill({
  name,
  value,
  current,
  onChange,
  label,
}: {
  name: string;
  value: string;
  current: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
        active
          ? "border-sky-200 bg-sky-50 text-ink-900 ring-2 ring-sky-400"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50",
      ].join(" ")}
      aria-pressed={active}
      onClick={() => onChange(value)}
    >
      {label}
      <input className="sr-only" type="radio" name={name} value={value} checked={active} readOnly />
    </button>
  );
}

function HistoryYesNo({ label, value, onChange }: HistoryFieldProps) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white/80 p-4">
      <div className="mb-3 text-sm font-medium text-ink-900">{label}</div>
      <div className="flex gap-2">
        <RadioPill name={label} value="yes" current={value} onChange={(v) => onChange(v as YesNo)} label="Yes" />
        <RadioPill name={label} value="no" current={value} onChange={(v) => onChange(v as YesNo)} label="No" />
      </div>
    </div>
  );
}

export function ProfileIntakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<null | "ok" | "error">(null);

  const [dob, setDob] = React.useState<string>("");
  const [sexAtBirth, setSexAtBirth] = React.useState<SexAtBirth>("prefer_not");

  const [hypertension, setHypertension] = React.useState<YesNo>("no");
  const [diabetes, setDiabetes] = React.useState<YesNo>("no");
  const [highCholesterol, setHighCholesterol] = React.useState<YesNo>("no");
  const [heartDisease, setHeartDisease] = React.useState<YesNo>("no");
  const [strokeTia, setStrokeTia] = React.useState<YesNo>("no");
  const [sleepApnea, setSleepApnea] = React.useState<YesNo>("no");
  const [depression, setDepression] = React.useState<YesNo>("no");
  const [anxiety, setAnxiety] = React.useState<YesNo>("no");
  const [adhd, setAdhd] = React.useState<YesNo>("no");
  const [tbiConcussion, setTbiConcussion] = React.useState<YesNo>("no");
  const [thyroidDisease, setThyroidDisease] = React.useState<YesNo>("no");
  const [familyHistoryDementia, setFamilyHistoryDementia] = React.useState<YesNo>("no");

  const [smoking, setSmoking] = React.useState<"never" | "former" | "current" | "prefer_not">("never");
  const [alcohol, setAlcohol] = React.useState<"none" | "light" | "moderate" | "heavy" | "prefer_not">("prefer_not");

  const [meds, setMeds] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (open) setStatus(null);
  }, [open]);

  async function onSave() {
    setSaving(true);
    setStatus(null);

    const payload = {
      type: "profile_intake_v1",
      submittedAt: new Date().toISOString(),
      demographics: {
        dateOfBirth: dob || null,
        sexAtBirth,
      },
      history: {
        hypertension,
        diabetes,
        highCholesterol,
        heartDisease,
        strokeTia,
        sleepApnea,
        depression,
        anxiety,
        adhd,
        tbiConcussion,
        thyroidDisease,
        familyHistoryDementia,
      },
      lifestyle: {
        smoking,
        alcohol,
      },
      meds: meds.trim() || null,
      notes: notes.trim() || null,
      version: 1,
    };

    try {
      const res = await fetch("/api/profile/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("api_failed");
      setStatus("ok");
      window.setTimeout(onClose, 500);
    } catch (error) {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-3xl rounded-3xl border border-ink-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink-200 p-6">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Demographics &amp; health history</h2>
            <p className="mt-1 text-sm text-ink-500">
              Optional but helpful for personalizing insights and contextualizing trends.
            </p>
          </div>
          <button className="ps-btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8">
          <section>
            <div className="mb-3 text-sm font-semibold text-ink-900">Demographics</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel>Date of birth</FieldLabel>
                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="w-full rounded-2xl border border-ink-200 bg-white/80 px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <HelpText>Used for age-adjusted comparisons.</HelpText>
              </div>
              <div>
                <FieldLabel>Sex at birth</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  <RadioPill
                    name="sexAtBirth"
                    value="female"
                    current={sexAtBirth}
                    onChange={(v) => setSexAtBirth(v as SexAtBirth)}
                    label="Female"
                  />
                  <RadioPill
                    name="sexAtBirth"
                    value="male"
                    current={sexAtBirth}
                    onChange={(v) => setSexAtBirth(v as SexAtBirth)}
                    label="Male"
                  />
                  <RadioPill
                    name="sexAtBirth"
                    value="intersex"
                    current={sexAtBirth}
                    onChange={(v) => setSexAtBirth(v as SexAtBirth)}
                    label="Intersex"
                  />
                  <RadioPill
                    name="sexAtBirth"
                    value="prefer_not"
                    current={sexAtBirth}
                    onChange={(v) => setSexAtBirth(v as SexAtBirth)}
                    label="Prefer not"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 text-sm font-semibold text-ink-900">Medical history</div>
            <div className="grid gap-3 md:grid-cols-2">
              <HistoryYesNo label="High blood pressure (hypertension)" value={hypertension} onChange={setHypertension} />
              <HistoryYesNo label="Diabetes" value={diabetes} onChange={setDiabetes} />
              <HistoryYesNo label="High cholesterol" value={highCholesterol} onChange={setHighCholesterol} />
              <HistoryYesNo label="Heart disease" value={heartDisease} onChange={setHeartDisease} />
              <HistoryYesNo label="Stroke / TIA" value={strokeTia} onChange={setStrokeTia} />
              <HistoryYesNo label="Sleep apnea" value={sleepApnea} onChange={setSleepApnea} />
              <HistoryYesNo label="Depression" value={depression} onChange={setDepression} />
              <HistoryYesNo label="Anxiety" value={anxiety} onChange={setAnxiety} />
              <HistoryYesNo label="ADHD" value={adhd} onChange={setAdhd} />
              <HistoryYesNo label="Concussion / TBI history" value={tbiConcussion} onChange={setTbiConcussion} />
              <HistoryYesNo label="Thyroid disease" value={thyroidDisease} onChange={setThyroidDisease} />
              <HistoryYesNo label="Family history of dementia" value={familyHistoryDementia} onChange={setFamilyHistoryDementia} />
            </div>
          </section>

          <section>
            <div className="mb-3 text-sm font-semibold text-ink-900">Lifestyle</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-ink-200 bg-white/80 p-4">
                <FieldLabel>Smoking</FieldLabel>
                <select
                  value={smoking}
                  onChange={(event) => setSmoking(event.target.value as typeof smoking)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                  <option value="prefer_not">Prefer not</option>
                </select>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-white/80 p-4">
                <FieldLabel>Alcohol</FieldLabel>
                <select
                  value={alcohol}
                  onChange={(event) => setAlcohol(event.target.value as typeof alcohol)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="prefer_not">Prefer not</option>
                  <option value="none">None</option>
                  <option value="light">Light (0-3/wk)</option>
                  <option value="moderate">Moderate (4-10/wk)</option>
                  <option value="heavy">Heavy (&gt;10/wk)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Current meds / supplements (optional)</FieldLabel>
              <textarea
                value={meds}
                onChange={(event) => setMeds(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-ink-200 bg-white/80 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="e.g., statin, SSRI, ADHD meds, sleep aids, creatine…"
              />
            </div>
            <div>
              <FieldLabel>Anything else? (optional)</FieldLabel>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-ink-200 bg-white/80 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Sleep schedule, shift work, major stressors, recent illness…"
              />
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 p-6">
          <p className="text-xs text-ink-500">
            This is not medical advice. Your data is used to improve trend interpretation.
          </p>
          <div className="flex items-center gap-2">
            <button className="ps-btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="ps-btn-primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            {status === "error" && <span className="text-sm text-rose-600">Couldn’t save.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
