import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DietEvidenceItem } from "@/lib/diet/format";
import { EvidenceList } from "@/components/report/diet/EvidenceList";

const strengthPalette = {
  light: {
    High: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Moderate: "bg-amber-100 text-amber-800 border border-amber-200",
    Low: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  dark: {
    High: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
    Moderate: "bg-amber-500/15 text-amber-200 border border-amber-400/40",
    Low: "bg-white/5 text-slate-200 border border-white/10",
  },
};

const toneTokens = {
  light: {
    container: "border-slate-200 bg-white/95 text-slate-900",
    title: "text-slate-900",
    takeaway: "text-slate-700",
    label: "text-slate-500",
    bullet: "text-slate-700",
    chip: "bg-slate-100 text-slate-600",
    caveat: "text-slate-500",
  },
  dark: {
    container: "border-slate-800 bg-slate-950/40 text-slate-100",
    title: "text-white",
    takeaway: "text-slate-200",
    label: "text-slate-400",
    bullet: "text-slate-200",
    chip: "bg-white/10 text-slate-200",
    caveat: "text-slate-400",
  },
};

export type DietCardProps = {
  title: string;
  strength: "Low" | "Moderate" | "High";
  takeaway: string;
  evidence: DietEvidenceItem[];
  nextSteps: string[];
  caveats?: string[];
  contextChips?: string[];
  tone?: "light" | "dark";
};

export function DietCard({
  title,
  strength,
  takeaway,
  evidence,
  nextSteps,
  caveats = [],
  contextChips,
  tone = "light",
}: DietCardProps) {
  const tokens = toneTokens[tone];
  const pillClass = strengthPalette[tone][strength];

  return (
    <div className={cn("rounded-2xl border p-4 shadow-sm", tokens.container)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className={cn("text-base font-semibold leading-tight", tokens.title)}>{title}</p>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", pillClass)}>
                Signal strength: {strength}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs text-slate-100">
              Signal strength reflects how consistently this analyte pattern aligns with a diet-related explanation. It
              is not diagnostic.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className={cn("mt-2 text-sm leading-relaxed", tokens.takeaway)}>{takeaway}</p>

      {contextChips && contextChips.length > 0 && (
        <div className="mt-3">
          <p className={cn("text-xs font-semibold uppercase tracking-wide", tokens.label)}>Context flags</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {contextChips.map((chip) => (
              <span key={chip} className={cn("rounded-full px-3 py-1 text-xs", tokens.chip)}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-wide", tokens.label)}>Top evidence</p>
          <div className="mt-2">
            <EvidenceList items={evidence} tone={tone} />
          </div>
        </div>
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-wide", tokens.label)}>Practical next steps</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
            {nextSteps.map((step) => (
              <li key={step} className={tokens.bullet}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {caveats.length > 0 && (
        <div className={cn("mt-4 flex items-start gap-2 text-xs leading-relaxed", tokens.caveat)}>
          <Info className="h-4 w-4 shrink-0 opacity-70" />
          <div className="space-y-1">
            {caveats.map((caveat) => (
              <p key={caveat}>{caveat}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
