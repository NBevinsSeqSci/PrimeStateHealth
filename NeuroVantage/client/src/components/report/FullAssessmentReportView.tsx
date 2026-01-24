import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMemoryMedianForAge, getReactionMedianForAge } from "@/lib/cognitiveScoring";
import { formatMs, formatPercent } from "@/lib/format";
import {
  getAttentionLabel,
  getAxisPosition,
  getDigitSpanStatus,
  getExecutiveStatus,
  getInhibitionStatus,
  getGadSeverityLabel,
  getListLearningStatus,
  getOrientationStatus,
  getPhqSeverityLabel,
  getRawScore,
  getReactionStatus,
  getValuesByPrefix,
  getVisualMemoryStatus,
  isTaskCompleted,
} from "@/lib/fullAssessmentReport";

type Recommendation = {
  title: string;
  clinicianNote: string;
  category?: string;
  patientText: string;
  basedOn?: string;
};

export type FullAssessmentReportData = {
  demographics: Record<string, any>;
  completedAt: string | null;
  cognitiveScores: Record<string, any>;
  screenerScores: Record<string, any>;
  recommendations: Recommendation[];
};

export type FullAssessmentReportViewProps = {
  report: FullAssessmentReportData;
  onDownload: () => void;
  showDevData: boolean;
  setShowDevData: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const reportTaskKeys = [
  "orientation",
  "symbol",
  "list",
  "visual_memory",
  "cpt",
  "digit_span",
  "stroop",
  "go_no_go",
  "trails",
  "fluency",
];

export function FullAssessmentReportView({
  report,
  onDownload,
  showDevData,
  setShowDevData,
}: FullAssessmentReportViewProps) {
  const {
    demographics,
    completedAt,
    cognitiveScores,
    screenerScores,
    recommendations,
  } = report;
  const participantName = [demographics.firstName, demographics.lastName].filter(Boolean).join(" ") || "—";
  const ageDisplay = demographics.age ?? demographics.ageYears ?? "—";
  const ageRaw = demographics.age ?? demographics.ageYears ?? null;
  const ageNumeric = (() => {
    if (typeof ageRaw === "number" && Number.isFinite(ageRaw)) return ageRaw;
    const parsed = Number(ageRaw);
    return Number.isFinite(parsed) ? parsed : null;
  })();
  const generatedDate = completedAt ? new Date(completedAt) : new Date();
  const formattedDate = generatedDate.toLocaleString();
  const modeLabel = "Clinic-based multi-domain assessment";

  const completedTaskKeys = reportTaskKeys.filter((key) => isTaskCompleted(cognitiveScores[key]));
  const fullyCompleted = completedTaskKeys.length === reportTaskKeys.length;
  const anyCompleted = completedTaskKeys.length > 0;
  const questionnaireOnly = !anyCompleted;
  const completenessLabel = fullyCompleted
    ? "Complete assessment"
    : anyCompleted
    ? "Partial (some tasks skipped)"
    : "Questionnaire only";
  const completenessClasses = fullyCompleted
    ? "bg-emerald-50 text-emerald-700"
    : anyCompleted
    ? "bg-amber-50 text-amber-700"
    : "bg-slate-100 text-slate-600";
  const assessmentType = fullyCompleted
    ? "Full battery completed"
    : anyCompleted
    ? "Partial battery (some tasks not completed)"
    : "Questionnaire-only visit (no tasks completed)";

  const phqValues = getValuesByPrefix(screenerScores, "phq9_");
  const phqTotal = phqValues.length ? phqValues.reduce((sum, value) => sum + value, 0) : null;
  const phqSeverity = getPhqSeverityLabel(phqTotal);

  const gadValues = getValuesByPrefix(screenerScores, "gad7_");
  const gadTotal = gadValues.length ? gadValues.reduce((sum, value) => sum + value, 0) : null;
  const gadSeverity = getGadSeverityLabel(gadTotal);

  const attentionValues = getValuesByPrefix(screenerScores, "attention_");
  const attentionAvg =
    attentionValues.length > 0
      ? Number((attentionValues.reduce((sum, value) => sum + value, 0) / attentionValues.length).toFixed(1))
      : null;
  const attentionLabel = getAttentionLabel(attentionAvg);
  const dataQualityNote = questionnaireOnly
    ? "Task-based metrics not available for this visit."
    : fullyCompleted
    ? "Task-based metrics derived from a complete battery."
    : "Some tasks were not completed; interpret task-based metrics with caution.";
  const highLevelFlags = [
    phqTotal !== null
      ? `Mood: ${phqSeverity} depressive symptoms (PHQ-9–style ${phqTotal}/27).`
      : null,
    gadTotal !== null
      ? `Anxiety: ${gadSeverity} anxiety symptoms (GAD-7–style ${gadTotal}/21).`
      : null,
    attentionAvg !== null
      ? `Attention: ${attentionLabel}${attentionAvg !== null ? ` (avg ${attentionAvg}/4 self-report)` : ""}`
      : null,
  ].filter(Boolean) as string[];

  const reactionScoreRaw = getRawScore(cognitiveScores.cpt);
  const reactionScore = reactionScoreRaw !== null ? Math.round(reactionScoreRaw) : null;
  const reactionMedian = getReactionMedianForAge(ageNumeric);
  const reactionStatus = getReactionStatus(reactionScore);

  const symbolScore = getRawScore(cognitiveScores.symbol);
  const trailsScore = getRawScore(cognitiveScores.trails);
  const stroopScore = getRawScore(cognitiveScores.stroop);
  const orientationScore = getRawScore(cognitiveScores.orientation);
  const listScore = getRawScore(cognitiveScores.list);
  const executiveScore = stroopScore !== null ? Math.round(stroopScore) : null;
  const executiveStatus = getExecutiveStatus(executiveScore);

  const inhibitionScoreRaw = getRawScore(cognitiveScores.go_no_go);
  const inhibitionScore = inhibitionScoreRaw !== null ? Math.round(inhibitionScoreRaw) : null;
  const inhibitionStatus = getInhibitionStatus(inhibitionScore);
  const toNumber = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) ? value : null;
  const goNoGoSummary = (() => {
    const entry = cognitiveScores.go_no_go;
    if (!entry || typeof entry !== "object") return null;
    const summary = (entry as { summary?: unknown }).summary;
    if (!summary || typeof summary !== "object") return null;
    const safeSummary = summary as {
      commissionErrors?: unknown;
      omissionErrors?: unknown;
      commissionRate?: unknown;
      omissionRate?: unknown;
      medianGoRtMs?: unknown;
    };
    return {
      commissionErrors: toNumber(safeSummary.commissionErrors),
      omissionErrors: toNumber(safeSummary.omissionErrors),
      commissionRate: toNumber(safeSummary.commissionRate),
      omissionRate: toNumber(safeSummary.omissionRate),
      medianGoRtMs: toNumber(safeSummary.medianGoRtMs),
    };
  })();
  const goNoGoDetails = goNoGoSummary
    ? [
        {
          label: "Commission errors",
          value: `${goNoGoSummary.commissionErrors ?? "—"} (${formatPercent(goNoGoSummary.commissionRate)})`,
        },
        {
          label: "Omission errors",
          value: `${goNoGoSummary.omissionErrors ?? "—"} (${formatPercent(goNoGoSummary.omissionRate)})`,
        },
        {
          label: "Median Go RT",
          value: formatMs(goNoGoSummary.medianGoRtMs),
        },
      ]
    : undefined;

  const digitScore = getRawScore(cognitiveScores.digit_span);
  const digitStatus = getDigitSpanStatus(digitScore);

  const visualScore = getRawScore(cognitiveScores.visual_memory);
  const visualStatus = getVisualMemoryStatus(visualScore);
  const visualMedian = getMemoryMedianForAge(ageNumeric);
  const orientationStatus = getOrientationStatus(orientationScore);
  const listStatus = getListLearningStatus(listScore);

  const summaryStrip: Array<{ title: string; value: string; status: string }> = [];

  const cognitiveTaskLabels: { key: string; label: string }[] = [
    { key: "cpt", label: "Reaction speed" },
    { key: "visual_memory", label: "Visual memory" },
    { key: "digit_span", label: "Digit span" },
    { key: "symbol", label: "Symbol coding" },
    { key: "stroop", label: "Stroop inhibition" },
    { key: "go_no_go", label: "Impulse control (Go/No-Go)" },
    { key: "trails", label: "Trails set-shifting" },
    { key: "list", label: "Verbal list learning" },
    { key: "fluency", label: "Fluency" },
  ];
  const missingTaskLabels = cognitiveTaskLabels
    .filter((task) => !isTaskCompleted(cognitiveScores[task.key]))
    .map((task) => task.label);

  const compositeStatus = questionnaireOnly
    ? "Composite score not calculated - no task data."
    : fullyCompleted
    ? "Composite score in review - awaiting release."
    : "Composite score not calculated - missing cognitive task data.";

  const metricBlocks = [
    {
      key: "orientation",
      label: "Orientation Check (date/location awareness)",
      value: orientationScore,
      display: orientationScore !== null ? `${orientationScore} / 6` : "—",
      status: orientationStatus,
      axis: {
        max: 6,
        participant: orientationScore,
        reference: 6,
        referenceLabel: "Full score = 6",
        minLabel: "Partial orientation • 0",
        maxLabel: "Fully oriented • 6",
      },
      orientation: true,
    },
    {
      key: "cpt",
      label: "Processing Speed (Reaction Task - tap when a target flashes)",
      value: reactionScore,
      display: reactionScore !== null ? `${reactionScore} ms` : "—",
      status: reactionStatus,
      axis: {
        max: 1000,
        invert: true,
        participant: reactionScore,
        reference: reactionMedian,
        referenceLabel: reactionMedian ? `Age median ≈ ${reactionMedian} ms` : undefined,
        minLabel: "Slower • 1000 ms",
        maxLabel: "Faster • 0 ms",
      },
    },
    {
      key: "symbol",
      label: "Symbol Coding (match symbols to numbers quickly)",
      value: symbolScore,
      display: symbolScore !== null ? `${symbolScore}` : "—",
      status: symbolScore !== null ? (symbolScore >= 40 ? "Within expected range" : "Below typical range") : "Not captured this visit",
      axis: {
        max: 2000,
        participant: symbolScore,
        reference: 1300,
        referenceLabel: "Reference ≈ 1300",
        minLabel: "Lower score • 0",
        maxLabel: "Higher score • 2000",
      },
    },
    {
      key: "trails",
      label: "Trails (alternate number-letter sequence)",
      value: trailsScore,
      display: trailsScore !== null ? `${trailsScore} sec` : "—",
      status: trailsScore !== null ? (trailsScore <= 60 ? "Within expected range" : "Slower set-shifting") : "Not captured this visit",
      axis: {
        max: 200,
        participant: trailsScore,
        reference: 75,
        referenceLabel: "Reference ≈ 75 sec",
        minLabel: "Slower • 200 s",
        maxLabel: "Faster • 0 s",
        invert: true,
      },
    },
    {
      key: "stroop",
      label: "Stroop (name ink color, ignore the word)",
      value: executiveScore,
      display: executiveScore !== null ? `${executiveScore}` : "—",
      status: executiveStatus,
      axis: {
        max: 2000,
        participant: executiveScore,
        reference: 1300,
        referenceLabel: "Reference ≈ 1300",
        minLabel: "Lower control • 0",
        maxLabel: "Stronger control • 2000",
      },
    },
    {
      key: "go_no_go",
      label: "Impulse Control / Response Inhibition (Go/No-Go task)",
      value: inhibitionScore,
      display: inhibitionScore !== null ? `${inhibitionScore}` : "—",
      status: inhibitionStatus,
      details: goNoGoDetails,
      axis: {
        max: 100,
        participant: inhibitionScore,
        reference: 75,
        referenceLabel: "Reference ≈ 75",
        minLabel: "Weaker control • 0",
        maxLabel: "Stronger control • 100",
      },
    },
    {
      key: "digit_span",
      label: "Digit Span (repeat sequences forward/backward)",
      value: digitScore,
      display: digitScore !== null ? `${digitScore}` : "—",
      status: digitStatus,
      axis: {
        max: 9,
        participant: digitScore,
        reference: 6,
        referenceLabel: "Typical span ≈ 6 digits",
        minLabel: "Shorter span • 0 digits",
        maxLabel: "Longer span • 9 digits",
      },
    },
    {
      key: "visual_memory",
      label: "Visual Memory (recall highlighted square patterns)",
      value: visualScore,
      display: visualScore !== null ? `${visualScore}` : "—",
      status: visualStatus,
      axis: {
        max: 16,
        participant: visualScore,
        reference: visualMedian ?? undefined,
        referenceLabel: visualMedian ? `Age median ≈ ${visualMedian} items` : undefined,
        minLabel: "Shorter span • 0 items",
        maxLabel: "Longer span • 16 items",
      },
    },
    {
      key: "list",
      label: "Word Recall (learn and recall a word list)",
      value: listScore,
      display: listScore !== null ? `${listScore}` : "—",
      status: listStatus,
      axis: {
        max: 30,
        participant: listScore,
        reference: 20,
        referenceLabel: "Typical recall ≈ 20 words",
        minLabel: "Fewer words • 0",
        maxLabel: "More words • 30",
      },
    },
  ];
  const availableMetricBlocks = metricBlocks.filter((metric) => metric.value !== null);

  const symptomDomains = [
    {
      key: "mood",
      label: "Mood",
      scoreLabel: phqTotal !== null ? `${phqTotal} / 27` : "Not captured",
      severity: phqTotal !== null ? phqSeverity : "Not captured",
      comment:
        phqTotal !== null
          ? `Consistent with ${phqSeverity.toLowerCase()} depressive symptoms in PHQ-9 style scales.`
          : "Mood screener not completed this visit.",
      scale: "PHQ-9–style",
      score: phqTotal,
      maxScore: 27,
    },
    {
      key: "anxiety",
      label: "Anxiety",
      scoreLabel: gadTotal !== null ? `${gadTotal} / 21` : "Not captured",
      severity: gadTotal !== null ? gadSeverity : "Not captured",
      comment:
        gadTotal !== null
          ? `Score aligns with ${gadSeverity.toLowerCase()} anxiety severity on GAD-7 style measures.`
          : "Anxiety screener not completed this visit.",
      scale: "GAD-7–style",
      score: gadTotal,
      maxScore: 21,
    },
    {
      key: "attention",
      label: "Attention",
      scoreLabel: attentionAvg !== null ? `${attentionAvg} / 4` : "Not captured",
      severity: attentionLabel,
      comment:
        attentionAvg !== null
          ? attentionLabel === "Elevated self-reported symptoms"
            ? "Self-report suggests meaningful attention-related challenges on daily tasks."
            : "Self-report did not indicate notable attention burden."
          : "Attention items were not completed.",
      scale: "Self-report symptom index",
      score: attentionAvg,
      maxScore: 4,
    },
  ];

  const devMode = process.env.NODE_ENV !== "production";

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">Full Test / Cognitive Report</h2>
            <p className="text-sm text-slate-600">Participant: {participantName}</p>
            <p className="text-xs text-slate-500">
              Age: {ageDisplay} • Generated: {formattedDate} • Mode: {modeLabel}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${completenessClasses}`}>
              {completenessLabel}
            </span>
            {questionnaireOnly && (
              <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold">
                Questionnaire-only visit - task-based measures not completed
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Executive Summary</p>
            <p className="text-base font-semibold text-slate-900">{assessmentType}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {highLevelFlags.map((flag, idx) => (
              <div key={idx} className="text-sm text-slate-700">
                {flag}
              </div>
            ))}
            <div className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Data quality:</span> {dataQualityNote}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {summaryStrip.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-slate-500">{item.title}</span>
              <div className="text-lg font-semibold text-slate-900">{item.value}</div>
              <div className="text-xs text-slate-600">{item.status}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 md:p-7 space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Symptom Screeners</h3>
          <p className="text-sm text-slate-600">Mood, anxiety, and attention ratings contextualize the cognitive findings.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {symptomDomains.map((domain) => (
            <SymptomDomainCard key={domain.key} domain={domain} />
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Scores are based on items adapted from PHQ-9 / GAD-7 style instruments, and severity bands follow published cutpoints.
        </p>
      </Card>

      {missingTaskLabels.length > 0 && (
        <Card className="p-5 border-dashed border-slate-300 bg-white/90">
          <h3 className="text-sm font-semibold text-slate-900">Cognitive Tasks Not Completed</h3>
          <p className="text-sm text-slate-600 mt-1">
            The following tasks lacked interpretable data this visit:{" "}
            <span className="font-medium text-slate-900">{missingTaskLabels.join(", ")}</span>.
          </p>
          {questionnaireOnly && (
            <p className="text-xs text-slate-500 mt-2">
              Task-based metrics (reaction speed, executive function, memory) are not available for this visit because no tasks were completed.
            </p>
          )}
        </Card>
      )}

      <Card className="p-6 md:p-8 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Cognitive Task Results</h3>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{compositeStatus}</span>
        </div>
        {availableMetricBlocks.length > 0 ? (
          <div className="space-y-5">
            {availableMetricBlocks.map((metric) => (
              <MetricBlock
                key={metric.label}
                label={metric.label}
                value={metric.display}
                status={metric.status}
                axis={metric.axis}
                orientation={metric.orientation}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 italic">
            Task-based metrics (reaction speed, executive function, memory) are not available for this visit because no tasks were completed.
          </p>
        )}
        {!fullyCompleted && anyCompleted && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
            Some tasks were skipped; interpret available task metrics with caution.
          </p>
        )}
      </Card>

      <Card className="p-6 md:p-7 space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recommendations</h3>
          <p className="text-sm text-slate-600">
            Each recommendation references the exact data point that triggered it so clinicians can rapidly validate the suggestion.
          </p>
        </div>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={`${rec.title}-${idx}`} className="rounded-2xl border border-slate-200 bg-white/95 p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold text-slate-900">{rec.title}</p>
                  {rec.category && (
                    <span className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                      {rec.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700">{rec.patientText}</p>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Clinician note:</span> {rec.clinicianNote}
                </p>
                {rec.basedOn && (
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Based on:</span> {rec.basedOn}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No specific recommendations were generated from this session.</p>
        )}
      </Card>

      <Card className="p-6 md:p-7 space-y-5">
        <h3 className="text-lg font-semibold text-slate-900">Relationship to Clinical Trial Endpoints</h3>
        <div className="space-y-4 text-sm text-slate-700">
          {[
            {
              title: "Emotional health (PHQ-9–style mood screener)",
              bullets: [
                "Aligns with PHQ-9 severity bands commonly used in clinical practice and research.",
                "Supports measurement-based care and response/remission tracking with clinician oversight.",
              ],
            },
            {
              title: "Anxiety (GAD-7–style screener)",
              bullets: [
                "Aligns with GAD-7 cutpoints used in clinical research and integrated behavioral health settings.",
                "Allows anxiety monitoring alongside depression and cognitive outcomes.",
              ],
            },
            {
              title: "Processing speed (reaction-time task; SDMT-like)",
              bullets: [
                "Targets the processing-speed construct assessed by tests such as the Symbol Digit Modalities Test (SDMT) in multiple sclerosis research.",
                "Sensitive to factors that can influence cognition, including fatigue and health status.",
              ],
            },
            {
              title: "Working & visual memory (Corsi / digit-span analogues)",
              bullets: [
                "Parallels visual and verbal span tasks used in neuropsychological assessment.",
                "Supports monitoring learning trajectories between comprehensive assessments.",
              ],
            },
            {
              title: "Executive function (Stroop / Trails B analogues)",
              bullets: [
                "Stroop- and Trails-style tasks probe inhibition and set-shifting commonly assessed in cognitive aging research.",
                "Useful for monitoring executive-function trends alongside mood and attention context.",
              ],
            },
            {
              title: "Global cognition (multi-domain composite)",
              bullets: [
                "Combining mood, speed, memory, and executive domains reflects multi-domain assessment approaches used in cognitive research.",
                "Supports clinic-based longitudinal monitoring but does not define trial eligibility or regulatory endpoints.",
              ],
            },
          ].map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="font-semibold text-slate-900">{section.title}</p>
              <ul className="list-disc list-inside space-y-1">
                {section.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          These parallels indicate overlapping constructs, not identical scores. Neurovantage tasks are not direct digital copies of any single trial instrument.
        </p>
      </Card>

      <Card className="p-6 md:p-7 space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Key References Underpinning This Report</h3>
          <p className="text-sm text-slate-600">
            The following studies informed the design and interpretation of Neurovantage’s symptom and cognitive measures.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Scale validation and severity cutpoints</p>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/11556941/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
                </a>{" "}
                <em>J Gen Intern Med</em>. 2001;16(9):606-613. PMID: 11556941.
              </li>
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/16717171/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Spitzer RL, Kroenke K, Williams JB, Lowe B. A brief measure for assessing generalized anxiety disorder: the GAD-7.
                </a>{" "}
                <em>Arch Intern Med</em>. 2006;166(10):1092-1097. PMID: 16717171.
              </li>
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/23136325/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Hines JL, King TS, Curry WJ. The adult ADHD self-report scale for screening for adult attention-deficit/hyperactivity disorder.
                </a>{" "}
                <em>J Am Board Fam Med</em>. 2012;25(6):847-853. doi:10.3122/jabfm.2012.06.120065. PMID: 23136325.
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Digital cognitive analogues</p>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/28206827/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Benedict RHB, DeLuca J, Phillips G, et al. Validity of the Symbol Digit Modalities Test as a cognition performance outcome measure for multiple sclerosis.
                </a>{" "}
                <em>Mult Scler</em>. 2017;23(5):721-733. doi:10.1177/1352458517690821. PMID: 28206827.
              </li>
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/26060999/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Woods DL, Wyma JM, Herron TJ, Yund EW. The effects of aging, malingering, and traumatic brain injury on computerized trail-making test performance.
                </a>{" "}
                <em>PLoS One</em>. 2015;10(6):e0124345. doi:10.1371/journal.pone.0124345. PMID: 26060999.
              </li>
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/11296689/"
                  className="font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Kessels RPC, van Zandvoort MJE, Postma A, et al. The Corsi Block-Tapping Task: standardization and normative data.
                </a>{" "}
                <em>Appl Neuropsychol</em>. 2000;7(4):252-258. PMID: 11296689.
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <p className="text-xs text-slate-500">
        This summary is informational and should be reviewed by a clinician who can interpret results in the context of full
        medical history.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-end" data-hide-print="true">
        <Button onClick={() => window.print()} className="sm:w-auto">
          Print Report
        </Button>
        <Button onClick={onDownload} variant="outline" className="sm:w-auto">
          Download PDF
        </Button>
        <Button variant="ghost" className="sm:w-auto" onClick={() => (window.location.href = "/")}>
          Return to Clinic Portal
        </Button>
      </div>

      {devMode && (
        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4" data-hide-print="true">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Developer Tools</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDevData((prev) => !prev)}
            >
              {showDevData ? "Hide JSON" : "Show JSON"}
            </Button>
          </div>
          {showDevData && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Demographics", data: demographics },
                { title: "Cognitive Scores", data: cognitiveScores },
                { title: "Symptom Screeners", data: screenerScores },
              ].map((section) => (
                <div key={section.title} className="rounded-xl bg-slate-900 text-slate-100 p-3 text-xs font-mono overflow-auto">
                  <p className="text-[11px] mb-2 text-slate-400">{section.title}</p>
                  <pre>{JSON.stringify(section.data ?? {}, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type MetricAxisConfig = {
  participant: number | null;
  max: number;
  invert?: boolean;
  reference?: number | null;
  referenceLabel?: string;
  minLabel?: string;
  maxLabel?: string;
};

type MetricBlockProps = {
  label: string;
  value: string;
  status: string;
  details?: Array<{ label: string; value: string }>;
  axis?: MetricAxisConfig;
  orientation?: boolean;
};

function MetricBlock({ label, value, status, details, axis, orientation }: MetricBlockProps) {
  const participantPosition =
    axis && axis.participant !== null ? getAxisPosition(axis.participant, axis.max, axis.invert) : null;
  const referencePosition =
    axis && axis.reference != null ? getAxisPosition(axis.reference, axis.max, axis.invert) : null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 space-y-3 shadow-sm">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <p className="text-xs text-slate-500">{status}</p>
      {details && details.length > 0 && (
        <div className="grid gap-2 text-xs text-slate-600">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between">
              <span>{detail.label}</span>
              <span className="font-semibold text-slate-900">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
      {orientation ? (
        <OrientationChecklist score={axis?.participant ?? null} />
      ) : axis ? (
        <div className="space-y-1">
          <div className="relative pt-4">
            <div className="h-2 bg-slate-100 rounded-full" />
            {referencePosition !== null && (
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-slate-400/80 rounded-full"
                style={{ left: `calc(${referencePosition}% - 1px)` }}
                aria-hidden="true"
              />
            )}
            {participantPosition !== null && (
              <div className="absolute -top-3 flex flex-col items-center" style={{ left: `${participantPosition}%` }}>
                <span className="text-[10px] font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded-full shadow">
                  You
                </span>
                <div className="w-[2px] h-3 bg-primary/70 rounded-full mt-0.5" />
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{axis.minLabel ?? "Lower"}</span>
            <span>{axis.maxLabel ?? "Higher"}</span>
          </div>
          {axis.referenceLabel && (
            <p className="text-[10px] text-slate-400 text-right">{axis.referenceLabel}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function OrientationChecklist({ score }: { score: number | null }) {
  const items = [
    "Knows today's date",
    "Knows day of week",
    "Knows location",
    "Knows city",
    "Knows situation",
    "Knows clinician/clinic",
  ];
  const completed =
    score != null ? Math.min(items.length, Math.max(0, Math.round(score))) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Orientation checkpoints</span>
        <span>
          {completed}/{items.length}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item, idx) => (
          <label
            key={item}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
              idx < completed ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500"
            }`}
          >
            <input type="checkbox" checked={idx < completed} readOnly className="accent-emerald-500" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

type SymptomDomain = {
  key: string;
  label: string;
  scoreLabel: string;
  severity: string;
  comment: string;
  scale: string;
  score: number | null;
  maxScore: number;
};

type SymptomDomainCardProps = {
  domain: SymptomDomain;
};

const getSeverityTone = (severity: string) => {
  const normalized = (severity || "").toLowerCase();
  if (normalized.includes("severe")) {
    return { badge: "bg-red-50 text-red-700 border border-red-100", bar: "bg-red-500" };
  }
  if (normalized.includes("moderate")) {
    return { badge: "bg-amber-50 text-amber-800 border border-amber-100", bar: "bg-amber-500" };
  }
  if (normalized.includes("mild") || normalized.includes("elevated")) {
    return { badge: "bg-yellow-50 text-yellow-700 border border-yellow-100", bar: "bg-yellow-500" };
  }
  if (normalized.includes("not captured") || normalized.includes("not completed")) {
    return { badge: "bg-slate-100 text-slate-500 border border-slate-200", bar: "bg-slate-300" };
  }
  return { badge: "bg-emerald-50 text-emerald-700 border border-emerald-100", bar: "bg-emerald-500/80" };
};

function SymptomDomainCard({ domain }: SymptomDomainCardProps) {
  const tones = getSeverityTone(domain.severity);
  const percent =
    domain.score !== null && Number.isFinite(domain.score)
      ? Math.max(0, Math.min(100, (domain.score / domain.maxScore) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/95 p-4 space-y-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{domain.label}</p>
          <p className="text-xs text-slate-500">{domain.scale}</p>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones.badge}`}>{domain.severity}</span>
      </div>
      <div className="flex items-baseline justify-between text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{domain.scoreLabel}</span>
        <span>{domain.comment}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tones.bar}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
