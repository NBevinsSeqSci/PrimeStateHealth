import { cn } from "@/lib/utils";

type QualificationBlockProps = {
  className?: string;
};

export function QualificationBlock({ className }: QualificationBlockProps) {
  return (
    <section className={cn("grid gap-4 md:grid-cols-2", className)}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900">Designed for</h3>
          <p className="text-xs text-slate-500">
            Prime State Health is built for clinic workflows and longitudinal tracking—not diagnostic neuropsych testing.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Hormone &amp; TRT clinics</li>
          <li>Med spas &amp; longevity practices</li>
          <li>Functional &amp; integrative medicine clinics</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Not designed for</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Diagnostic neuropsychology</li>
          <li>Neurology billing workflows</li>
          <li>One-off academic testing</li>
        </ul>
      </div>
    </section>
  );
}
