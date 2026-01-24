import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clinicians = pgTable("clinicians", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patientReports = pgTable("patient_reports", {
  id: serial("id").primaryKey(),
  clinicId: text("clinic_id").notNull().default("bevins"),
  demographics: jsonb("demographics").notNull(),
  medicalHistory: jsonb("medical_history").notNull(),
  screenerScores: jsonb("screener_scores").notNull(),
  cognitiveScores: jsonb("cognitive_scores").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  metabolomics: jsonb("metabolomics"),
  metaboliteResults: jsonb("metabolite_results"),
  patientContext: jsonb("patient_context"),
  status: text("status").notNull().default("Review"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClinicianSchema = createInsertSchema(clinicians).omit({
  id: true,
  createdAt: true,
});

export const insertPatientReportSchema = createInsertSchema(patientReports).omit({
  id: true,
  createdAt: true,
});

export type InsertClinician = z.infer<typeof insertClinicianSchema>;
export type Clinician = typeof clinicians.$inferSelect;
export type InsertPatientReport = z.infer<typeof insertPatientReportSchema>;
export type PatientReport = typeof patientReports.$inferSelect;
