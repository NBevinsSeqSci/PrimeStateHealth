import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertPatientReportSchema, insertClinicianSchema } from "@shared/schema";
import { patientAssessmentPayloadSchema } from "@shared/reportSchemas";
import bcrypt from "bcrypt";
import { eventsRouter } from "./routes/events";
import { logEvent } from "./lib/eventLogger";
import { shouldLogEvent } from "./lib/eventDedupe";
import rateLimit from "express-rate-limit";

const DEFAULT_CLINIC_ID = process.env.DEFAULT_CLINIC_ID || "bevins";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const requireClinician = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.clinician) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
};

const resolveSessionClinicId = (req: Request) =>
  req.session?.clinician?.clinicId ?? req.session?.clinicId ?? DEFAULT_CLINIC_ID;

export async function handlePatientAssessment(req: Request, res: Response) {
  try {
    const payload = patientAssessmentPayloadSchema.parse(req.body);
    const validatedData = insertPatientReportSchema.parse(payload);
    const report = await storage.createPatientReport(validatedData);

    const demographics = validatedData.demographics as Record<string, any> | null;
    const visitType =
      demographics && typeof demographics.visitType === "string"
        ? demographics.visitType
        : null;
    const eventType =
      visitType === "full-assessment"
        ? "FULL_TEST_COMPLETED"
        : visitType?.startsWith("screener")
        ? "SCREENER_COMPLETED"
        : null;

    if (eventType) {
      const firstName = demographics?.firstName ?? demographics?.givenName ?? null;
      const lastName = demographics?.lastName ?? demographics?.familyName ?? null;
      const fullName =
        typeof firstName === "string" || typeof lastName === "string"
          ? [firstName, lastName].filter(Boolean).join(" ")
          : null;
      const userEmail =
        typeof demographics?.email === "string" ? demographics.email : null;
      const identity = userEmail ?? req.ip ?? "anonymous";
      const dedupeKey = [eventType, validatedData.clinicId ?? "unknown", identity, visitType ?? "unknown"].join("|");
      if (!shouldLogEvent(dedupeKey)) {
        return res.json({
          success: true,
          reportId: report.id,
          dedupedEvent: true,
        });
      }

      const reportScores =
        (validatedData.screenerScores as any)?.report?.scores ?? null;

      void logEvent({
        type: eventType,
        clinicPublicId: validatedData.clinicId ?? null,
        submissionId: String(report.id),
        userEmail,
        userName: fullName,
        ip: req.ip,
        userAgent: req.get("user-agent") ?? null,
        referer: req.get("referer") ?? null,
        path: req.path,
        meta:
          eventType === "SCREENER_COMPLETED"
            ? {
                moodScore: reportScores?.depression ?? null,
                attentionScore: reportScores?.attention ?? null,
                reactionScore: reportScores?.reaction ?? null,
                visualMemoryScore: reportScores?.memory ?? null,
                execFunctionScore: reportScores?.executive ?? null,
                visitType,
              }
            : { visitType },
      }).catch(() => {});
    }

    return res.json({
      success: true,
      reportId: report.id,
    });
  } catch (error) {
    console.error("Assessment submission error:", error);
    return res.status(500).json({ error: "Failed to save assessment" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/api/events", eventsRouter);
  
  // Clinician authentication
  app.post("/api/clinician/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const clinician = await storage.getClinicianByEmail(email);
      
      if (!clinician) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, clinician.password);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.clinician = {
        id: clinician.id,
        email: clinician.email,
        name: clinician.name,
        clinicId: DEFAULT_CLINIC_ID,
      };
      req.session.clinicId = DEFAULT_CLINIC_ID;

      return res.json({ 
        success: true, 
        clinician: { 
          id: clinician.id, 
          email: clinician.email,
          name: clinician.name,
          clinicId: DEFAULT_CLINIC_ID,
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/clinician/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("nv_session");
      return res.json({ success: true });
    });
  });

  app.get("/api/clinician/me", (req, res) => {
    if (!req.session?.clinician) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!req.session.clinician.clinicId) {
      req.session.clinician.clinicId = resolveSessionClinicId(req);
    }
    return res.json({ clinician: req.session.clinician });
  });

  // Create clinician (for seeding/setup)
  app.post("/api/clinician/register", async (req, res) => {
    try {
      const validatedData = insertClinicianSchema.parse(req.body);
      
      const existing = await storage.getClinicianByEmail(validatedData.email);
      if (existing) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const clinician = await storage.createClinician({
        ...validatedData,
        password: hashedPassword,
      });

      return res.json({ 
        success: true, 
        clinician: { 
          id: clinician.id, 
          email: clinician.email 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Registration failed" });
    }
  });

  // Submit patient assessment
  app.post("/api/patient/assessment", handlePatientAssessment);

  // Get all patient reports for a clinic
  app.get("/api/clinic/:clinicId/reports", requireClinician, async (req, res) => {
    try {
      const { clinicId } = req.params;
      const sessionClinicId = resolveSessionClinicId(req);
      if (clinicId !== sessionClinicId) {
        return res.status(403).json({ error: "Clinic access denied" });
      }
      const reports = await storage.getPatientReportsByClinic(clinicId);
      
      return res.json({ reports });
    } catch (error) {
      console.error("Fetch reports error:", error);
      return res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Get single patient report
  app.get("/api/patient/report/:id", requireClinician, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getPatientReportById(id);
      
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      const sessionClinicId = resolveSessionClinicId(req);
      if (report.clinicId !== sessionClinicId) {
        return res.status(403).json({ error: "Clinic access denied" });
      }
      
      return res.json({ report });
    } catch (error) {
      console.error("Fetch report error:", error);
      return res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  return httpServer;
}
