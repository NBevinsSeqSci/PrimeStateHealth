import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Clock, FileText, Activity, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { submitPatientAssessment } from "@/lib/api";
import {
  getGadSeverityLabel,
  getPhqSeverityLabel,
  getRawScore,
  getValuesByPrefix,
} from "@/lib/fullAssessmentReport";
import { useMutation } from "@tanstack/react-query";
import { track, trackAppEvent } from "@/lib/events";
import { downloadPdfFromLines } from "@/lib/report/pdf";

// Components
import { ReactionTest } from "@/components/cognitive/ReactionTest";
import { MemoryTest } from "@/components/cognitive/MemoryTest";
import { StroopTest } from "@/components/cognitive/StroopTest";
import { DemographicsForm } from "@/components/assessment/DemographicsForm";
import { MedicalHistoryForm } from "@/components/assessment/MedicalHistoryForm";
import { ScreenersForm } from "@/components/assessment/ScreenersForm";

// Real Implementations
import { OrientationTest } from "@/components/cognitive/OrientationTest";
import { SymbolCodingTest } from "@/components/cognitive/SymbolCodingTest";
import { VerbalListTest } from "@/components/cognitive/VerbalListTest";
import { TrailsTest } from "@/components/cognitive/TrailsTest";
import { DigitSpanTest } from "@/components/cognitive/DigitSpanTest";
import { FluencyTest } from "@/components/cognitive/FluencyTest";
import { GoNoGoTask } from "@/components/cognitive/GoNoGoTask";
import { FullAssessmentReportView } from "@/components/report/FullAssessmentReportView";
import { CTA_LABELS } from "@/lib/copy";


const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  clinicId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type TestStage = 
  | "auth" 
  | "intro" 
  | "demographics" 
  | "history" 
  | "screeners"
  | "test-orientation"
  | "test-symbol"
  | "test-list-learn"
  | "test-memory"     // Visual Pattern (Mapped from MemoryTest)
  | "test-reaction"   // CPT (Mapped from ReactionTest)
  | "test-digit"
  | "test-stroop"     // Stroop (Mapped from StroopTest)
  | "test-go-no-go"
  | "test-trails"
  | "test-fluency"
  | "complete";

const testSequence: TestStage[] = [
  "test-orientation",
  "test-symbol",
  "test-list-learn",
  "test-memory",
  "test-reaction",
  "test-digit",
  "test-stroop",
  "test-go-no-go",
  "test-trails",
  "test-fluency",
  "complete",
];

const stageToScoreMap: Record<TestStage, string | undefined> = {
  "test-orientation": "orientation",
  "test-symbol": "symbol",
  "test-list-learn": "list",
  "test-memory": "visual_memory",
  "test-reaction": "cpt",
  "test-digit": "digit_span",
  "test-stroop": "stroop",
  "test-go-no-go": "go_no_go",
  "test-trails": "trails",
  "test-fluency": "fluency",
  auth: undefined,
  intro: undefined,
  demographics: undefined,
  history: undefined,
  screeners: undefined,
  complete: undefined,
};

const CLINIC_RECOMMENDATION_OVERRIDES: Record<string, { alwaysShowMetabolic?: boolean }> = {
  researchdemo: { alwaysShowMetabolic: true },
};



export default function FullAssessment() {
  const [stage, setStage] = useState<TestStage>("auth");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Store all data
  const [demographics, setDemographics] = useState<any>({});
  const [medicalHistory, setMedicalHistory] = useState<any>({});
  const [screenerScores, setScreenerScores] = useState<any>({});
  const [cognitiveScores, setCognitiveScores] = useState<any>({});
  const [clinicId, setClinicId] = useState<string>("bevins"); // Default to bevins
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [showDevData, setShowDevData] = useState(false);
  const hasTrackedCompletionRef = useRef(false);

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", clinicId: "" },
  });

  const onSignup = (data: z.infer<typeof signupSchema>) => {
    setAcceptedTerms(false);
    setStage("intro");
    setDemographics((prev: any) => ({ 
      ...prev, 
      email: data.email,
      enteredClinicId: data.clinicId || "None Provided" // Store input for display
    }));
    
    // Clinic ID Logic: Always default to 'bevins' regardless of input
    setClinicId("bevins");
  };

  const handleDemographicsComplete = (data: any) => {
    setDemographics((prev: any) => ({
      ...prev,
      ...data,
      visitType: "full-assessment",
    }));
    setStage("history");
  };

  const handleHistoryComplete = (data: any) => {
    setMedicalHistory(data);
    setStage("screeners");
  };

  const handleScreenersComplete = (data: any) => {
    setScreenerScores(data);
    setStage("test-orientation");
  };

  const moveToNextTestStage = () => {
    const currentIndex = testSequence.indexOf(stage as TestStage);
    if (currentIndex !== -1 && currentIndex < testSequence.length - 1) {
      setStage(testSequence[currentIndex + 1]);
    }
  };

  // Test Handlers
  const advanceTest = (testName: string, score: any) => {
    setCognitiveScores((prev: any) => ({ ...prev, [testName]: score }));
    moveToNextTestStage();
  };

  const skipCurrentTest = () => {
    const currentStageKey = stageToScoreMap[stage];
    if (currentStageKey) {
      setCognitiveScores((prev: any) => ({ ...prev, [currentStageKey]: "skipped" }));
    }
    moveToNextTestStage();
  };

  const buildReportLines = () => {
    const formatSection = (title: string, data: any) => {
      return [`${title}:`, JSON.stringify(data ?? {}, null, 2), ""];
    };

    const lines: string[] = [
      "Neurovantage Clinical Assessment Report",
      `Generated: ${new Date().toLocaleString()}`,
      completedAt ? `Completed At: ${completedAt}` : "",
      ""
    ];

    lines.push(...formatSection("Demographics", demographics));
    lines.push(...formatSection("Medical History", medicalHistory));
    lines.push(...formatSection("Symptom Screeners", screenerScores));
    lines.push(...formatSection("Cognitive Scores", cognitiveScores));

    if (recommendations.length) {
      lines.push("Recommendations:");
      recommendations.forEach((rec, index) => {
        lines.push(
          `${index + 1}. [${rec.category}] ${rec.title}`,
          `   Guidance: ${rec.patientText}`,
          `   Clinician Note: ${rec.clinicianNote}`,
          ""
        );
      });
    }

    lines.push("Clinic Identifier:", clinicId, "");
    lines.push("Thank you for using Neurovantage.");

    return lines;
  };

  const handleDownloadReport = () => {
    if (stage !== "complete") return;
    const lines = buildReportLines();
    downloadPdfFromLines(lines, `neurovantage-report-${Date.now()}.pdf`);

    const userName = demographics?.name ?? demographics?.fullName ?? undefined;
    void trackAppEvent({
      type: "REPORT_DOWNLOADED",
      clinicPublicId: clinicId,
      userEmail: demographics?.email ?? undefined,
      userName,
      path: window.location.pathname,
      meta: { reportKind: "full-assessment-pdf" },
    });
  };

  // Progress calculation
  const getProgress = () => {
    const stages = [
      "intro", "demographics", "history", "screeners",
      "test-orientation", "test-symbol", "test-list-learn", "test-memory",
      "test-reaction", "test-digit", "test-stroop", "test-go-no-go", "test-trails", "test-fluency",
      "complete"
    ];
    const idx = stages.indexOf(stage as string);
    if (idx === -1) return 0;
    return ((idx) / (stages.length - 1)) * 100;
  };

  // --- Recommendation Engine Logic ---
  const generateRecommendations = useCallback(() => {
    const recs: Array<{
      category?: string;
      title: string;
      patientText: string;
      clinicianNote: string;
      basedOn?: string;
    }> = [];

    const cardiometabolicHistory: string[] = Array.isArray(medicalHistory.cardiometabolic)
      ? medicalHistory.cardiometabolic
      : [];
    const sleepBreathingHistory: string[] = Array.isArray(medicalHistory.sleepBreathing)
      ? medicalHistory.sleepBreathing
      : [];
    const moodMentalHealthHistory: string[] = Array.isArray(medicalHistory.moodMentalHealth)
      ? medicalHistory.moodMentalHealth
      : [];

    const reactionValue = getRawScore(cognitiveScores.cpt);
    const visualValue = getRawScore(cognitiveScores.visual_memory);
    const listValue = getRawScore(cognitiveScores.list);

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

    const clinicOverride = CLINIC_RECOMMENDATION_OVERRIDES[clinicId] ?? {};
    const hasCardiometabolicRisk = cardiometabolicHistory.length > 0;
    const shouldSurfaceMetabolic = hasCardiometabolicRisk || clinicOverride.alwaysShowMetabolic;

    const moodBasedData: string[] = [];
    if (phqTotal !== null && phqTotal >= 10) {
      moodBasedData.push(`PHQ-9–style mood score ${phqTotal}/27 (${phqSeverity})`);
    }
    if (gadTotal !== null && gadTotal >= 10) {
      moodBasedData.push(`GAD-7–style anxiety score ${gadTotal}/21 (${gadSeverity})`);
    }
    if (moodBasedData.length || moodMentalHealthHistory.length) {
      recs.push({
        category: "Mood",
        title: "Mood & Stress Support",
        patientText:
          "Symptom screeners suggest clinically meaningful mood or anxiety burden. Integrated behavioral health or psychotherapy can help contextualize how mood impacts cognition.",
        clinicianNote:
          "Review PHQ-9/GAD-7 style scores and mood history; consider referral for therapy or medication management if scores meet threshold.",
        basedOn:
          moodBasedData.length > 0
            ? moodBasedData.join(" and ")
            : `Self-reported history: ${moodMentalHealthHistory.join(", ")}`,
      });
    }

    if (attentionAvg !== null && attentionAvg >= 2.0) {
      recs.push({
        category: "Attention",
        title: "Attention & Focus Coaching",
        patientText:
          "Self-reported attention items suggest elevated distractibility. Behavioral coaching, ADHD-focused CBT, or medication review may be appropriate.",
        clinicianNote:
          "Attention screening average ≥2.0; correlate with executive metrics and consider broader ADHD evaluation if symptoms are functionally impairing.",
        basedOn: `Attention self-report average ${attentionAvg} / 4.`,
      });
    }

    if (reactionValue !== null && reactionValue > 420) {
      recs.push({
        category: "Cognitive",
        title: "Processing Speed Support",
        patientText:
          "Processing speed was slower than typical on the reaction task. Lifestyle, sleep, and medical contributors should be reviewed.",
        clinicianNote:
          "Reaction speed above age-adjusted expectations; investigate vascular risk, medications, sleep, and metabolic contributors.",
        basedOn: `Simple reaction speed ${Math.round(reactionValue)} ms (> 420 ms threshold).`,
      });
    }

    if (visualValue !== null && visualValue < 5) {
      recs.push({
        category: "Cognitive",
        title: "Memory Strategy Training",
        patientText:
          "Visuo-spatial memory span fell below expected levels. Compensatory strategies (chunking, rehearsal cues) may support daily memory.",
        clinicianNote:
          "Visual memory span <5 items; consider targeted rehabilitation or referral for comprehensive neuropsychological testing if functional issues persist.",
        basedOn: `Visual memory score ${visualValue} items on Corsi-style task.`,
      });
    }

    if (listValue !== null && listValue < 15) {
      recs.push({
        category: "Lab Panel",
        title: "Reversible Cause Laboratory Panel",
        patientText:
          "Lower verbal learning performance can be influenced by metabolic, nutritional, or inflammatory contributors. Checking reversible causes is advised.",
        clinicianNote:
          "List-learning performance <15 words. Consider B12, folate, vitamin D, CBC, thyroid panel, ferritin, hs-CRP.",
        basedOn: `Word-list learning raw score ${listValue} words.`,
      });
    }

    if (sleepBreathingHistory.length > 0) {
      recs.push({
        category: "Sleep",
        title: "Sleep Optimization & Breathing Review",
        patientText:
          "Sleep-breathing history suggests risk for non-restorative sleep. Addressing these issues can improve energy, attention, and mood.",
        clinicianNote:
          "Positive responses for sleep-breathing concerns. Reinforce adherence to therapy if already treated; otherwise consider STOP-BANG screening and referral for PSG/HST.",
        basedOn: `Sleep & breathing history: ${sleepBreathingHistory.join(", ")}.`,
      });
    }

    if (shouldSurfaceMetabolic) {
      recs.push({
        category: "Lab Panel",
        title: "Advanced Metabolic Panel",
        patientText:
          "Cardiometabolic health is tightly linked to cognition. Comprehensive labs (lipids, glucose, inflammation) can identify modifiable risks.",
        clinicianNote:
          "Order fasting labs (A1c, fasting insulin, lipid panel with ApoB/Lp(a), hs-CRP, homocysteine). Escalate management if abnormal.",
        basedOn: hasCardiometabolicRisk
          ? `Intake positives: ${cardiometabolicHistory.join(", ")}.`
          : "Clinic-level override to always surface metabolic screening.",
      });
    } else {
      recs.push({
        category: "Preventive Care",
        title: "Baseline Cardiometabolic Risk Assessment",
        patientText:
          "Even without reported cardiometabolic conditions, baseline vitals and labs are recommended per primary care guidelines.",
        clinicianNote:
          "No cardiometabolic risks captured. Follow USPSTF/ACC guidelines for BP, lipid, and glucose screening at routine intervals.",
        basedOn: "No cardiometabolic risk factors were endorsed during intake.",
      });
    }

    // Default Rec if list is empty
    if (recs.length === 0) {
      recs.push({
        category: "Wellness",
        title: "Routine Brain Health Maintenance",
        patientText: "Profile is stable. Maintain current health habits and plan periodic re-assessments to monitor change.",
        clinicianNote: "No concerning findings in current battery. Reassess in 12 months or sooner if symptoms evolve.",
        basedOn: "All collected symptom and task data were within reference ranges.",
      });
    }

    return recs;
  }, [clinicId, cognitiveScores, medicalHistory, screenerScores]);

  const recommendations = useMemo(() => {
    if (stage !== "complete") return [];
    return generateRecommendations();
  }, [stage, generateRecommendations]);

  // Mutation for submitting assessment
  const submitAssessment = useMutation({
    mutationFn: submitPatientAssessment,
    onSuccess: () => {
      console.log("Assessment submitted successfully");
    },
    onError: (error) => {
      console.error("Failed to submit assessment:", error);
    }
  });

  // Submit to backend on completion
  useEffect(() => {
    if (stage === "complete") {
      if (!completedAt) {
        setCompletedAt(new Date().toISOString());
      }

      if (!hasSubmitted) {
        submitAssessment.mutate({
          clinicId,
          demographics,
          medicalHistory,
          screenerScores,
          cognitiveScores,
          recommendations
        });
        setHasSubmitted(true);
      }
    }
  }, [stage, hasSubmitted, completedAt, clinicId, demographics, medicalHistory, screenerScores, cognitiveScores, recommendations, submitAssessment]);

  useEffect(() => {
    if (stage !== "complete" || hasTrackedCompletionRef.current) return;
    hasTrackedCompletionRef.current = true;
    track("full_test_complete", { flow: "full-assessment" });
    const userName =
      (demographics?.name ??
        demographics?.fullName ??
        [demographics?.firstName, demographics?.lastName].filter(Boolean).join(" ")) ||
      undefined;
    void trackAppEvent({
      type: "FULL_TEST_COMPLETED",
      clinicPublicId: clinicId,
      userEmail: demographics?.email ?? undefined,
      userName,
      path: window.location.pathname,
      meta: { visitType: demographics?.visitType ?? "full-assessment" },
    });
  }, [stage, clinicId, demographics]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50/50 p-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Progress Bar (Hidden during Auth) */}
        {stage !== "auth" && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${getProgress()}%` }}
              />
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Assessment Progress
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {stage === "auth" && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="max-w-md mx-auto shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground text-center py-8">
                  <div className="mx-auto bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Lock size={24} />
                  </div>
                  <CardTitle className="text-2xl font-display text-white">Secure Assessment Portal</CardTitle>
                  <CardDescription className="text-primary-foreground/70">
                    Create an account to access the full cognitive assessment suite.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="signup">Create Account</TabsTrigger>
                      <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signup">
                      <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                          <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="name@example.com" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={signupForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={signupForm.control}
                            name="clinicId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Clinic ID (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Activity className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Enter Clinic ID if provided" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full mt-2">
                            Create Account & Start Test
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="login">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" placeholder="name@example.com" className="pl-9" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
                          </div>
                        </div>
                      <Button onClick={() => { setStage("intro"); setAcceptedTerms(false); }} className="w-full mt-2">
                        Login
                      </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t p-4 text-center text-xs text-muted-foreground">
                  Your data is encrypted and handled under our published privacy commitments. By continuing, you agree to our Terms of Service.
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {stage === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="p-8 md:p-12 text-center space-y-8 shadow-xl border-0 max-w-2xl mx-auto">
                <div className="mx-auto w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                  <Brain size={40} />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-display font-bold text-primary">Full Clinical Assessment</h1>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                    A guided assessment covering memory, processing speed, executive function, and attention.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock size={20} className="text-accent" />
                    <span className="text-sm font-medium">~27 Minutes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Brain size={20} className="text-accent" />
                    <span className="text-sm font-medium">11 Cognitive Tasks</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText size={20} className="text-accent" />
                    <span className="text-sm font-medium">Health History</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Activity size={20} className="text-accent" />
                    <span className="text-sm font-medium">Symptom Screeners</span>
                  </div>
                </div>
                <div className="max-w-lg mx-auto space-y-3">
                  <label className="flex items-start gap-3 text-sm text-slate-600">
                    <Checkbox
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                      className="mt-1"
                    />
                    <span>
                      I acknowledge the{" "}
                      <a
                        href="/terms-of-use"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        Terms of Use
                      </a>{" "}
                      and consent to the demo storing sample data for illustrative purposes.
                    </span>
                  </label>
                  <Button
                    size="lg"
                    onClick={() => setStage("demographics")}
                    className="w-full text-lg h-12"
                    disabled={!acceptedTerms}
                  >
                    {CTA_LABELS.beginAssessment}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {stage === "demographics" && (
            <motion.div key="demo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <DemographicsForm onComplete={handleDemographicsComplete} />
            </motion.div>
          )}

          {stage === "history" && (
            <motion.div key="hist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <MedicalHistoryForm onComplete={handleHistoryComplete} />
            </motion.div>
          )}

          {stage === "screeners" && (
            <motion.div key="screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ScreenersForm onComplete={handleScreenersComplete} />
            </motion.div>
          )}

          {/* COGNITIVE TESTS */}
          {stage === "test-orientation" && (
            <motion.div key="orient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <OrientationTest onComplete={() => advanceTest("orientation", 100)} />
              </Card>
            </motion.div>
          )}
          
          {stage === "test-symbol" && (
            <motion.div key="symbol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <SymbolCodingTest onComplete={(score) => advanceTest("symbol", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-list-learn" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <VerbalListTest onComplete={(score) => advanceTest("list", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-memory" && ( // Visual Pattern Memory
            <motion.div key="mem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <MemoryTest onComplete={(score) => advanceTest("visual_memory", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-reaction" && ( // Continuous Performance Task
            <motion.div key="react" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <div className="mb-4 text-center">
                  <h3 className="font-bold text-primary">Continuous Performance Task</h3>
                  <p className="text-sm text-muted-foreground">This standard reaction test approximates the CPT.</p>
                </div>
                <ReactionTest onComplete={(score) => advanceTest("cpt", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-digit" && (
            <motion.div key="digit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <DigitSpanTest onComplete={(score) => advanceTest("digit_span", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-stroop" && (
            <motion.div key="stroop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <StroopTest onComplete={(score) => advanceTest("stroop", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-go-no-go" && (
            <motion.div key="go-no-go" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <div className="mb-4 text-center">
                  <h3 className="font-bold text-primary">Go/No-Go Task</h3>
                  <p className="text-sm text-muted-foreground">Measures response inhibition by tapping only on green circles.</p>
                </div>
                <GoNoGoTask onComplete={(result) => advanceTest("go_no_go", result)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-trails" && (
            <motion.div key="trails" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <TrailsTest onComplete={(score) => advanceTest("trails", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "test-fluency" && (
            <motion.div key="fluency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-end mb-3">
                <Button variant="ghost" size="sm" onClick={skipCurrentTest}>
                  Skip Task
                </Button>
              </div>
              <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
                <FluencyTest onComplete={(score) => advanceTest("fluency", score)} />
              </Card>
            </motion.div>
          )}

          {stage === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
                <FullAssessmentReportView
                  report={{
                    demographics,
                    completedAt,
                    cognitiveScores,
                    screenerScores,
                    recommendations,
                  }}
                  onDownload={handleDownloadReport}
                  showDevData={showDevData}
                  setShowDevData={setShowDevData}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
