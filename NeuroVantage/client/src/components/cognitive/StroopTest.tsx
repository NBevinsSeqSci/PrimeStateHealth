import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface StroopTestProps {
  onComplete: (score: number) => void;
}

const COLORS = [
  { name: "RED", value: "#ef4444" },
  { name: "BLUE", value: "#3b82f6" },
  { name: "GREEN", value: "#22c55e" },
  { name: "YELLOW", value: "#eab308" },
];

export function StroopTest({ onComplete }: StroopTestProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro");
  const [currentWord, setCurrentWord] = useState({ text: "", color: "" });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const TOTAL_ROUNDS = 15;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("finished");
    setTimeout(() => onComplete(scoreRef.current), 1500);
  }, [onComplete]);

  const nextRound = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      endGame();
      return;
    }

    const randomTextIndex = Math.floor(Math.random() * COLORS.length);
    let randomColorIndex = Math.floor(Math.random() * COLORS.length);
    
    // Ensure color and text don't always match (make it tricky!)
    // 70% chance of mismatch
    if (Math.random() > 0.3 && randomColorIndex === randomTextIndex) {
       randomColorIndex = (randomColorIndex + 1) % COLORS.length;
    }

    setCurrentWord({
      text: COLORS[randomTextIndex].name,
      color: COLORS[randomColorIndex].value,
    });
    setRound((r) => r + 1);
  }, [endGame]);

  useEffect(() => {
    if (gameState === "playing") {
      nextRound();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, nextRound, endGame]);

  const handleAnswer = (colorValue: string) => {
    if (colorValue === currentWord.color) {
      setScore((s) => s + 100 + (timeLeft * 2)); // Bonus for speed
      // Visual feedback?
    } else {
      setScore((s) => Math.max(0, s - 50)); // Penalty
    }
    nextRound();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      {gameState === "intro" && (
        <div className="space-y-6">
           <div className="space-y-2">
            <h3 className="text-xl font-bold text-primary">Executive Function Challenge</h3>
            <p className="text-muted-foreground">
              Select the <strong>COLOR of the ink</strong>, not the word itself.
              <br />
              Example: If you see <span className="font-bold text-red-500">BLUE</span>, select Red.
            </p>
          </div>
          <Button onClick={() => setGameState("playing")} size="lg" className="w-full">
            Start Challenge
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>Round {Math.min(Math.max(round, 1), TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</span>
            <span>Time: {timeLeft}s</span>
          </div>

          <div className="h-40 flex items-center justify-center bg-slate-50 rounded-2xl border shadow-inner">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={round}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-5xl font-black tracking-wider"
                style={{ color: currentWord.color }}
              >
                {currentWord.text}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((c) => (
              <Button
                key={c.name}
                onClick={() => handleAnswer(c.value)}
                variant="outline"
                className="h-16 text-lg font-bold hover:bg-slate-100 border-2"
                style={{ borderColor: c.value, color: c.value }}
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Challenge Complete!</h3>
          <p className="text-4xl font-black text-accent">{score}</p>
          <p className="text-muted-foreground">Calculating executive function score...</p>
        </div>
      )}
    </div>
  );
}
