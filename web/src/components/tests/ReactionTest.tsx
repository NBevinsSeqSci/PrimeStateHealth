"use client";

import { useEffect, useRef, useState } from "react";

export type ReactionResult = {
  rawScore: number;
  trials: number[];
  attempts: number;
  earlyClicks: number;
  fastest: number | null;
  slowest: number | null;
  durationMs: number;
};

type ReactionTestProps = {
  onComplete: (result: ReactionResult) => void;
};

const MAX_ATTEMPTS = 3;

export default function ReactionTest({ onComplete }: ReactionTestProps) {
  const [state, setState] = useState<
    "intro" | "waiting" | "ready" | "clicked" | "early"
  >("intro");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [average, setAverage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [earlyClicks, setEarlyClicks] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const startAttempt = () => {
    if (sessionStart === null) {
      setSessionStart(Date.now());
    }
    setState("waiting");
    const delay = Math.random() * 2000 + 1500;

    timeoutRef.current = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, delay);
  };

  const startTest = () => {
    setState("waiting");
    startAttempt();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (state === "intro") return;

    if (state === "waiting") {
      setState("early");
      setEarlyClicks((prev) => prev + 1);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (state === "ready") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setState("clicked");
      setTrialTimes((prev) => [...prev, time]);

      const newAvg = (average * attempts + time) / (attempts + 1);
      setAverage(newAvg);

      if (attempts + 1 >= MAX_ATTEMPTS) {
        const sessionEnd = Date.now();
        setTimeout(() => {
          const trials = [...trialTimes, time];
          const result: ReactionResult = {
            rawScore: Math.round(newAvg),
            trials,
            attempts: trials.length,
            earlyClicks,
            fastest: trials.length ? Math.min(...trials) : null,
            slowest: trials.length ? Math.max(...trials) : null,
            durationMs: sessionStart ? sessionEnd - sessionStart : 0,
          };
          onComplete(result);
        }, 1500);
      } else {
        setAttempts((value) => value + 1);
        setTimeout(startAttempt, 1500);
      }
    }
  };

  const reset = () => {
    startAttempt();
  };

  if (state === "intro") {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">
            Reaction Time Test
          </h3>
          <p className="text-sm text-slate-300">
            This test measures your processing speed.
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left text-sm text-slate-200">
            <p className="font-semibold text-slate-100">Instructions:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
              <li>
                Wait for the box to turn{" "}
                <span className="font-semibold text-emerald-300">GREEN</span>.
              </li>
              <li>Click anywhere inside the box as fast as you can.</li>
              <li>If you click too early, you will have to retry.</li>
              <li>We will average your score over {MAX_ATTEMPTS} attempts.</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            type="button"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">Reaction Time Test</h3>
        <p className="text-sm text-slate-300">
          Click anywhere inside the box as soon as it turns green.
          <br />
          Attempt {Math.min(attempts + 1, MAX_ATTEMPTS)} of {MAX_ATTEMPTS}
        </p>
      </div>

      <div
        onClick={handleClick}
        className={`
          aspect-square cursor-pointer select-none rounded-2xl border border-white/10 shadow-lg transition-all duration-200
          ${state === "waiting" ? "bg-slate-900/70 text-slate-400 hover:bg-slate-800/80" : ""}
          ${state === "ready" ? "bg-emerald-400 text-slate-950 scale-105 shadow-emerald-500/20" : ""}
          ${state === "clicked" ? "bg-emerald-300 text-slate-950" : ""}
          ${state === "early" ? "bg-rose-500/10 border-2 border-rose-400 text-rose-200" : ""}
        `}
      >
        <div className="text-2xl font-semibold">
          {state === "waiting" && "Wait for Green..."}
          {state === "ready" && "CLICK!"}
          {state === "clicked" && `${reactionTime}ms`}
          {state === "early" && "Too Early!"}
        </div>
      </div>

      {state === "early" && (
        <button
          onClick={reset}
          className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
