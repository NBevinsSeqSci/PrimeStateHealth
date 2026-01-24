import type { PatientReport } from "@shared/schema";
import { apiClient } from "@/lib/apiClient";

export async function loginClinician(email: string, password: string) {
  return apiClient("/api/clinician/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getCurrentClinician() {
  return apiClient("/api/clinician/me");
}

export async function logoutClinician() {
  return apiClient("/api/clinician/logout", {
    method: "POST",
  });
}

export async function submitPatientAssessment(data: {
  clinicId: string;
  demographics: any;
  medicalHistory: any;
  screenerScores: any;
  cognitiveScores: any;
  recommendations: any[];
}) {
  return apiClient("/api/patient/assessment", {
    method: "POST",
    body: {
      ...data,
      status: "Review",
    },
  });
}

export async function getClinicReports(clinicId: string): Promise<{ reports: PatientReport[] }> {
  return apiClient(`/api/clinic/${clinicId}/reports`);
}

export async function getPatientReport(id: number): Promise<{ report: PatientReport }> {
  return apiClient(`/api/patient/report/${id}`);
}
