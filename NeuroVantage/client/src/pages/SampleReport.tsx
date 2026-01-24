import { FullAssessmentReportView, type FullAssessmentReportData } from "@/components/report/FullAssessmentReportView";
import { downloadPdfFromLines } from "@/lib/report/pdf";

const sampleReport: FullAssessmentReportData = {
  demographics: {
    firstName: "Sample",
    lastName: "Patient",
    age: 48,
  },
  completedAt: "2025-01-01T10:30:00Z",
  cognitiveScores: {
    orientation: 5,
    cpt: 520,
    symbol: 1150,
    trails: 78,
    stroop: 145,
    go_no_go: {
      rawScore: 72,
      summary: {
        goTrials: 60,
        noGoTrials: 20,
        commissionErrors: 4,
        omissionErrors: 3,
        commissionRate: 0.2,
        omissionRate: 0.05,
        medianGoRtMs: 320,
        goRtStdDevMs: 55,
      },
    },
    digit_span: 5,
    visual_memory: 9,
    list: 18,
    fluency: 22,
  },
  screenerScores: {
    phq9_0: 1,
    phq9_1: 1,
    phq9_2: 1,
    phq9_3: 0,
    phq9_4: 1,
    phq9_5: 0,
    phq9_6: 1,
    phq9_7: 1,
    phq9_8: 0,
    gad7_0: 1,
    gad7_1: 1,
    gad7_2: 1,
    gad7_3: 0,
    gad7_4: 1,
    gad7_5: 0,
    gad7_6: 0,
    attention_0: 2,
    attention_1: 3,
    attention_2: 2,
    attention_3: 3,
    attention_4: 2,
  },
  recommendations: [
    {
      title: "Sleep Quality Support",
      category: "Recovery",
      patientText:
        "Screeners suggest sleep disruption that may be affecting focus and energy. Review sleep habits and consider targeted sleep support options.",
      clinicianNote:
        "Review sleep history, consider sleep screening, and monitor response alongside cognitive scores.",
      basedOn: "Mood/sleep screeners and reported daytime fatigue.",
    },
    {
      title: "Processing Speed Follow-up",
      category: "Cognitive",
      patientText:
        "Reaction time and processing speed were slower than typical. Consider lifestyle, metabolic, and medication factors that may contribute.",
      clinicianNote:
        "Review medications, sleep, and metabolic markers; repeat cognitive testing to track response.",
      basedOn: "Reaction task score and symbol coding performance.",
    },
  ],
};

const buildSampleReportLines = (report: FullAssessmentReportData) => {
  const formatSection = (title: string, data: any) => {
    return [`${title}:`, JSON.stringify(data ?? {}, null, 2), ""];
  };

  const lines: string[] = [
    "Prime State Health Clinical Assessment Report (Sample)",
    `Generated: ${new Date().toLocaleString()}`,
    report.completedAt ? `Completed At: ${report.completedAt}` : "",
    "",
  ];

  lines.push(...formatSection("Demographics", report.demographics));
  lines.push(...formatSection("Symptom Screeners", report.screenerScores));
  lines.push(...formatSection("Cognitive Scores", report.cognitiveScores));
  lines.push(...formatSection("Recommendations", report.recommendations));
  lines.push("Thank you for reviewing the sample report.");

  return lines;
};

export default function SampleReportPage() {
  const handleDownload = () => {
    const lines = buildSampleReportLines(sampleReport);
    downloadPdfFromLines(lines, `neurovantage-sample-report-${Date.now()}.pdf`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-8">
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
            Example report
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Sample Prime State Health Full Report
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            This page shows a sample of the full report format that clinics see
            at the end of a Prime State Health cognitive test. It uses example data
            only, not real patient results.
          </p>
          <p className="text-xs text-slate-500">
            Illustrative example only. Not real patient data. Content and layout
            can be tailored to each clinic&apos;s menu and workflow.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <FullAssessmentReportView
            report={sampleReport}
            onDownload={handleDownload}
            showDevData={false}
            setShowDevData={() => {}}
          />
        </section>
      </div>
    </main>
  );
}
