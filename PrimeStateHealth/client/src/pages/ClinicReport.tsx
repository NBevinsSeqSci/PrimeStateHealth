import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, AlertTriangle, FileText } from "lucide-react";
import type { PatientReport } from "@shared/schema";
import { getPatientReport } from "@/lib/api";
import { PathwayExplorer } from "@/components/report/pathways/PathwayExplorer";
import type { MetaboliteResult } from "@/lib/pathways/types";
import { AnalyteSection } from "@/components/report/analytes/AnalyteSection";
import { DietSection } from "@/components/report/diet/DietSection";

export interface ClinicReportProps {
  params: {
    id: string;
  };
}

const VISIT_LABELS: Record<string, string> = {
  "full-assessment": "Full assessment",
  "screener-full": "Screener + tasks",
  "screener-partial": "Screener (partial)",
  "screener-questionnaire": "Questionnaire-only",
};

const formatScore = (value: unknown, suffix = "") => {
  if (value == null) return "—";
  if (typeof value === "number") return `${value}${suffix}`;
  return String(value);
};

const renderRecordLines = (record: Record<string, unknown> | undefined) => {
  if (!record) return [];
  return Object.entries(record)
    .filter(([, val]) => val !== null && val !== undefined && val !== "")
    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`);
};

const NAV_ITEMS = [
  { id: "summary", label: "Summary" },
  { id: "pathways", label: "Pathways" },
  { id: "diet", label: "Diet" },
  { id: "analytes", label: "Analytes" },
  { id: "plan", label: "Plan" },
  { id: "timeline", label: "Timeline" },
];

export default function ClinicReport({ params }: ClinicReportProps) {
  const [, navigate] = useLocation();
  const reportId = Number(params.id);
  const isValidReportId = Number.isFinite(reportId) && reportId > 0;
  const [highlightedPathwayId, setHighlightedPathwayId] = useState<string>();
  const [highlightedAnalyteId, setHighlightedAnalyteId] = useState<string>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["patient-report", reportId],
    queryFn: () => getPatientReport(reportId),
    enabled: isValidReportId,
  });

  const report = data?.report as PatientReport | undefined;
  const demographics = (report?.demographics ?? {}) as Record<string, any>;
  const screenerScores = (report?.screenerScores ?? {}) as Record<string, any>;
  const cognitiveScores = (report?.cognitiveScores ?? {}) as Record<string, any>;
  const recommendations = (report?.recommendations ?? []) as Array<Record<string, any>>;
  const metabolomics = (report?.metabolomics ?? {}) as Record<string, any>;
  const metaboliteResults =
    ((metabolomics.results as MetaboliteResult[] | undefined) ??
      (report?.metaboliteResults as MetaboliteResult[] | undefined) ??
      []) as MetaboliteResult[];
  const patientContext = (report?.patientContext ?? {}) as Record<string, any>;
  const scrollAndHighlightPathway = (pathwayId: string) => {
    const el = document.getElementById(`pathway-${pathwayId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setHighlightedPathwayId(pathwayId);
    window.setTimeout(() => setHighlightedPathwayId(undefined), 2000);
  };

  const scrollAndHighlightAnalyte = (normalizedName: string) => {
    const el = document.getElementById(`analyte-${normalizedName}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setHighlightedAnalyteId(normalizedName);
    window.setTimeout(() => setHighlightedAnalyteId(undefined), 2000);
  };

  const visitTypeLabel = VISIT_LABELS[demographics.visitType as string] ?? "Assessment";
  const summary = screenerScores.summary as
    | {
        assessmentType?: string;
        dataQualityNote?: string;
        highLevelFlags?: string[];
      }
    | undefined;

  const isQuestionnaireOnly = demographics.visitType === "screener-questionnaire";
  const missingTasks: string[] = cognitiveScores.missingTasks ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
          </Button>
        </div>
        {!isValidReportId && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Invalid report link
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700">
              The report ID is missing or invalid. Return to the dashboard and select a report.
            </CardContent>
          </Card>
        )}
        {isLoading && !report && isValidReportId && (
          <div className="space-y-4">
            <div className="h-24 rounded-3xl border border-slate-200 bg-white/80 shadow-sm animate-pulse" />
            <div className="h-12 rounded-2xl border border-slate-200 bg-white/80 shadow-sm animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-52 rounded-3xl border border-slate-200 bg-white/80 shadow-sm animate-pulse" />
              <div className="h-52 rounded-3xl border border-slate-200 bg-white/80 shadow-sm animate-pulse" />
            </div>
            <div className="h-72 rounded-3xl border border-slate-200 bg-white/80 shadow-sm animate-pulse" />
          </div>
        )}
        {isLoading && report && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Unable to load report
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700">
              {(error as Error).message || "An unexpected error occurred."}
            </CardContent>
          </Card>
        )}
        {report && (
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assessment Report #{report.id}</p>
                    <CardTitle className="text-2xl text-primary font-display">
                      {demographics.firstName} {demographics.lastName}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>Age: {demographics.age ?? demographics.ageYears ?? "—"}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Clinic ID: {report.clinicId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-xs">{visitTypeLabel}</Badge>
                  <Badge variant="outline" className="text-xs">
                    Status: {report.status}
                  </Badge>
                  {isQuestionnaireOnly && (
                    <Badge variant="destructive" className="text-xs">
                      Questionnaire-only visit
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => window.print()}>
                    <FileText className="h-4 w-4 mr-2" /> Print
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#pathways">Pathways</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#analytes">Analytes</a>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              {NAV_ITEMS.map((item) => (
                <Button key={item.id} variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <a href={`#${item.id}`}>{item.label}</a>
                </Button>
              ))}
            </div>

            {summary && (
              <Card className="shadow-sm" id="summary">
                <CardHeader>
                  <CardTitle className="text-lg">Executive Summary</CardTitle>
                  {summary.assessmentType && (
                    <p className="text-sm text-muted-foreground">{summary.assessmentType}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.highLevelFlags && summary.highLevelFlags.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">High-level flags</p>
                      <ul className="list-disc pl-5 text-sm text-slate-700">
                        {summary.highLevelFlags.map((flag) => (
                          <li key={flag}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {summary.dataQualityNote && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                      {summary.dataQualityNote}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Cognitive & Questionnaire Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Symptom Screeners</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                    {renderRecordLines(screenerScores).length === 0 && (
                      <p className="text-sm text-muted-foreground">No screener summary provided.</p>
                    )}
                    {renderRecordLines(screenerScores).map((line) => (
                      <p className="text-sm text-slate-700" key={line}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Cognitive Tasks</p>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
                    {Object.entries(cognitiveScores)
                      .filter(
                        ([key]) =>
                          key !== "taskDetails" &&
                          key !== "taskSummaries" &&
                          key !== "missingTasks" &&
                          key !== "normative"
                      )
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="font-semibold text-slate-900">{formatScore(value)}</span>
                        </div>
                      ))}
                    {missingTasks.length > 0 && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                        Tasks not completed: {missingTasks.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm" id="pathways">
              <CardHeader>
                <CardTitle className="text-lg">Metabolic Pathways</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Prime State Health pathway framework (A–G) summarizing metabolomics-derived engines, stress signatures, and overlays.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <PathwayExplorer
                  results={metaboliteResults}
                  highlightedPathwayId={highlightedPathwayId}
                  onAnalyteNavigate={scrollAndHighlightAnalyte}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm" id="diet">
              <CardHeader>
                <CardTitle className="text-lg">Diet insights</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Heuristic dietary patterns inferred from measured analytes. Always confirm clinically.
                </p>
              </CardHeader>
              <CardContent>
                <DietSection results={metaboliteResults} patientContext={patientContext} />
              </CardContent>
            </Card>

            <Card className="shadow-sm" id="analytes">
              <CardHeader>
                <CardTitle className="text-lg">Analytes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Full metabolite roster with values, z-scores, and pathway cross-links.
                </p>
              </CardHeader>
              <CardContent>
                <AnalyteSection
                  results={metaboliteResults}
                  onPathwayNavigate={scrollAndHighlightPathway}
                  highlightedAnalyteId={highlightedAnalyteId}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm" id="plan">
              <CardHeader>
                <CardTitle className="text-lg">Clinical Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recommendations attached to this report.</p>
                )}
                {recommendations.map((rec, idx) => (
                  <div key={`${rec.title}-${idx}`} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{rec.category}</p>
                      </div>
                      {rec.basedOn && (
                        <Badge variant="outline" className="text-[11px]">
                          Based on: {rec.basedOn}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-2">{rec.patientText}</p>
                    {rec.clinicianNote && (
                      <p className="text-xs text-slate-500 mt-2">
                        <span className="font-semibold">Clinician note:</span> {rec.clinicianNote}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm" id="timeline">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Longitudinal tracking will surface here once follow-up visits are recorded.
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No timeline data available yet. Once additional visits or labs are uploaded, this section will visualize
                  changes over time.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
