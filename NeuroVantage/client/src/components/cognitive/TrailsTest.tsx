import { useState, useEffect } from "react";

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
}

type FlashState = "correct" | "incorrect" | null;

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
  clickEvents: ClickEvent[];
  errorEvents: ErrorEvent[];
};

type TrailsTestProps = {
  onComplete: (result: TrailsResult) => void;
  errorPenaltySec?: number;
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

const LAYOUT: { x: number; y: number }[] = [
  { x: 50, y: 80 },
  { x: 20, y: 50 },
  { x: 80, y: 20 },
  { x: 50, y: 50 },
  { x: 20, y: 80 },
  { x: 80, y: 80 },
  { x: 35, y: 35 },
  { x: 65, y: 65 },
  { x: 35, y: 65 },
  { x: 65, y: 35 },
];

export function TrailsTest({ onComplete, errorPenaltySec = 3 }: TrailsTestProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [nextExpectedIndex, setNextExpectedIndex] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mistake, setMistake] = useState<string | null>(null);
  const [flash, setFlash] = useState<FlashState>(null);
  const [errors, setErrors] = useState(0);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [errorEvents, setErrorEvents] = useState<ErrorEvent[]>([]);

  useEffect(() => {
    const mappedPoints: Point[] = SEQUENCE.map((item, i) => ({
      id: item.id,
      label: item.label,
      x: LAYOUT[i]?.x ?? 50,
      y: LAYOUT[i]?.y ?? 50,
    }));
    setPoints(mappedPoints);
  }, []);

  const finalizeAndSubmit = (finalTimeMs: number | null) => {
    const totalTimeSec =
      finalTimeMs !== null && startTimeMs !== null ? (finalTimeMs - startTimeMs) / 1000 : null;
    const adjustedTimeSec = totalTimeSec !== null ? totalTimeSec + errors * errorPenaltySec : null;

    const result: TrailsResult = {
      totalTimeSec: totalTimeSec !== null ? Math.round(totalTimeSec * 10) / 10 : null,
      adjustedTimeSec: adjustedTimeSec !== null ? Math.round(adjustedTimeSec * 10) / 10 : null,
      nPoints: SEQUENCE.length,
      errors,
      clickEvents,
      errorEvents,
    };

    onComplete(result);
  };

  const handlePointClick = (point: Point) => {
    if (completed) return;

    const now = Date.now();
    const sequenceIndex = SEQUENCE.findIndex((s) => s.id === point.id);
    const expected = SEQUENCE[nextExpectedIndex];

    setStartTimeMs((prev) => (prev === null ? now : prev));

    const isCorrect = sequenceIndex === nextExpectedIndex;

    const clickEvent: ClickEvent = {
      id: point.id,
      index: sequenceIndex,
      expectedId: expected.id,
      expectedIndex: nextExpectedIndex,
      correct: isCorrect,
      atMs: now,
    };
    setClickEvents((prev) => [...prev, clickEvent]);

    if (isCorrect) {
      setFlash("correct");
      setMistake(null);
      window.setTimeout(() => setFlash(null), 150);

      if (nextExpectedIndex === SEQUENCE.length - 1) {
        setCompleted(true);
        window.setTimeout(() => finalizeAndSubmit(now), 500);
      } else {
        setNextExpectedIndex((i) => i + 1);
      }
    } else {
      setErrors((prev) => prev + 1);
      setMistake(point.id);
      setFlash("incorrect");

      const errorEvent: ErrorEvent = {
        id: point.id,
        index: sequenceIndex,
        expectedId: expected.id,
        expectedIndex: nextExpectedIndex,
        atMs: now,
      };
      setErrorEvents((prev) => [...prev, errorEvent]);

      window.setTimeout(() => setFlash(null), 200);
      window.setTimeout(() => setMistake(null), 500);
    }
  };

  const connectedPoints: Point[] = SEQUENCE.slice(0, nextExpectedIndex)
    .map((s) => points.find((p) => p.id === s.id))
    .filter(Boolean) as Point[];

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 text-center">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-primary">Set-Shifting Trails</h3>
        <p className="text-muted-foreground">
          Connect the circles in alternating order:
          <br />
          <span className="font-bold">1 → A → 2 → B → 3 → C → 4 → D → 5 → E</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Next target: <span className="font-semibold">{SEQUENCE[nextExpectedIndex]?.label ?? "Done"}</span>
        </p>
      </div>

      <div
        className={`relative aspect-square rounded-xl border shadow-inner transition-colors ${
          flash === "correct" ? "bg-emerald-50" : flash === "incorrect" ? "bg-red-50" : "bg-slate-50"
        }`}
      >
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
                strokeWidth={2}
                opacity={0.6}
              />
            );
          })}
        </svg>

        {points.map((p) => {
          const seqIndex = SEQUENCE.findIndex((s) => s.id === p.id);
          const isConnected = seqIndex < nextExpectedIndex;
          const isNext = seqIndex === nextExpectedIndex;
          const isError = mistake === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePointClick(p)}
              className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ${
                isConnected
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-white border-slate-300 text-slate-700 hover:border-primary"
              } ${isError ? "bg-red-100 border-red-500 text-red-700 animate-shake" : ""} ${
                isNext ? "ring-4 ring-primary/20 scale-110 border-primary" : ""
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`Point ${p.label}${isNext ? ", next in sequence" : ""}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground">Points: {SEQUENCE.length} • Errors: {errors}</p>
    </div>
  );
}
