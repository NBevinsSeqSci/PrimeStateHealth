"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
}

type ClickEvent = {
  id: string;
  index: number;
  expectedId: string;
  expectedIndex: number;
  correct: boolean;
  atMs: number;
};

type ErrorEvent = {
  id: string;
  index: number;
  expectedId: string;
  expectedIndex: number;
  atMs: number;
};

export type TrailsResult = {
  totalTimeSec: number | null;
  adjustedTimeSec: number | null;
  nPoints: number;
  errors: number;
  guided: boolean;
  clickEvents: ClickEvent[];
  errorEvents: ErrorEvent[];
};

const SEQUENCE: { id: string; label: string }[] = [
  { id: "1", label: "1" },
  { id: "A", label: "A" },
  { id: "2", label: "2" },
  { id: "B", label: "B" },
  { id: "3", label: "3" },
  { id: "C", label: "C" },
  { id: "4", label: "4" },
  { id: "D", label: "D" },
  { id: "5", label: "5" },
  { id: "E", label: "E" },
];

// Positions spread across the canvas (percent-based)
const LAYOUT: { x: number; y: number }[] = [
  { x: 50, y: 82 },
  { x: 18, y: 50 },
  { x: 82, y: 18 },
  { x: 50, y: 48 },
  { x: 18, y: 82 },
  { x: 82, y: 82 },
  { x: 32, y: 28 },
  { x: 68, y: 62 },
  { x: 32, y: 62 },
  { x: 68, y: 28 },
];

const ERROR_PENALTY_SEC = 3;

export default function TrailsTest({
  onComplete,
}: {
  onComplete: (result: TrailsResult) => void;
}) {
  const [phase, setPhase] = useState<"setup" | "playing" | "done">("setup");
  const [guided, setGuided] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);
  const [nextExpectedIndex, setNextExpectedIndex] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [errorEvents, setErrorEvents] = useState<ErrorEvent[]>([]);
  const [correctFlashId, setCorrectFlashId] = useState<string | null>(null);
  const [errorFlashId, setErrorFlashId] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const mappedPoints: Point[] = SEQUENCE.map((item, i) => ({
      id: item.id,
      label: item.label,
      x: LAYOUT[i]?.x ?? 50,
      y: LAYOUT[i]?.y ?? 50,
    }));
    setPoints(mappedPoints);
  }, []);

  const finalizeAndSubmit = useCallback(
    (finalTimeMs: number, startMs: number, errCount: number, clicks: ClickEvent[], errEvts: ErrorEvent[], isGuided: boolean) => {
      const totalTimeSec = (finalTimeMs - startMs) / 1000;
      const adjustedTimeSec = totalTimeSec + errCount * ERROR_PENALTY_SEC;

      const result: TrailsResult = {
        totalTimeSec: Math.round(totalTimeSec * 10) / 10,
        adjustedTimeSec: Math.round(adjustedTimeSec * 10) / 10,
        nPoints: SEQUENCE.length,
        errors: errCount,
        guided: isGuided,
        clickEvents: clicks,
        errorEvents: errEvts,
      };

      onCompleteRef.current(result);
    },
    []
  );

  const handlePointClick = (point: Point) => {
    if (phase !== "playing") return;

    const now = Date.now();
    const sequenceIndex = SEQUENCE.findIndex((s) => s.id === point.id);
    const expected = SEQUENCE[nextExpectedIndex];

    const actualStart = startTimeMs ?? now;
    if (startTimeMs === null) setStartTimeMs(now);

    const isCorrect = sequenceIndex === nextExpectedIndex;

    const clickEvent: ClickEvent = {
      id: point.id,
      index: sequenceIndex,
      expectedId: expected.id,
      expectedIndex: nextExpectedIndex,
      correct: isCorrect,
      atMs: now,
    };
    const newClicks = [...clickEvents, clickEvent];
    setClickEvents(newClicks);

    if (isCorrect) {
      setCorrectFlashId(point.id);
      setErrorFlashId(null);
      setTimeout(() => setCorrectFlashId(null), 300);

      if (nextExpectedIndex === SEQUENCE.length - 1) {
        setPhase("done");
        setTimeout(() => {
          finalizeAndSubmit(now, actualStart, errors, newClicks, errorEvents, guided);
        }, 400);
      } else {
        setNextExpectedIndex((i) => i + 1);
      }
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setErrorFlashId(point.id);
      setShaking(true);

      const errEvent: ErrorEvent = {
        id: point.id,
        index: sequenceIndex,
        expectedId: expected.id,
        expectedIndex: nextExpectedIndex,
        atMs: now,
      };
      const newErrEvts = [...errorEvents, errEvent];
      setErrorEvents(newErrEvts);

      setTimeout(() => {
        setErrorFlashId(null);
        setShaking(false);
      }, 400);
    }
  };

  const connectedPoints: Point[] = SEQUENCE.slice(0, nextExpectedIndex)
    .map((s) => points.find((p) => p.id === s.id))
    .filter(Boolean) as Point[];

  if (phase === "setup") {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-slate-900">
            Set-Shifting Trails
          </h3>
          <p className="text-slate-600">
            Connect the circles in alternating number-letter order:
          </p>
          <p className="font-bold text-slate-900">
            1 → A → 2 → B → 3 → C → 4 → D → 5 → E
          </p>
        </div>

        {/* Mode toggle */}
        <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-700">
            Mode
          </legend>
          <div className="flex gap-4 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="trailsMode"
                checked={guided}
                onChange={() => setGuided(true)}
                className="accent-emerald-600"
              />
              <span className="text-sm text-slate-700">
                Guided{" "}
                <span className="text-slate-500">(next target highlighted)</span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="trailsMode"
                checked={!guided}
                onChange={() => setGuided(false)}
                className="accent-emerald-600"
              />
              <span className="text-sm text-slate-700">
                Standard{" "}
                <span className="text-slate-500">(no highlight)</span>
              </span>
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => setPhase("playing")}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start Test
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Trail Complete</h3>
        <p className="text-slate-600">Your results are below.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 text-center">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-900">
          Set-Shifting Trails
        </h3>
        <p className="text-sm text-slate-600">
          Next target:{" "}
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-sm font-bold">
            {SEQUENCE[nextExpectedIndex]?.label ?? "—"}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          {guided ? "Guided mode" : "Standard mode"} &bull; Errors: {errors}
        </p>
      </div>

      {/* Trail canvas */}
      <div
        className={`relative aspect-square rounded-2xl border border-slate-200 shadow-inner bg-slate-50 transition-colors ${
          shaking ? "animate-[shake_0.3s_ease-in-out]" : ""
        }`}
        style={{
          // @ts-expect-error -- inline keyframes for shake
          "--tw-animate-shake": undefined,
        }}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          {connectedPoints.map((p, idx) => {
            if (idx === 0) return null;
            const prev = connectedPoints[idx - 1];
            return (
              <line
                key={`${prev.id}-${p.id}`}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${p.x}%`}
                y2={`${p.y}%`}
                stroke="#10b981"
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Target circles */}
        {points.map((p) => {
          const seqIndex = SEQUENCE.findIndex((s) => s.id === p.id);
          const isConnected = seqIndex < nextExpectedIndex;
          const isNext = seqIndex === nextExpectedIndex;
          const isCorrectFlash = correctFlashId === p.id;
          const isErrorFlash = errorFlashId === p.id;

          let circleClasses =
            "absolute w-12 h-12 -ml-6 -mt-6 sm:w-14 sm:h-14 sm:-ml-7 sm:-mt-7 " +
            "rounded-full border-2 flex items-center justify-center " +
            "font-bold text-base sm:text-lg select-none transition-all duration-150 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ";

          if (isCorrectFlash) {
            circleClasses +=
              "bg-emerald-200 border-emerald-500 text-emerald-800 scale-110 ";
          } else if (isErrorFlash) {
            circleClasses +=
              "bg-red-100 border-red-500 text-red-700 scale-90 ";
          } else if (isConnected) {
            circleClasses +=
              "bg-emerald-100 border-emerald-400 text-emerald-700 ";
          } else if (isNext && guided) {
            circleClasses +=
              "bg-white border-emerald-500 text-slate-900 " +
              "ring-4 ring-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.4)] scale-110 ";
          } else {
            circleClasses +=
              "bg-white border-slate-300 text-slate-700 hover:border-slate-500 hover:shadow-sm ";
          }

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePointClick(p)}
              className={circleClasses}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`Target ${p.label}${isNext ? ", next in sequence" : ""}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
