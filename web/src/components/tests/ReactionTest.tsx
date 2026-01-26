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
    "intro" | "waiting" | "ready" | "clicked" | "early" | "finished"
  >("intro");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [average, setAverage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [earlyClicks, setEarlyClicks] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<ReactionResult | null>(null);

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
    if (state === "intro" || state === "finished") return;

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
        setFinalResult(result);
        setState("finished");
        onComplete(result);
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
          <h3 className="text-2xl font-semibold text-ink-900">
            Reaction Time Test
          </h3>
          <p className="text-sm text-ink-500">
            This test measures your processing speed.
          </p>
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-left text-sm text-ink-600">
            <p className="font-semibold text-ink-700">Instructions:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-600">
              <li>
                Wait for the box to turn{" "}
                <span className="font-semibold text-emerald-600">GREEN</span>.
              </li>
              <li>Click anywhere inside the box as fast as you can.</li>
              <li>If you click too early, you will have to retry.</li>
              <li>We will average your score over {MAX_ATTEMPTS} attempts.</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
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
        <h3 className="text-xl font-semibold text-ink-900">Reaction Time Test</h3>
        <p className="text-sm text-ink-500">
          Click anywhere inside the box as soon as it turns green.
          <br />
          {state === "finished"
            ? "Completed"
            : `Attempt ${Math.min(attempts + 1, MAX_ATTEMPTS)} of ${MAX_ATTEMPTS}`}
        </p>
      </div>

      {state === "finished" && finalResult ? (
        <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-left text-sm text-ink-600">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500">
            Results
          </p>
          <div className="mt-3 grid gap-2">
            <div>
              Average: <span className="font-semibold text-ink-900">{finalResult.rawScore}ms</span>
            </div>
            <div>
              Fastest:{" "}
              <span className="font-semibold text-ink-900">
                {finalResult.fastest == null
                  ? "-"
                  : `${finalResult.fastest}ms`}
              </span>
            </div>
            <div>
              Slowest:{" "}
              <span className="font-semibold text-ink-900">
                {finalResult.slowest == null
                  ? "-"
                  : `${finalResult.slowest}ms`}
              </span>
            </div>
            <div>
              Early clicks:{" "}
              <span className="font-semibold text-ink-900">{finalResult.earlyClicks}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Your score appears below.
          </p>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`
            aspect-square cursor-pointer select-none rounded-2xl border border-ink-200 shadow-lg transition-all duration-200
            ${state === "waiting" ? "bg-ink-100 text-ink-500 hover:bg-ink-200" : ""}
            ${state === "ready" ? "bg-emerald-500 border-emerald-400 text-white scale-105 shadow-emerald-500/30" : ""}
            ${state === "clicked" ? "bg-emerald-400 border-emerald-300 text-white" : ""}
            ${state === "early" ? "bg-rose-50 border-2 border-rose-300 text-rose-600" : ""}
          `}
        >
          <div className="text-2xl font-semibold">
            {state === "waiting" && "Wait for Green..."}
            {state === "ready" && "CLICK!"}
            {state === "clicked" && `${reactionTime}ms`}
            {state === "early" && "Too Early!"}
          </div>
        </div>
      )}

      {state === "early" && (
        <button
          onClick={reset}
          className="rounded-2xl border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
