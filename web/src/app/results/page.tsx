import DashboardShell from "@/components/DashboardShell";
import TestResultCard from "@/components/results/TestResultCard";

export default function ResultsPage() {
  return (
    <DashboardShell>
      <h1 className="text-4xl font-bold text-foreground">
        Your Cognitive Performance
      </h1>

      <p className="text-muted max-w-2xl">
        These results are based on your most recent free check-in and are
        compared against age-matched reference data.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <TestResultCard
          title="Reaction Time"
          score={87}
          percentile={72}
          summary="Your reaction speed is above average."
        />
        <TestResultCard
          title="Executive Function"
          score={82}
          percentile={65}
          summary="You show strong cognitive control."
        />
        <TestResultCard
          title="Memory"
          score={91}
          percentile={80}
          summary="Excellent visual memory performance."
        />
      </div>
    </DashboardShell>
  );
}
