import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export type ReactionResult = {
  rawScore: number;
  trials: number[];
  attempts: number;
  earlyClicks: number;
  fastest: number | null;
  slowest: number | null;
  durationMs: number;
};

interface ReactionTestProps {
  onComplete: (result: ReactionResult) => void;
}

export function ReactionTest({ onComplete }: ReactionTestProps) {
  const [state, setState] = useState<"intro" | "waiting" | "ready" | "clicked" | "early">("intro");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [average, setAverage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [earlyClicks, setEarlyClicks] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const MAX_ATTEMPTS = 3;

  const startTest = () => {
    setState("waiting");
    startAttempt();
  };

  const startAttempt = () => {
    if (sessionStart === null) {
      setSessionStart(Date.now());
    }
    setState("waiting");
    const delay = Math.random() * 2000 + 1500; // 1.5s to 3.5s
    
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, delay);
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
        setAttempts(a => a + 1);
        setTimeout(startAttempt, 1500);
      }
    }
  };

  const reset = () => {
    startAttempt();
  };

  if (state === "intro") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Reaction Time Test</h3>
          <p className="text-muted-foreground">
            This test measures your processing speed.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border text-left space-y-2 text-sm">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Wait for the box to turn <span className="text-accent font-bold">GREEN</span>.</li>
              <li>Click anywhere inside the box as fast as you can.</li>
              <li>If you click too early, you'll have to retry.</li>
              <li>We will average your score over {MAX_ATTEMPTS} attempts.</li>
            </ul>
          </div>
          <Button onClick={startTest} size="lg" className="w-full">
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-primary">Reaction Time Test</h3>
        <p className="text-muted-foreground text-sm">
          Click anywhere inside the box as soon as it turns green.
          <br />
          Attempt {Math.min(attempts + 1, MAX_ATTEMPTS)} of {MAX_ATTEMPTS}
        </p>
      </div>

      <div
        onClick={handleClick}
        className={`
          aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 select-none shadow-lg
          ${state === "waiting" ? "bg-slate-100 hover:bg-slate-200 text-slate-400" : ""}
          ${state === "ready" ? "bg-accent text-white scale-105 shadow-accent/25" : ""}
          ${state === "clicked" ? "bg-primary text-white" : ""}
          ${state === "early" ? "bg-destructive/10 border-2 border-destructive text-destructive" : ""}
        `}
      >
        <div className="text-2xl font-bold font-display">
          {state === "waiting" && "Wait for Green..."}
          {state === "ready" && "CLICK!"}
          {state === "clicked" && `${reactionTime}ms`}
          {state === "early" && "Too Early!"}
        </div>
      </div>

      {state === "early" && (
        <Button onClick={reset} variant="outline">Try Again</Button>
      )}
    </div>
  );
}
