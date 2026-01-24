import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export type GoNoGoTrialType = "go" | "nogo";

export type GoNoGoTrial = {
  id: number;
  type: GoNoGoTrialType;
  onsetMs: number;
};

export type GoNoGoResultTrial = GoNoGoTrial & {
  responded: boolean;
  rtMs: number | null;
  correct: boolean;
};

export type GoNoGoSummary = {
  goTrials: number;
  noGoTrials: number;
  commissionErrors: number;
  omissionErrors: number;
  commissionRate: number;
  omissionRate: number;
  medianGoRtMs: number | null;
  goRtStdDevMs: number | null;
};

export type GoNoGoResult = {
  rawScore: number;
  trials: GoNoGoResultTrial[];
  summary: GoNoGoSummary;
};

interface GoNoGoTaskProps {
  onComplete: (result: GoNoGoResult) => void;
  onAbort?: () => void;
}

const TOTAL_TRIALS = 80;
const GO_PROPORTION = 0.75;
const STIMULUS_WINDOW_MS = 800;
const FIXATION_MIN_MS = 400;
const FIXATION_MAX_MS = 600;
const ITI_MIN_MS = 600;
const ITI_MAX_MS = 800;

export function GoNoGoTask({ onComplete, onAbort }: GoNoGoTaskProps) {
  const trials = useMemo(() => makeTrials(), []);
  const [phase, setPhase] = useState<"instructions" | "fixation" | "stimulus" | "iti" | "done">("instructions");
  const [trialIndex, setTrialIndex] = useState(0);
  const [stimulusVisible, setStimulusVisible] = useState(false);

  const stimulusStartRef = useRef<number | null>(null);
  const respondedRef = useRef(false);
  const trialIndexRef = useRef(0);
  const resultsRef = useRef<GoNoGoResultTrial[]>([]);
  const recordResponseRef = useRef<(rtMs: number | null) => void>(() => {});
  const timeoutRefs = useRef<number[]>([]);

  const currentTrial = trials[trialIndex];

  const clearTimers = useCallback(() => {
    timeoutRefs.current.forEach((id) => window.clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutRefs.current.push(id);
  }, []);

  const beginTrial = useCallback(() => {
    clearTimers();
    respondedRef.current = false;
    setStimulusVisible(false);
    setPhase("fixation");
    stimulusStartRef.current = null;

    const fixationDelay = randBetween(FIXATION_MIN_MS, FIXATION_MAX_MS);
    schedule(() => {
      setPhase("stimulus");
      setStimulusVisible(true);
      stimulusStartRef.current = performance.now();

      schedule(() => {
        if (!respondedRef.current) {
          recordResponseRef.current(null);
        }
      }, STIMULUS_WINDOW_MS);
    }, fixationDelay);
  }, [clearTimers, schedule]);

  const startTask = () => {
    trialIndexRef.current = 0;
    setTrialIndex(0);
    resultsRef.current = [];
    beginTrial();
  };

  const finish = useCallback((allTrials: GoNoGoResultTrial[]) => {
    setPhase("done");
    const summary = summarizeGoNoGo(allTrials);
    const score = scoreInhibition(summary);
    onComplete({ rawScore: score, trials: allTrials, summary });
  }, [onComplete]);

  const recordResponse = useCallback((rtMs: number | null) => {
    if (respondedRef.current) return;
    respondedRef.current = true;
    clearTimers();

    const activeTrial = trials[trialIndexRef.current];
    const responded = rtMs !== null;
    const correct = activeTrial.type === "go" ? responded : !responded;
    const trialResult: GoNoGoResultTrial = {
      ...activeTrial,
      responded,
      rtMs,
      correct,
    };

    const nextResults = [...resultsRef.current, trialResult];
    resultsRef.current = nextResults;

    const isLast = trialIndexRef.current >= trials.length - 1;
    if (isLast) {
      finish(nextResults);
      return;
    }

    setPhase("iti");
    const itiDelay = randBetween(ITI_MIN_MS, ITI_MAX_MS);
    schedule(() => {
      trialIndexRef.current += 1;
      setTrialIndex(trialIndexRef.current);
      beginTrial();
    }, itiDelay);
  }, [beginTrial, clearTimers, finish, schedule, trials]);

  useEffect(() => {
    recordResponseRef.current = recordResponse;
  }, [recordResponse]);

  const handleRespond = useCallback(() => {
    if (phase !== "stimulus" || !stimulusVisible) return;
    if (!stimulusStartRef.current) return;
    const rtMs = performance.now() - stimulusStartRef.current;
    recordResponse(rtMs);
  }, [phase, recordResponse, stimulusVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        handleRespond();
      }
      if (event.code === "Escape") {
        onAbort?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRespond, onAbort]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (phase === "instructions") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Impulse Inhibition (Go/No-Go)</h3>
          <p className="text-muted-foreground">
            This short task measures response inhibition and attention control.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border text-left space-y-2 text-sm">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Tap or press the spacebar when the circle is <span className="font-semibold text-emerald-600">green</span>.</li>
              <li>Do <span className="font-semibold">nothing</span> when the circle is <span className="font-semibold text-blue-600">blue</span>.</li>
              <li>Keep your eyes on the screen and respond as quickly as you can.</li>
            </ul>
          </div>
          <Button onClick={startTask} size="lg" className="w-full">
            Begin Task
          </Button>
        </div>
      </div>
    );
  }

  const circleClass =
    phase === "stimulus" && stimulusVisible
      ? currentTrial.type === "go"
        ? "bg-emerald-500"
        : "bg-blue-500"
      : "bg-slate-100 border border-slate-200";

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-primary">Go/No-Go Task</h3>
        <p className="text-sm text-muted-foreground">
          Trial {trialIndex + 1} of {trials.length}
        </p>
      </div>

      <button
        type="button"
        onClick={handleRespond}
        className="w-full flex items-center justify-center"
        aria-label="Respond to green circle"
      >
        <div className={`h-40 w-40 rounded-full transition-colors ${circleClass}`} />
      </button>

      <p className="text-xs text-slate-500">
        Tap for <span className="font-semibold text-emerald-600">green</span>, do nothing for{" "}
        <span className="font-semibold text-blue-600">blue</span>.
      </p>
    </div>
  );
}

function makeTrials(): GoNoGoTrial[] {
  const goCount = Math.round(TOTAL_TRIALS * GO_PROPORTION);
  const nogoCount = TOTAL_TRIALS - goCount;

  const trials: GoNoGoTrial[] = [];
  for (let i = 0; i < goCount; i += 1) {
    trials.push({ id: i, type: "go", onsetMs: 0 });
  }
  for (let j = 0; j < nogoCount; j += 1) {
    trials.push({ id: goCount + j, type: "nogo", onsetMs: 0 });
  }

  for (let k = trials.length - 1; k > 0; k -= 1) {
    const idx = Math.floor(Math.random() * (k + 1));
    [trials[k], trials[idx]] = [trials[idx], trials[k]];
  }

  return trials;
}

function randBetween(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

function summarizeGoNoGo(trials: GoNoGoResultTrial[]): GoNoGoSummary {
  const goTrials = trials.filter((trial) => trial.type === "go");
  const noGoTrials = trials.filter((trial) => trial.type === "nogo");

  const omissionErrors = goTrials.filter((trial) => !trial.responded).length;
  const commissionErrors = noGoTrials.filter((trial) => trial.responded).length;

  const goRts = goTrials
    .map((trial) => trial.rtMs)
    .filter((rt): rt is number => typeof rt === "number" && Number.isFinite(rt));

  return {
    goTrials: goTrials.length,
    noGoTrials: noGoTrials.length,
    commissionErrors,
    omissionErrors,
    commissionRate: noGoTrials.length ? commissionErrors / noGoTrials.length : 0,
    omissionRate: goTrials.length ? omissionErrors / goTrials.length : 0,
    medianGoRtMs: goRts.length ? median(goRts) : null,
    goRtStdDevMs: goRts.length ? stdDev(goRts) : null,
  };
}

function scoreInhibition(summary: GoNoGoSummary) {
  const { commissionRate, omissionRate, medianGoRtMs } = summary;
  let score = 100;

  score -= commissionRate * 120;
  score -= omissionRate * 80;

  if (medianGoRtMs && medianGoRtMs < 250 && commissionRate > 0.25) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}
