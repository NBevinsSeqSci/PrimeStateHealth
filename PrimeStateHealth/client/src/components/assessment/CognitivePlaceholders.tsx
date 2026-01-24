import { Button } from "@/components/ui/button";

export function OrientationTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Orientation Check</h3>
      <p className="text-muted-foreground">Please confirm your current location and date.</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Mock Test Placeholder</p>
        <p className="text-sm text-left text-muted-foreground">
          In a production environment, this would ask:
          <br/>- Today's Date
          <br/>- Day of Week
          <br/>- Current Season
          <br/>- Current Location
        </p>
      </div>
      <Button onClick={onComplete} size="lg">Submit Orientation</Button>
    </div>
  );
}

export function SymbolCodingTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Digital Symbol Coding</h3>
      <p className="text-muted-foreground">Match the symbols to the numbers as fast as you can.</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Processing Speed Task</p>
        <div className="flex justify-center gap-2 text-2xl font-mono">
          <span>1=★</span> <span>2=●</span> <span>3=▲</span> <span>4=■</span>
        </div>
        <div className="h-32 bg-white border rounded flex items-center justify-center">
          [Interactive Game Placeholder]
        </div>
      </div>
      <Button onClick={onComplete} size="lg">Complete Task</Button>
    </div>
  );
}

export function VerbalListTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Verbal List Learning</h3>
      <p className="text-muted-foreground">You will see a list of words. Try to remember them.</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Episodic Memory Task</p>
        <div className="h-32 bg-white border rounded flex items-center justify-center">
          [Word List Presentation Placeholder]
        </div>
      </div>
      <Button onClick={onComplete} size="lg">Start Recall</Button>
    </div>
  );
}

export function TrailsTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Set-Shifting Trails</h3>
      <p className="text-muted-foreground">Connect the dots in order: 1 → A → 2 → B...</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Cognitive Flexibility Task</p>
        <div className="h-32 bg-white border rounded flex items-center justify-center">
          [Trails B Game Placeholder]
        </div>
      </div>
      <Button onClick={onComplete} size="lg">Complete Task</Button>
    </div>
  );
}

export function DigitSpanTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Digit Span</h3>
      <p className="text-muted-foreground">Repeat the numbers in reverse order.</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Working Memory Task</p>
        <div className="h-32 bg-white border rounded flex items-center justify-center">
          [Digit Sequence Placeholder]
        </div>
      </div>
      <Button onClick={onComplete} size="lg">Complete Task</Button>
    </div>
  );
}

export function FluencyTest({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-primary">Verbal Fluency</h3>
      <p className="text-muted-foreground">Type as many animals as you can in 60 seconds.</p>
      <div className="bg-slate-50 p-6 rounded-xl border max-w-md mx-auto space-y-4">
        <p className="text-sm text-left font-medium">Language Task</p>
        <div className="h-32 bg-white border rounded flex items-center justify-center">
          [Text Input Placeholder]
        </div>
      </div>
      <Button onClick={onComplete} size="lg">Submit Words</Button>
    </div>
  );
}