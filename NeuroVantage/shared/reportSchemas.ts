import { z } from "zod";

export const visitTypeSchema = z.enum([
  "full-assessment",
  "screener-full",
  "screener-partial",
  "screener-questionnaire",
]);

export const demographicsSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    age: z.number().optional(),
    ageYears: z.number().optional(),
    visitType: visitTypeSchema.optional(),
  })
  .passthrough();

export const medicalHistorySchema = z.record(z.unknown());

export const screenerScoresSchema = z
  .object({
    summary: z
      .object({
        assessmentType: z.string().optional(),
        dataQualityNote: z.string().optional(),
        highLevelFlags: z.array(z.string()).optional(),
      })
      .optional(),
    report: z
      .object({
        scores: z.record(z.unknown()).optional(),
      })
      .optional(),
  })
  .passthrough();

export const cognitiveScoresSchema = z
  .object({
    missingTasks: z.array(z.string()).optional(),
  })
  .passthrough();

export const recommendationSchema = z
  .object({
    title: z.string().optional(),
    category: z.string().optional(),
    patientText: z.string().optional(),
    clinicianNote: z.string().optional(),
    basedOn: z.string().optional(),
  })
  .passthrough();

export const recommendationsSchema = z.array(recommendationSchema);

export const metabolomicsSchema = z
  .object({
    results: z.array(z.record(z.unknown())).optional(),
    pathways: z.unknown().optional(),
  })
  .passthrough();

export const metaboliteResultsSchema = z.array(z.record(z.unknown()));

export const patientContextSchema = z.record(z.unknown());

export const patientAssessmentPayloadSchema = z.object({
  clinicId: z.string().min(1),
  demographics: demographicsSchema,
  medicalHistory: medicalHistorySchema,
  screenerScores: screenerScoresSchema,
  cognitiveScores: cognitiveScoresSchema,
  recommendations: recommendationsSchema,
  metabolomics: metabolomicsSchema.optional().nullable(),
  metaboliteResults: metaboliteResultsSchema.optional().nullable(),
  patientContext: patientContextSchema.optional().nullable(),
  status: z.string().optional(),
});

export type VisitType = z.infer<typeof visitTypeSchema>;
export type Demographics = z.infer<typeof demographicsSchema>;
export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type ScreenerScoresPayload = z.infer<typeof screenerScoresSchema>;
export type CognitiveScoresPayload = z.infer<typeof cognitiveScoresSchema>;
export type RecommendationPayload = z.infer<typeof recommendationSchema>;
export type RecommendationsPayload = z.infer<typeof recommendationsSchema>;
export type MetabolomicsPayload = z.infer<typeof metabolomicsSchema>;
export type MetaboliteResultsPayload = z.infer<typeof metaboliteResultsSchema>;
export type PatientContextPayload = z.infer<typeof patientContextSchema>;
export type PatientAssessmentPayload = z.infer<typeof patientAssessmentPayloadSchema>;
