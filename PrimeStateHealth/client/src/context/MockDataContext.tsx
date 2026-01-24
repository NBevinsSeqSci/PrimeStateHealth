import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Types ---
export interface PatientReport {
  id: string;
  clinicId: string;
  demographics: any;
  medicalHistory: any;
  screenerScores: any;
  cognitiveScores: any;
  recommendations: any[];
  timestamp: string;
  status: "Review" | "Stable" | "Attention" | "Improved";
}

interface MockDataContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  patients: PatientReport[];
  addPatientReport: (report: Omit<PatientReport, "id" | "timestamp" | "status">) => void;
}

// --- Context ---
const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// --- Provider ---
export function MockDataProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patients, setPatients] = useState<PatientReport[]>([
    // Initial mock data
    { 
        id: "1001", 
        clinicId: "bevins",
        demographics: { firstName: "Sarah", lastName: "Miller", age: 45 }, 
        medicalHistory: {}, screenerScores: {}, cognitiveScores: { symbol: 42 }, recommendations: [],
        timestamp: "2 days ago", status: "Review" 
    },
    { 
        id: "1002", 
        clinicId: "bevins",
        demographics: { firstName: "James", lastName: "Chen", age: 32 }, 
        medicalHistory: {}, screenerScores: {}, cognitiveScores: { symbol: 55 }, recommendations: [],
        timestamp: "1 week ago", status: "Stable" 
    },
  ]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const addPatientReport = (reportData: Omit<PatientReport, "id" | "timestamp" | "status">) => {
    const newReport: PatientReport = {
      ...reportData,
      id: (1000 + patients.length + 1).toString(),
      timestamp: "Just now",
      status: "Review" // Default status for new reports
    };
    setPatients(prev => [newReport, ...prev]);
  };

  return (
    <MockDataContext.Provider value={{ isAuthenticated, login, logout, patients, addPatientReport }}>
      {children}
    </MockDataContext.Provider>
  );
}

// --- Hook ---
export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}