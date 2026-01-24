import CognitiveTestForm from "@/components/site/CognitiveTestForm";

export default function CognitiveTestPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
            Brain check-in
          </p>
          <h1 className="text-4xl font-semibold text-white">Brain check-in</h1>
          <p className="text-lg text-slate-200">
            Take your time. Go as fast as you comfortably can while staying
            accurate.
          </p>
          <p className="text-sm text-slate-300">
            Tip: Close other tabs and silence notifications for the cleanest
            results.
          </p>
        </div>
        <CognitiveTestForm />
      </div>
    </div>
  );
}
