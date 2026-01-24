import { Brain, Clock, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTA_LABELS } from "@/lib/copy";

type Props = {
  onStart: () => void;
};

export function ScreenerIntro({ onStart }: Props) {
  return (
    <Card className="p-8 md:p-12 text-center space-y-8 shadow-xl border-0 max-w-2xl mx-auto">
      <div className="mx-auto w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary">
        <Brain size={40} />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-bold text-primary">
          Quick cognitive screener
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          A short check of memory, focus, and mood you can finish in minutes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl bg-slate-50 border flex flex-col gap-2">
          <FileText className="text-accent" size={24} />
          <h4 className="font-bold text-primary text-sm">Health Survey</h4>
          <p className="text-xs text-muted-foreground">
            Screen for mood & focus factors
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border flex flex-col gap-2">
          <Clock className="text-accent" size={24} />
          <h4 className="font-bold text-primary text-sm">Reaction Test</h4>
          <p className="text-xs text-muted-foreground">
            Measure processing speed
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border flex flex-col gap-2">
          <Brain className="text-accent" size={24} />
          <h4 className="font-bold text-primary text-sm">Memory & Focus</h4>
          <p className="text-xs text-muted-foreground">
            Test recall & executive function
          </p>
        </div>
      </div>
      <Button
        size="lg"
        onClick={onStart}
        className="w-full max-w-sm mx-auto text-lg h-12"
      >
        {CTA_LABELS.startAssessment}
      </Button>
    </Card>
  );
}
