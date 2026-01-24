import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScreenerIntro } from "@/components/screener/ScreenerIntro";
import { ScreenerDetailsForm } from "@/components/screener/ScreenerDetailsForm";
import { ScreenerQuestionnaireStage } from "@/components/screener/ScreenerQuestionnaireStage";
import { ScreenerReactionStage } from "@/components/screener/ScreenerReactionStage";
import { ScreenerMemoryStage } from "@/components/screener/ScreenerMemoryStage";
import { ScreenerStroopStage } from "@/components/screener/ScreenerStroopStage";
import { ScreenerReport } from "@/components/screener/ScreenerReport";
import {
  TaskPayloadBuilder,
  QuestionnairePayloadBuilder,
  computeReportModel,
  createEmptySession,
  scoreRecordToPrimitive,
  updateSessionScores,
  updateSessionQuestionnaire,
  updateSessionTaskDetails,
} from "@/lib/cognitiveScoring";
import { useScreenerSessionContext } from "@/lib/sessionContext";
import { trackScreenerEvent, trackStageTransition } from "@/lib/analytics";
import { useScreenerStorage } from "@/hooks/useScreenerStorage";
import { submitPatientAssessment } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { trackAppEvent, track } from "@/lib/events";
import { getUTMs, trackLeadSubmit } from "@/lib/tracking";
import { SCREENER_LIMITS } from "@/lib/thresholds";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  age: z.string().min(1, "Age is required"),
});

type TestStage =
  | "intro"
  | "details"
  | "questionnaire"
  | "test-reaction"
  | "test-memory"
  | "test-stroop"
  | "complete";

type StageTransition = (next: TestStage) => void;

const STAGE_ORDER: TestStage[] = [
  "intro",
  "details",
  "questionnaire",
  "test-reaction",
  "test-memory",
  "test-stroop",
  "complete",
];

const createEmptyMedicalHistory = () => ({
  cardiometabolic: [] as string[],
  vascularNeurologic: [] as string[],
  sleepBreathing: [] as string[],
  moodMentalHealth: [] as string[],
  cognitiveHistory: [] as string[],
  substanceUse: [] as string[],
  medications: [] as string[],
});

export type SubmissionStatus = "idle" | "pending" | "success" | "error";

export default function Screener() {
  const sessionContext = useScreenerSessionContext();
  const hasTrackedCompletionRef = useRef(false);
  const [stage, setStage] = useState<TestStage>("intro");
  const { session, setSession, resetSession } = useScreenerStorage(
    "nv-screener/v1",
    createEmptySession
  );
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const lastSubmissionStatusRef = useRef<SubmissionStatus>("idle");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", age: "" },
  });

  const ageValue = form.watch("age");
  const ageNumber = useMemo(() => {
    const num = Number(ageValue);
    return Number.isFinite(num) ? num : null;
  }, [ageValue]);

  const reportModel = computeReportModel({
    session,
    ageAtScreening: ageNumber,
  });
  const reactionCompleted = session.scores.reaction.value != null;
  const memoryCompleted = session.scores.memory.value != null;
  const executiveCompleted = session.scores.executive.value != null;
  const tasksCompleted = reactionCompleted && memoryCompleted && executiveCompleted;
  const questionnaireOnly =
    stage === "complete" &&
    !reactionCompleted &&
    !memoryCompleted &&
    !executiveCompleted;
  const allTestsCompleted = stage === "complete" && tasksCompleted;
  const anyTestsSkipped =
    stage === "complete" &&
    !questionnaireOnly &&
    (!reactionCompleted || !memoryCompleted || !executiveCompleted);
  const completedTests = useMemo(
    () => ({
      reaction: reactionCompleted,
      memory: memoryCompleted,
      stroop: executiveCompleted,
    }),
    [reactionCompleted, memoryCompleted, executiveCompleted],
  );

  const goToStage: StageTransition = (next) => {
    trackStageTransition(stage, next);
    setStage(next);
  };

  const handleQuestionnaireComplete = (payload: {
    depression: number;
    attention: number;
    answered: number;
    total: number;
  }) => {
    setSession((prev) =>
      updateSessionQuestionnaire(
        updateSessionScores(prev, {
          depression: payload.depression,
          attention: payload.attention,
        }),
        {
          answered: payload.answered,
          total: payload.total,
        }
      )
    );
    trackScreenerEvent("questionnaire_complete", payload);
    goToStage("test-reaction");
  };

  const handleReactionComplete = (score: number) => {
    setSession((prev) =>
      updateSessionTaskDetails(
        updateSessionScores(prev, { reaction: score }),
        { reaction: { averageMs: score } }
      )
    );
    goToStage("test-memory");
  };

  const handleMemoryComplete = (score: number) => {
    setSession((prev) => updateSessionScores(prev, { memory: score }));
    goToStage("test-stroop");
  };

  const handleStroopComplete = (score: number) => {
    setSession((prev) => updateSessionScores(prev, { executive: score }));
    goToStage("complete");
  };

  const buildExportPayload = useCallback(() => {
    const { summaries, details } = new TaskPayloadBuilder(session).build();
    const questionnaires = new QuestionnairePayloadBuilder(
      session.questionnaire
    ).toJSON();
    return {
      meta: {
        schemaVersion: "2025-01",
        scoringVersion: "1.0",
        normsVersion: "1.0",
        appVersion: "1.0.0",
        exportedAt: new Date().toISOString(),
      },
      session: sessionContext,
      participant: form.getValues(),
      scores: scoreRecordToPrimitive(session.scores),
      taskSummaries: summaries,
      taskDetails: details,
      questionnaires,
      dataQuality: reportModel.dataQuality,
      clientInfo: {
        mode: sessionContext.mode,
      },
      events: [],
      globalRiskLevel: reportModel.globalRiskLevel,
    };
  }, [form, reportModel.dataQuality, reportModel.globalRiskLevel, session, sessionContext]);

  const buildClinicSubmissionPayload = useCallback(() => {
    const exportPayload = buildExportPayload();
    const clinicId = sessionContext.clinicId ?? "bevins";
    const assessmentType = (() => {
      if (questionnaireOnly) return "Questionnaire-only visit (no tasks completed)";
      if (allTestsCompleted) return "Full battery completed";
      if (anyTestsSkipped) return "Partial battery (some tasks not completed)";
      return "Partial battery (auto-skipped)";
    })();
    const dataQualityNote = (() => {
      if (questionnaireOnly) return "Task-based metrics not available for this visit.";
      if (reportModel.dataQuality.summary === "limited") {
        return "Data quality limited (review trials/questionnaire completeness).";
      }
      if (anyTestsSkipped) {
        return "Some tasks were not completed; interpret task-based metrics with caution.";
      }
      return "Task and questionnaire data met quality checks.";
    })();
    const toTitleCase = (label: string) => label.replace(/\b\w/g, (ch) => ch.toUpperCase());
    const moodSeverityLabel = toTitleCase(reportModel.depressionSeverity);
    const highLevelFlags = [
      `Mood: ${moodSeverityLabel} depressive symptoms (PHQ-2–style ${reportModel.scores.depression}/${SCREENER_LIMITS.moodMax})`,
      `Attention: ${
        reportModel.derivedFlags.hasAttentionFlag
          ? "Elevated self-reported symptoms"
          : "Within expected self-reported range"
      } (score ${reportModel.scores.attention}/${SCREENER_LIMITS.attentionMax})`,
      "Anxiety: Not captured in this brief screener",
    ];
    const missingTaskLabels: string[] = [];
    if (!reactionCompleted) missingTaskLabels.push("Reaction speed");
    if (!memoryCompleted) missingTaskLabels.push("Visual memory");
    if (!executiveCompleted) missingTaskLabels.push("Executive function");
    const mappedRecommendations =
      reportModel.recommendations.length > 0
        ? reportModel.recommendations.map((rec) => ({
            category: rec.urgent ? "Priority" : "Screener",
            title: rec.title,
            patientText: rec.desc,
            clinicianNote: rec.desc,
            basedOn: rec.basedOn ?? `Screener signal: ${rec.title}`,
          }))
        : [
            {
              category: "Screener",
              title: "Routine Brain Health Maintenance",
              patientText:
                "Screener findings are within reference ranges. Continue healthy habits and repeat the screener if symptoms evolve.",
              clinicianNote:
                "No concerning screener findings. Store as baseline and re-screen in 6–12 months.",
              basedOn: "Screener summary review",
            },
          ];

    return {
      clinicId,
      demographics: {
        ...exportPayload.participant,
        ageYears: ageNumber,
        visitType: questionnaireOnly
          ? "screener-questionnaire"
          : allTestsCompleted
          ? "screener-full"
          : "screener-partial",
        assessmentType,
        questionnaireOnly,
        allTestsCompleted,
        anyTestsSkipped,
        completedTests,
        screenerMode: sessionContext.mode,
        enteredClinicId: sessionContext.clinicId ?? "Not provided",
        referrer: sessionContext.referrer,
        userExternalId: sessionContext.userExternalId,
        marketing: {
          utms: getUTMs(),
        },
      },
      medicalHistory: createEmptyMedicalHistory(),
      screenerScores: {
        report: reportModel,
        summary: {
          assessmentType,
          dataQualityNote,
          highLevelFlags,
        },
        questionnaires: exportPayload.questionnaires,
      },
      cognitiveScores: {
        taskSummaries: exportPayload.taskSummaries,
        taskDetails: exportPayload.taskDetails,
        missingTasks: missingTaskLabels,
        normative: {
          reactionBand: reportModel.reactionNormBand,
          memoryBand: reportModel.memoryNormBand,
          executiveBand: reportModel.executiveNormBand,
          reactionMedianMs: reportModel.reactionAgeMedianMs,
          visualMemoryMedianItems: reportModel.visualMemoryMedianItems,
        },
      },
      recommendations: mappedRecommendations,
    };
  }, [
    ageNumber,
    allTestsCompleted,
    anyTestsSkipped,
    buildExportPayload,
    completedTests,
    executiveCompleted,
    memoryCompleted,
    questionnaireOnly,
    reactionCompleted,
    reportModel,
    sessionContext,
  ]);

  const viewJson = () => {
    const payload = buildExportPayload();
    const json = JSON.stringify(payload, null, 2)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (win) {
      win.document.write(
        `<html><head><title>Prime State Health Screener JSON</title></head><body style="margin:0;padding:16px;background:#0f172a;color:#e2e8f0;"><pre style="white-space:pre-wrap;word-break:break-word;font-size:12px;font-family:Menlo,Consolas,monospace;">${json}</pre></body></html>`
      );
      win.document.close();
    } else {
      console.log(payload);
    }
  };

  useEffect(() => {
    if (stage !== "complete" || submissionStatus !== "idle") return;

    let isMounted = true;
    const syncReport = async () => {
      setSubmissionStatus("pending");
      setSubmissionError(null);
      try {
        const payload = buildClinicSubmissionPayload();
        await submitPatientAssessment(payload);
        if (!isMounted) return;
        setSubmissionStatus("success");
      } catch (error) {
        console.error("Failed to submit screener assessment:", error);
        if (!isMounted) return;
        setSubmissionError(
          error instanceof Error ? error.message : "Unable to sync screener visit."
        );
        setSubmissionStatus("error");
      }
    };

    void syncReport();

    return () => {
      isMounted = false;
    };
  }, [
    stage,
    submissionStatus,
    buildClinicSubmissionPayload,
  ]);

  useEffect(() => {
    if (stage !== "complete" || hasTrackedCompletionRef.current) return;
    hasTrackedCompletionRef.current = true;
    track("screener_complete", { flow: "screener" });
    const details = form.getValues();
    const userName = [details.firstName, details.lastName]
      .filter(Boolean)
      .join(" ");
    void trackAppEvent({
      type: "SCREENER_COMPLETED",
      clinicPublicId: sessionContext.clinicId ?? undefined,
      userEmail: details.email,
      userName: userName || undefined,
      path: window.location.pathname,
      meta: {
        moodScore: reportModel.scores.depression,
        attentionScore: reportModel.scores.attention,
        reactionScore: reportModel.scores.reaction,
        visualMemoryScore: reportModel.scores.memory,
        execFunctionScore: reportModel.scores.executive,
      },
    });
  }, [stage, form, reportModel, sessionContext.clinicId]);

  useEffect(() => {
    if (
      submissionStatus === "success" &&
      lastSubmissionStatusRef.current !== "success"
    ) {
      toast({
        title: "Saved to clinic dashboard",
        description: "This screener visit is now available under your clinic dashboard.",
      });
    }
    if (
      submissionStatus === "error" &&
      lastSubmissionStatusRef.current !== "error"
    ) {
      toast({
        title: "Unable to sync screener visit",
        description: submissionError ?? "Check your connection and try again.",
        variant: "destructive",
      });
    }
    lastSubmissionStatusRef.current = submissionStatus;
  }, [submissionStatus, submissionError]);

  const renderStage = () => {
    switch (stage) {
      case "intro":
        return (
          <ScreenerIntro
            onStart={() => {
              track("screener_start", { flow: "screener" });
              goToStage("details");
            }}
          />
        );
      case "details":
        return (
          <ScreenerDetailsForm
            form={form}
            onSubmit={() => {
              trackLeadSubmit({ form: "screener_lead" });
              goToStage("questionnaire");
            }}
          />
        );
      case "questionnaire":
        return (
          <ScreenerQuestionnaireStage
            onComplete={handleQuestionnaireComplete}
          />
        );
      case "test-reaction":
        return (
          <ScreenerReactionStage
            onComplete={handleReactionComplete}
          />
        );
      case "test-memory":
        return (
          <ScreenerMemoryStage
            onComplete={handleMemoryComplete}
          />
        );
      case "test-stroop":
        return (
          <ScreenerStroopStage
            onComplete={handleStroopComplete}
          />
        );
      case "complete":
        return (
          <div className="space-y-4">
            {submissionStatus === "error" && (
              <Alert variant="destructive">
                <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Unable to sync this screener visit with the clinic dashboard.
                    {submissionError ? ` ${submissionError}` : ""}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmissionError(null);
                      setSubmissionStatus("idle");
                    }}
                  >
                    Retry sync
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <ScreenerReport
              formValues={{
                firstName: form.getValues("firstName"),
                lastName: form.getValues("lastName"),
                age: form.getValues("age"),
              }}
              report={reportModel}
              mode={sessionContext.mode}
              syncStatus={submissionStatus}
              allTestsCompleted={allTestsCompleted}
              anyTestsSkipped={anyTestsSkipped}
              questionnaireOnly={questionnaireOnly}
              onRestart={() => {
                form.reset();
                resetSession();
                
                setSubmissionStatus("idle");
                setSubmissionError(null);
                goToStage("intro");
              }}
              onViewJson={viewJson}
              onReturnHome={() => (window.location.href = "/")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50/50 p-4 py-12">
      <div className="sr-only" aria-live="polite">
        Stage: {stage}
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  (STAGE_ORDER.indexOf(stage) / (STAGE_ORDER.length - 1)) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
      </div>
    </div>
  );
}
