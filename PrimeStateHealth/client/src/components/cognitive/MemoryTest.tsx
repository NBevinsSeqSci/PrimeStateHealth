import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export type MemoryTestResult = {
  rawScore: number;
  highestLevel: number;
  sequences: number[][];
  failureSequence: number[] | null;
  completedLevels: number;
};

interface MemoryTestProps {
  onComplete: (result: MemoryTestResult) => void;
}

export function MemoryTest({ onComplete }: MemoryTestProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playbackIdx, setPlaybackIdx] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"intro" | "idle" | "playing" | "input" | "success" | "fail">("intro");
  const [level, setLevel] = useState(1);
  const [sequenceHistory, setSequenceHistory] = useState<number[][]>([]);
  const [completedLevels, setCompletedLevels] = useState(0);

  const startTest = () => {
    setGameState("idle");
  };

  useEffect(() => {
    if (gameState !== "idle") return;
    const newSeq =
      sequence.length === 0
        ? Array.from({ length: level }, () => Math.floor(Math.random() * 9))
        : [...sequence, Math.floor(Math.random() * 9)];
    setSequence(newSeq);
    setSequenceHistory((prev) => [...prev, newSeq]);
    setGameState("playing");
    playSequence(newSeq);
  }, [gameState, level, sequence]);

  const playSequence = (seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setPlaybackIdx(null);
        setGameState("input");
        return;
      }
      setPlaybackIdx(seq[i]);
      setTimeout(() => setPlaybackIdx(null), 500); // Flash duration
      i++;
    }, 1000); // Time between flashes
  };

  const handleGridClick = (idx: number) => {
    if (gameState !== "input") return;

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    // Check correctness
    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setGameState("fail");
      const result: MemoryTestResult = {
        rawScore: Math.max(0, level - 1),
        highestLevel: Math.max(0, level - 1),
        sequences: sequenceHistory,
        failureSequence: [...sequence],
        completedLevels,
      };
      setTimeout(() => onComplete(result), 1500);
      return;
    }

    // Level complete?
    if (newUserSeq.length === sequence.length) {
      setGameState("success");
      setTimeout(() => {
        setLevel((l) => l + 1);
        setUserSequence([]);
        setCompletedLevels((prev) => prev + 1);
        setGameState("idle");
      }, 1000);
    }
  };

  if (gameState === "intro") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Visual Memory Test</h3>
          <p className="text-muted-foreground">
            This test evaluates your short-term visual memory.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border text-left space-y-2 text-sm">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>A sequence of tiles will flash.</li>
              <li>Memorize the pattern.</li>
              <li>Repeat the pattern by clicking the tiles in the same order.</li>
              <li>The sequence gets one step longer each round.</li>
            </ul>
          </div>
          <Button onClick={startTest} size="lg" className="w-full">
            Start Memory Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
       <div className="space-y-2">
        <h3 className="text-xl font-bold text-primary">Visual Memory Test</h3>
        <p className="text-muted-foreground text-sm">
          Memorize the pattern and repeat it.
          <br />
          Level {level}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 aspect-square p-4 bg-slate-50 rounded-2xl border">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleGridClick(i)}
            disabled={gameState !== "input"}
            className={`
              rounded-xl transition-all duration-200
              ${playbackIdx === i ? "bg-primary scale-95 shadow-lg" : "bg-white shadow-sm hover:shadow-md border border-slate-100"}
              ${gameState === "input" ? "cursor-pointer active:scale-95" : "cursor-default"}
              ${gameState === "success" && "bg-accent/20 border-accent"}
              ${gameState === "fail" && "bg-destructive/10 border-destructive"}
            `}
          />
        ))}
      </div>

      <div className="h-6 text-sm font-medium">
        {gameState === "playing" && <span className="text-primary animate-pulse">Watch carefully...</span>}
        {gameState === "input" && <span className="text-muted-foreground">Your turn</span>}
        {gameState === "success" && <span className="text-accent">Correct! Next level...</span>}
        {gameState === "fail" && <span className="text-destructive">Incorrect sequence</span>}
      </div>
    </div>
  );
}
