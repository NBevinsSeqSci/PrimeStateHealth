import "express-session";

declare module "express-session" {
  interface SessionData {
    clinician?: {
      id: number;
      email: string;
      name?: string | null;
      clinicId?: string | null;
    };
    clinicId?: string | null;
  }
}
