import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

export function SymbolCodingTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentSymbol, setCurrentSymbol] = useState(0);
  const [highlightSymbol, setHighlightSymbol] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "none">("none");
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // 1: ★, 2: ●, 3: ▲, 4: ■
  const symbols = ["★", "●", "▲", "■"];
  const [trials, setTrials] = useState<number[]>([]);

  useEffect(() => {
    // Generate random sequence of 100 trials (indices 0-3)
    setTrials(Array.from({ length: 100 }, () => Math.floor(Math.random() * 4)));
  }, []);

  const isFinished = trials.length > 0 && currentSymbol >= trials.length;
  const currentTargetIndex = trials[currentSymbol];
  const currentShape = typeof currentTargetIndex === "number" ? symbols[currentTargetIndex] : null;

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, score, onComplete]);

  useEffect(() => {
    if (!started) return;
    if (isFinished) {
      onComplete(score);
    }
  }, [started, isFinished, score, onComplete]);

  useEffect(() => {
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, []);

  const handleInput = (num: number) => {
    if (!started || isFinished || typeof currentTargetIndex !== "number") return;
    // symbols[trials[currentSymbol]] is the target symbol
    // The key is 1=★, 2=●, 3=▲, 4=■
    // So index 0 (★) maps to 1, index 1 (●) maps to 2, etc.
    const expectedNum = trials[currentSymbol] + 1;

    const isCorrect = num === expectedNum;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setHighlightSymbol(true);
    flashTimeout.current = setTimeout(() => setHighlightSymbol(false), 200);

    window.setTimeout(() => {
      setFeedback("none");
      setCurrentSymbol((c) => c + 1);
    }, 200);
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-primary">Digital Symbol Coding</h3>
        <p className="text-muted-foreground">
          Using the key at the top, match the symbols to the correct numbers as fast as you can.
          You have 90 seconds.
        </p>
        <div className="p-4 bg-slate-50 border rounded-xl flex justify-center gap-6 text-xl">
          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">1</span>
            <span className="text-2xl">★</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">2</span>
            <span className="text-2xl">●</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">3</span>
            <span className="text-2xl">▲</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">4</span>
            <span className="text-2xl">■</span>
          </div>
        </div>
        <Button onClick={() => setStarted(true)} size="lg" className="w-full">Start Test</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <div className="flex justify-between items-center px-4">
        <div className="text-sm font-medium text-muted-foreground">Score: {score}</div>
        <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
          <Timer size={16} /> {timeLeft}s
        </div>
      </div>

      {/* Key */}
      <div className="p-4 bg-slate-50 border rounded-xl flex justify-center gap-8 text-xl">
        <div className="flex flex-col items-center">
          <span className="font-bold text-primary">1</span>
          <span className="text-2xl">★</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-primary">2</span>
          <span className="text-2xl">●</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-primary">3</span>
          <span className="text-2xl">▲</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-primary">4</span>
          <span className="text-2xl">■</span>
        </div>
      </div>

      {/* Current Task */}
      <div className="py-12">
        <div
          className={[
            "inline-flex items-center justify-center rounded-2xl p-6 transition-colors duration-150 mb-4",
            feedback === "correct"
              ? "bg-emerald-100"
              : feedback === "incorrect"
              ? "bg-red-100"
              : "bg-transparent",
          ].join(" ")}
        >
          {currentShape ? (
            <div
              className={`text-6xl animate-in fade-in zoom-in duration-200 transition-transform ${
                highlightSymbol ? "scale-110 text-primary" : ""
              }`}
            >
              {currentShape}
            </div>
          ) : (
            <div className="text-base text-slate-500">Great job—finishing up…</div>
          )}
        </div>
        <div className="h-6 mb-6" />
        
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {[1, 2, 3, 4].map((num) => (
            <Button 
              key={num} 
              variant="outline" 
              className="h-20 text-3xl font-bold hover:bg-primary hover:text-white transition-colors"
              onClick={() => handleInput(num)}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
