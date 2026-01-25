import { Card } from "../ui/Card";

export default function TestResultCard({
  title,
  score,
  percentile,
  summary,
}: {
  title: string;
  score: number;
  percentile: number;
  summary: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <span className="bg-soft text-secondary text-sm px-3 py-1 rounded-full">
          {percentile}th %
        </span>
      </div>

      <p className="text-muted mt-3 mb-6">{summary}</p>

      <div className="flex items-end justify-between">
        <div className="text-4xl font-bold text-primary">{score}</div>

        <div className="flex gap-3">
          <button className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-xl shadow-card transition">
            Retake Test
          </button>
          <button className="border border-primary text-primary hover:bg-soft px-5 py-2 rounded-xl transition">
            Learn More
          </button>
        </div>
      </div>
    </Card>
  );
}
