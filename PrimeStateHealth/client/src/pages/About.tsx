import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-8 md:p-10 shadow-sm border-0 bg-white text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">About Prime State Health</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            This content has moved
          </h1>
          <p className="text-sm text-muted-foreground">
            The About Prime State Health overview now lives under Solutions &rarr; Cognitive Testing.
          </p>
          <Link href="/solutions/cognitive-testing">
            <Button size="lg">Go to Cognitive Testing</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
