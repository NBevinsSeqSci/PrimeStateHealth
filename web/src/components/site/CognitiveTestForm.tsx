"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TurnstileWidget from "@/components/site/TurnstileWidget";

const questions = [
  "I can stay focused during complex tasks without drifting.",
  "I remember details from conversations later in the week.",
  "I feel mentally sharp during the afternoon hours.",
  "I can switch between tasks without losing momentum.",
  "I recover quickly after mentally demanding work.",
];

export default function CognitiveTestForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [answers, setAnswers] = useState<number[]>(
    Array.from({ length: questions.length }, () => 0)
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const updateAnswer = (index: number, value: number) => {
    setAnswers((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers, turnstileToken }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as { id: string };
      router.push(`/results/${data.id}`);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate-900/80 p-8"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
        Brain check-in
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">
        Brain Clarity Snapshot
      </h1>
      <p className="mt-2 text-sm text-slate-300">
        Rate each statement from 0 (not at all) to 4 (very true).
      </p>
      <label className="mt-6 block text-sm font-semibold text-slate-200">
        Email for your results
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
      />

      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question} className="rounded-2xl bg-slate-950/60 p-4">
            <p className="text-sm text-slate-100">{question}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateAnswer(index, value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    answers[index] === value
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-white/10 text-slate-300 hover:border-emerald-300/60"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        {status === "submitting" ? "Submitting..." : "Get my snapshot"}
      </button>

      {status === "error" && (
        <p className="mt-4 text-sm text-rose-200">
          Something went wrong. Please try again.
        </p>
      )}
      <TurnstileWidget onVerify={setTurnstileToken} />
    </form>
  );
}
