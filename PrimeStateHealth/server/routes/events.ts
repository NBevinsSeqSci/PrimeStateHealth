import { Router, type Request, type Response } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import type { Prisma } from "@prisma/client";
import type { AppEventType } from "../lib/eventTypes";
import { logEvent } from "../lib/eventLogger";
import { shouldLogEvent } from "../lib/eventDedupe";

export const eventsRouter = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const TrackEventSchema = z.object({
  type: z.enum([
    "SCREENER_COMPLETED",
    "FULL_TEST_COMPLETED",
    "REPORT_DOWNLOADED",
    "METABOLOMICS_PILOT_SIGNUP_ATTEMPTED",
    "METABOLOMICS_EXAMPLE_REPORT_DOWNLOADED",
  ]),
  clinicPublicId: z.string().optional(),
  submissionId: z.string().uuid().optional(),
  reportId: z.string().optional(),
  userEmail: z.string().email().optional(),
  userName: z.string().min(1).optional(),
  path: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export async function trackEventHandler(req: Request, res: Response) {
  const parsed = TrackEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const body = parsed.data;
  let eventId: string | null = null;

  try {
    const identity = body.userEmail ?? req.ip ?? "anonymous";
    const visitType = typeof body.meta?.visitType === "string" ? body.meta.visitType : "unknown";
    const dedupeKey = [body.type, body.clinicPublicId ?? "unknown", identity, visitType].join("|");
    if (!shouldLogEvent(dedupeKey)) {
      return res.json({ ok: true, eventId: null, deduped: true });
    }
    const event = await logEvent({
      type: body.type as AppEventType,
      clinicPublicId: body.clinicPublicId ?? null,
      submissionId: body.submissionId ?? null,
      reportId: body.reportId ?? null,
      userEmail: body.userEmail ?? null,
      userName: body.userName ?? null,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? null,
      referer: req.get("referer") ?? null,
      path: body.path ?? req.path,
      meta: (body.meta ?? {}) as Prisma.InputJsonValue,
    });
    eventId = event.id;
  } catch (error) {
    console.warn("Failed to log event:", error);
  }

  return res.json({ ok: true, eventId });
}

eventsRouter.post("/track", limiter, trackEventHandler);
