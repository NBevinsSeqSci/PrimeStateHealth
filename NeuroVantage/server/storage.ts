import type { DatabaseClient } from "./db";
import { db } from "./db";
import {
  clinicians,
  patientReports,
  type Clinician,
  type InsertClinician,
  type PatientReport,
  type InsertPatientReport,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getClinicianByEmail(email: string): Promise<Clinician | undefined>;
  createClinician(clinician: InsertClinician): Promise<Clinician>;
  
  createPatientReport(report: InsertPatientReport): Promise<PatientReport>;
  getPatientReportsByClinic(clinicId: string): Promise<PatientReport[]>;
  getAllPatientReports(): Promise<PatientReport[]>;
  getPatientReportById(id: number): Promise<PatientReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor(private readonly dbClient: DatabaseClient) {}

  async getClinicianByEmail(email: string): Promise<Clinician | undefined> {
    const result = await this.dbClient
      .select()
      .from(clinicians)
      .where(eq(clinicians.email, email))
      .limit(1);
    return result[0];
  }

  async createClinician(insertClinician: InsertClinician): Promise<Clinician> {
    const result = await this.dbClient.insert(clinicians).values(insertClinician).returning();
    return result[0];
  }

  async createPatientReport(insertReport: InsertPatientReport): Promise<PatientReport> {
    const result = await this.dbClient.insert(patientReports).values(insertReport).returning();
    return result[0];
  }

  async getPatientReportsByClinic(clinicId: string): Promise<PatientReport[]> {
    return await this.dbClient
      .select()
      .from(patientReports)
      .where(eq(patientReports.clinicId, clinicId))
      .orderBy(patientReports.createdAt);
  }

  async getAllPatientReports(): Promise<PatientReport[]> {
    return await this.dbClient.select().from(patientReports).orderBy(patientReports.createdAt);
  }

  async getPatientReportById(id: number): Promise<PatientReport | undefined> {
    const result = await this.dbClient
      .select()
      .from(patientReports)
      .where(eq(patientReports.id, id))
      .limit(1);
    return result[0];
  }
}

class MemoryStorage implements IStorage {
  private cliniciansStore: Clinician[] = [];
  private patientReportsStore: PatientReport[] = [];
  private clinicianCounter = 1;
  private reportCounter = 1;

  async getClinicianByEmail(email: string): Promise<Clinician | undefined> {
    return this.cliniciansStore.find((c) => c.email === email);
  }

  async createClinician(insertClinician: InsertClinician): Promise<Clinician> {
    const clinician: Clinician = {
      id: this.clinicianCounter++,
      email: insertClinician.email,
      password: insertClinician.password,
      name: insertClinician.name ?? null,
      createdAt: new Date(),
    };
    this.cliniciansStore.push(clinician);
    return clinician;
  }

  async createPatientReport(insertReport: InsertPatientReport): Promise<PatientReport> {
    const report: PatientReport = {
      id: this.reportCounter++,
      clinicId: insertReport.clinicId ?? "bevins",
      demographics: insertReport.demographics,
      medicalHistory: insertReport.medicalHistory,
      screenerScores: insertReport.screenerScores,
      cognitiveScores: insertReport.cognitiveScores,
      recommendations: insertReport.recommendations,
      metabolomics: insertReport.metabolomics ?? null,
      metaboliteResults: insertReport.metaboliteResults ?? null,
      patientContext: insertReport.patientContext ?? null,
      status: insertReport.status ?? "Review",
      createdAt: new Date(),
    };
    this.patientReportsStore.push(report);
    return report;
  }

  async getPatientReportsByClinic(clinicId: string): Promise<PatientReport[]> {
    return this.patientReportsStore
      .filter((report) => report.clinicId === clinicId)
      .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));
  }

  async getAllPatientReports(): Promise<PatientReport[]> {
    return [...this.patientReportsStore].sort(
      (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0),
    );
  }

  async getPatientReportById(id: number): Promise<PatientReport | undefined> {
    return this.patientReportsStore.find((report) => report.id === id);
  }
}

let selectedStorage: IStorage;

if (db) {
  selectedStorage = new DatabaseStorage(db);
} else {
  selectedStorage = new MemoryStorage();
}

export const storage = selectedStorage;
