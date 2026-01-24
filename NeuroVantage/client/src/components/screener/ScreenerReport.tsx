import { Link } from "wouter";
import { Activity, Printer, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReportModel } from "@/lib/cognitiveScoring";
import type { SubmissionStatus } from "@/pages/Screener";
import { cn } from "@/lib/utils";
import { SCREENER_LIMITS } from "@/lib/thresholds";

type Props = {
  formValues: { firstName: string; lastName: string; age?: string };
  report: ReportModel;
  mode?: string | null;
  syncStatus: SubmissionStatus;
  allTestsCompleted: boolean;
  anyTestsSkipped: boolean;
  questionnaireOnly: boolean;
  onRestart: () => void;
  onViewJson: () => void;
  onReturnHome: () => void;
};

const statusMeta: Record<
  SubmissionStatus,
  { label: string; tone: "default" | "secondary" | "outline" | "destructive"; description: string }
> = {
  idle: {
    label: "Not synced",
    tone: "outline",
    description: "Waiting to sync with the clinic dashboard.",
  },
  pending: {
    label: "Saving…",
    tone: "secondary",
    description: "Syncing this visit to the clinic dashboard.",
  },
  success: {
    label: "Saved",
    tone: "default",
    description: "Stored in the clinic dashboard.",
  },
  error: {
    label: "Sync failed",
    tone: "destructive",
    description: "Unable to sync this visit.",
  },
};

const badgeToneMap: Record<string, { className: string }> = {
  warning: { className: "bg-amber-100 text-amber-800 border-amber-200" },
  success: { className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  neutral: { className: "bg-slate-100 text-slate-700 border-slate-200" },
  info: { className: "bg-primary/10 text-primary border-primary/20" },
};

const disclaimerParagraphs = [
  "The Neurovantage screener is a preliminary screening tool that highlights potential patterns in mood, attention, reaction speed, memory, and related cognitive domains. It is not a diagnostic test.",
  "Performance can be influenced by fatigue, sleep, stress, medications, and overall medical status. Scores may not reflect underlying neurological or psychiatric conditions.",
  "This report is for educational use only and is not a treatment plan or medical advice. Reviewing this report does not create a provider–patient relationship.",
  "Seek in-person care for new or worsening symptoms, and contact emergency services or a crisis resource immediately if you experience acute distress or a potential emergency.",
];

export function ScreenerReport({
  formValues,
  report,
  mode,
  syncStatus,
  allTestsCompleted,
  anyTestsSkipped,
  questionnaireOnly,
  onRestart,
  onViewJson,
  onReturnHome,
}: Props) {
  const initials = `${formValues.firstName?.charAt(0) ?? ""}${formValues.lastName?.charAt(0) ?? ""}`.toUpperCase() || "NV";
  const status = statusMeta[syncStatus ?? "idle"];
  const participantName = `${formValues.firstName ?? "Participant"} ${formValues.lastName ?? ""}`.trim();
  const generatedAt = new Date().toLocaleString(undefined, {
    hour12: true,
    timeZoneName: "short",
  });
  const modeLabel = mode ?? "Standardized multi-domain cognitive screener";
  const devToggle =
    (typeof process !== "undefined" && process.env.NODE_ENV !== "production") ||
    import.meta.env?.VITE_SHOW_DEVTOOLS === "true" ||
    import.meta.env?.NEXT_PUBLIC_SHOW_DEVTOOLS === "true";
  const renderCitation = (text: string) => {
    const match = text.match(/PMID:\s*(\d+)/i);
    if (!match) return text;
    const pmid = match[1];
    const cleaned = text.replace(/\s*PMID:\s*\d+\.?/i, "").trim();
    return (
      <>
        {cleaned}{" "}
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
          className="font-semibold text-primary hover:underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          PMID: {pmid}
        </a>
        .
      </>
    );
  };

  const taskSummaries = (report as any)?.taskSummaries ?? {};
  const coerceScore = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (
      value &&
      typeof value === "object" &&
      "value" in (value as Record<string, unknown>) &&
      typeof (value as Record<string, unknown>).value === "number"
    ) {
      const extracted = (value as Record<string, unknown>).value as number;
      return Number.isFinite(extracted) ? extracted : null;
    }
    return null;
  };

  const reactionValueMs =
    coerceScore(report.scores?.reaction) ??
    coerceScore(taskSummaries?.reaction?.medianRtMs) ??
    coerceScore(taskSummaries?.reaction?.meanRtMs) ??
    null;

  const visualMemoryItems =
    coerceScore(report.scores?.memory) ??
    coerceScore(taskSummaries?.memory?.rawScore) ??
    coerceScore(taskSummaries?.visual_memory?.rawScore) ??
    null;

  const executiveScore =
    coerceScore(report.scores?.executive) ??
    coerceScore(taskSummaries?.stroop?.rawScore) ??
    coerceScore(taskSummaries?.executive?.rawScore) ??
    null;

  const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
  const getAxisPosition = (
    value: number | null | undefined,
    max = 1000,
    invert = true
  ) => {
    if (value == null || Number.isNaN(value)) return null;
    const clampedValue = Math.max(0, Math.min(max, value));
    const percent = clampPercent((clampedValue / max) * 100);
    return invert ? 100 - percent : percent;
  };
  const reactionMarkerPosition = getAxisPosition(reactionValueMs);
  const reactionMedianPosition = getAxisPosition(report.reactionAgeMedianMs);
  const reactionMarkerVariant =
    report.reactionNormBand === "below" ? "warning" : "success";
  const reactionValueLabel =
    reactionValueMs !== null ? `${Math.round(reactionValueMs)} ms` : "No data";
  const memoryValueLabel =
    visualMemoryItems !== null ? `${visualMemoryItems} / 16` : "No data";
  const executiveValueLabel =
    executiveScore !== null ? `${executiveScore}` : "No data";
  const reactionSummary =
    "Simple visual reaction time task; lower values indicate faster responses.";
  const memorySummary =
    "Visuo-spatial span benchmarked to Corsi-style tasks; higher counts mean longer recall sequences.";
  const executiveSummary =
    "Composite score from a Stroop-style inhibition task; higher values indicate stronger control.";

  const memoryMarkerPosition = getAxisPosition(visualMemoryItems, 16, false);
  const memoryMedianPosition = getAxisPosition(
    report.visualMemoryMedianItems ?? null,
    16,
    false
  );
  const executiveMarkerPosition = getAxisPosition(executiveScore, 2000, false);
  const executiveReferencePosition = getAxisPosition(1300, 2000, false);

  const reactionStatusLabel =
    report.reactionNormBand === "below"
      ? "Slower than expected"
      : report.reactionNormBand === "above"
      ? "Faster than expected"
      : report.reactionNormBand === "average"
      ? "Within typical range"
      : "Not enough data";
  const memoryStatusLabel = bandStatusLabel(report.memoryNormBand);
  const executiveStatusLabel =
    report.executiveNormBand === "below"
      ? "Weaker inhibition control"
      : report.executiveNormBand === "above"
      ? "Stronger inhibition control"
      : report.executiveNormBand === "average"
      ? "Within expected range"
      : "Not enough data";

  const reactionFootnote =
    report.reactionAgeMedianMs != null
      ? `Slower vs age median (~${report.reactionAgeMedianMs} ms)`
      : "Age median unavailable";
  const memoryFootnote =
    report.visualMemoryMedianItems != null
      ? `Reference ≈ ${report.visualMemoryMedianItems} items`
      : "Reference unavailable";
  const executiveFootnote = "Reference ≈ 1300";

  const formattedRecommendations = report.recommendations.map((suggestion) => {
    if (suggestion.title === "Executive Function Variance") {
      return {
        ...suggestion,
        title: "Executive Function Variability",
        desc: "Performance on inhibition and control tasks was lower than typical for this type of screener. This pattern can be influenced by stress, sleep, medications, mood, and medical conditions.",
      };
    }
    if (suggestion.title === "Slowed Processing Speed") {
      return {
        ...suggestion,
        title: "Slowed Processing Speed",
        desc: "Reaction time was slower than typical for your age group on this simple visual task. Processing speed can be affected by fatigue, medications, mood, sleep, and general health.",
      };
    }
    return suggestion;
  });

  const highLevelFlags = [
    report.scores.depression != null
      ? `Mood: ${toTitleCase(
          report.depressionSeverity
        )} depressive symptoms (PHQ-2–style ${report.scores.depression}/${SCREENER_LIMITS.moodMax})`
      : null,
    report.scores.attention != null
      ? `Attention: ${
          report.derivedFlags.hasAttentionFlag
            ? "Elevated self-reported symptoms"
            : "Within expected range"
        }`
      : null,
    "Anxiety: Not captured in this brief screener",
  ].filter(Boolean) as string[];

  const dataQualityNote = questionnaireOnly
    ? "Task-based metrics not available for this visit."
    : report.dataQuality.summary === "limited"
    ? "Data quality limited (review trials/questionnaire completeness)."
    : anyTestsSkipped
    ? "Some tasks were skipped; interpret task metrics with caution."
    : "Task and questionnaire data met quality checks.";

  const moodSeverityLabel = toTitleCase(report.depressionSeverity);
  const symptomBadges = [
    {
      label: "Mood",
      value:
        report.scores.depression != null
          ? `${report.scores.depression} / ${SCREENER_LIMITS.moodMax}`
          : "Not captured",
      tone:
        report.scores.depression != null && report.derivedFlags.hasDepressionFlag
          ? "warning"
          : "neutral",
      helper:
        report.scores.depression != null
          ? `Consistent with ${moodSeverityLabel.toLowerCase()} depressive symptoms on PHQ-2–style screeners.`
          : "Not captured in this abbreviated screener.",
    },
    {
      label: "Attention",
      value:
        report.scores.attention != null
          ? `${report.scores.attention} / ${SCREENER_LIMITS.attentionMax}`
          : "Not captured",
      tone: report.derivedFlags.hasAttentionFlag ? "warning" : "neutral",
      helper: report.derivedFlags.hasAttentionFlag
        ? "Self-report suggests focus challenges that merit review."
        : "Self-report did not indicate notable attention burden.",
    },
    {
      label: "Anxiety",
      value: "Not captured",
      tone: "neutral",
      helper: "Anxiety items are not included in this abbreviated screener.",
      muted: true,
    },
  ];

  const missingTaskLabels: string[] = [];
  if (reactionValueMs === null) missingTaskLabels.push("Reaction speed");
  if (visualMemoryItems === null) missingTaskLabels.push("Visual memory");
  if (executiveScore === null) missingTaskLabels.push("Executive function");

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-white/95 px-6 py-4 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur print:static print:border-none print:bg-transparent print:backdrop-blur-none">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-full border border-slate-200">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-display font-bold text-primary leading-tight">
                  Cognitive Function Screener
                </h2>
                <Badge
                  variant={status.tone}
                  className={cn(
                    "text-xs",
                    status.tone === "outline" && "bg-slate-50 text-slate-600"
                  )}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Participant: {participantName || "Not provided"}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Age: {formValues.age ?? "n/a"}</span>
                <span aria-hidden className="text-slate-300">
                  •
                </span>
                <span>Generated: {generatedAt}</span>
                <span aria-hidden className="text-slate-300">
                  •
                </span>
                <span>Mode: {modeLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-2 print:hidden">
            <Button
              variant="ghost"
              className="border border-slate-200"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            {devToggle && (
              <Button variant="outline" onClick={onViewJson}>
                View JSON
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{status.description}</p>
      </div>

      <div className="space-y-8 px-6 py-8 print:px-0 print:py-6">
        <section className="space-y-4">
          <SectionHeader title="Executive summary" />
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Highlights
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {highLevelFlags.map((flag, idx) => (
                <p key={idx} className="text-sm text-slate-700">
                  {flag}
                </p>
              ))}
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  Data quality:
                </span>{" "}
                {dataQualityNote}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Key results" />
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Reaction speed"
              value={reactionValueLabel}
              unit={reactionValueMs !== null ? "milliseconds" : undefined}
              badgeLabel={reactionStatusLabel}
              badgeTone={reactionMarkerVariant}
              description={reactionFootnote}
              helper={reactionSummary}
            />
            <MetricCard
              label="Visual memory"
              value={memoryValueLabel}
              unit={visualMemoryItems !== null ? "items recalled" : undefined}
              badgeLabel={memoryStatusLabel}
              badgeTone="warning"
              description={memoryFootnote}
              helper={memorySummary}
            />
            <MetricCard
              label="Executive function"
              value={executiveValueLabel}
              unit="composite score"
              badgeLabel={executiveStatusLabel}
              badgeTone={
                report.executiveNormBand === "below" ? "warning" : "success"
              }
              description={executiveFootnote}
              helper={executiveSummary}
            />
          </div>
          <TooltipProvider>
            <div className="grid gap-3 md:grid-cols-3">
              {symptomBadges.map((badge) => (
                <SymptomBadge key={badge.label} badge={badge} />
              ))}
            </div>
          </TooltipProvider>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Detailed metrics" />
          <div className="space-y-6">
            <DetailedMetricCard
              title="Reaction speed"
              value={reactionValueLabel}
              status={reactionStatusLabel}
              helper={reactionSummary}
              markerPosition={reactionMarkerPosition}
              referencePosition={reactionMedianPosition}
              referenceLabel={
                reactionMedianPosition !== null
                  ? `Age median ≈ ${report.reactionAgeMedianMs} ms`
                  : undefined
              }
              minLabel="Slower • 1000 ms"
              maxLabel="Faster • 0 ms"
              variant={reactionMarkerVariant}
            />
            <DetailedMetricCard
              title="Visual memory"
              value={memoryValueLabel}
              status={memoryStatusLabel}
              helper={memorySummary}
              markerPosition={memoryMarkerPosition}
              referencePosition={memoryMedianPosition}
              referenceLabel={memoryFootnote}
              minLabel="0 items"
              maxLabel="16 items"
              variant="success"
            />
            <DetailedMetricCard
              title="Executive function"
              value={executiveValueLabel}
              status={executiveStatusLabel}
              helper={executiveSummary}
              markerPosition={executiveMarkerPosition}
              referencePosition={executiveReferencePosition}
              referenceLabel={executiveFootnote}
              minLabel="Lower control"
              maxLabel="Stronger control"
              variant="info"
            />
          </div>
          {!allTestsCompleted && (
            <Alert className="mt-4 text-sm text-slate-700">
              <AlertDescription>
                Cognitive tasks not completed:{" "}
                {missingTaskLabels.length > 0
                  ? missingTaskLabels.join(", ")
                  : "None"}
              </AlertDescription>
            </Alert>
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Suggested next steps" />
          <Alert className="border-primary/40 bg-primary/5">
            <AlertTitle className="flex items-center gap-2 text-primary">
              <Activity className="h-4 w-4" />
              Suggested actions
            </AlertTitle>
            <AlertDescription className="space-y-3 text-muted-foreground">
              <p>
                Schedule a follow-up visit with a licensed clinician to review these results in context and consider labs, sleep evaluation, or formal testing if needed.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {formattedRecommendations.map((suggestion, index) => (
                  <li key={`${suggestion.title}-${index}`}>
                    <span className="font-medium text-slate-900">{suggestion.title}:</span>{" "}
                    {suggestion.desc}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button asChild>
                  <Link href="/clinic-demo">Schedule follow-up</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Evidence-based interpretation" />
          <Accordion
            type="multiple"
            className="rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden"
          >
            {report.observations.map((obs, idx) => (
              <AccordionItem key={obs.title} value={`obs-${idx}`}>
                <AccordionTrigger className="px-4">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-900">
                      {obs.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {truncateText(obs.description, 120)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 text-sm text-slate-700">
                  <p>{obs.description}</p>
                  {obs.subpoints && obs.subpoints.length > 0 && (
                    <details className="mt-3 text-xs text-muted-foreground">
                      <summary className="cursor-pointer text-primary font-medium">
                        Show references
                      </summary>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {obs.subpoints.map((sub, subIdx) => (
                          <li key={subIdx}>{renderCitation(sub)}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 print:block">
            {report.observations.map((obs) => (
              <div key={obs.title} className="mb-3 last:mb-0">
                <p className="font-semibold text-slate-900">{obs.title}</p>
                <p>{obs.description}</p>
                {obs.subpoints && obs.subpoints.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground space-y-1">
                    {obs.subpoints.map((sub, idx) => (
                      <li key={`${obs.title}-${idx}`}>{renderCitation(sub)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Disclaimer" />
          <details className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700 print:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-primary">
              Screening tool, not diagnostic — read full disclaimer
            </summary>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground leading-relaxed">
              {disclaimerParagraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          </details>
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-muted-foreground leading-relaxed print:block">
            {disclaimerParagraphs.map((text, idx) => (
              <p key={idx} className="mb-2 last:mb-0">
                {text}
              </p>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-2 print:hidden sm:flex-row">
          <Button variant="ghost" className="w-full sm:w-auto" onClick={onReturnHome}>
            Return home
          </Button>
        </div>

        {devToggle && (
          <div
            className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-muted-foreground print:hidden"
            data-hide-print="true"
          >
            <p className="uppercase tracking-wide text-[11px] font-semibold text-slate-500">
              Developer tools
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={onViewJson}>
                View JSON
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={onRestart}>
                Start new screening
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  unit?: string;
  badgeLabel?: string;
  badgeTone?: keyof typeof badgeToneMap;
  description?: string;
  helper?: string;
};

function MetricCard({
  label,
  value,
  unit,
  badgeLabel,
  badgeTone = "neutral",
  description,
  helper,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {badgeLabel && (
        <Badge
          variant="outline"
          className={cn(
            "mt-2 text-[11px]",
            badgeToneMap[badgeTone]?.className ?? ""
          )}
        >
          {badgeLabel}
        </Badge>
      )}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
      {helper && (
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{helper}</p>
      )}
    </div>
  );
}

type SymptomBadgeProps = {
  badge: {
    label: string;
    value: string;
    tone: keyof typeof badgeToneMap;
    helper: string;
    muted?: boolean;
  };
};

function SymptomBadge({ badge }: SymptomBadgeProps) {
  const toneClasses = badgeToneMap[badge.tone]?.className ?? "";
  const content = (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 shadow-sm",
        badge.muted
          ? "border-dashed border-slate-200 bg-white text-slate-400"
          : cn("border-slate-200 bg-white text-slate-800", toneClasses)
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {badge.label}
      </p>
      <div className="text-lg font-semibold">{badge.value}</div>
      <p className="text-xs text-muted-foreground">{badge.helper}</p>
    </div>
  );

  if (badge.muted) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          Not included in this abbreviated screener.
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

type DetailedMetricCardProps = {
  title: string;
  value: string;
  status: string;
  helper: string;
  markerPosition: number | null;
  referencePosition: number | null;
  referenceLabel?: string;
  minLabel: string;
  maxLabel: string;
  variant: keyof typeof badgeToneMap;
};

function DetailedMetricCard({
  title,
  value,
  status,
  helper,
  markerPosition,
  referencePosition,
  referenceLabel,
  minLabel,
  maxLabel,
  variant,
}: DetailedMetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[11px]",
            badgeToneMap[variant]?.className ?? ""
          )}
        >
          {status}
        </Badge>
      </div>
      <div className="relative mt-4 pt-6">
        {markerPosition !== null && (
          <div
            className="absolute -top-2 left-0 flex flex-col items-center text-[10px] font-semibold text-slate-700"
            style={{ left: `${markerPosition}%`, transform: "translateX(-50%)" }}
          >
            <span
              className={cn(
                "rounded px-2 py-0.5 border bg-white",
                badgeToneMap[variant]?.className ?? ""
              )}
            >
              {value}
            </span>
            <span className="mt-1 h-3 w-[2px] bg-slate-500/70" />
          </div>
        )}
        <div className="h-3 rounded-full bg-slate-200" />
        {referencePosition !== null && (
          <div
            className="absolute inset-y-2 w-[2px] bg-slate-500/60"
            style={{ left: `${referencePosition}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {referenceLabel && (
        <p className="mt-2 text-[11px] text-muted-foreground">{referenceLabel}</p>
      )}
      <p className="mt-2 text-sm text-slate-700">{helper}</p>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4 text-primary" />
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
    </div>
  );
}

function bandStatusLabel(band: string | undefined | null) {
  switch (band) {
    case "below":
      return "Below typical range";
    case "average":
      return "Within typical range";
    case "above":
      return "Above typical range";
    default:
      return "Not enough data";
  }
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function truncateText(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}…`;
}
