import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import type { AppEventType } from "./eventTypes";
import { prisma } from "../db/prisma";
import { sendEventNotificationEmail } from "./mailer";

type MetaJson = Prisma.JsonObject;

type EventRecord = {
  id: string;
  type: AppEventType;
  createdAt: Date;
  clinicPublicId: string | null;
  submissionId: string | null;
  reportId: string | null;
  userEmail: string | null;
  userName: string | null;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  path: string | null;
  metaJson: MetaJson;
};

const normalizeMeta = (meta?: Prisma.InputJsonValue): MetaJson => {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return {};
  }
  return meta as MetaJson;
};

export async function logEvent(args: {
  type: AppEventType;
  clinicPublicId?: string | null;
  submissionId?: string | null;
  reportId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  path?: string | null;
  meta?: Prisma.InputJsonValue;
}): Promise<EventRecord> {
  const metaJson = normalizeMeta(args.meta);

  const created = prisma
    ? await prisma.appEvent.create({
        data: {
          type: args.type,
          clinicPublicId: args.clinicPublicId ?? null,
          submissionId: args.submissionId ?? null,
          reportId: args.reportId ?? null,
          userEmail: args.userEmail ?? null,
          userName: args.userName ?? null,
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
          referer: args.referer ?? null,
          path: args.path ?? null,
          metaJson,
        },
      })
    : {
        id: randomUUID(),
        type: args.type,
        createdAt: new Date(),
        clinicPublicId: args.clinicPublicId ?? null,
        submissionId: args.submissionId ?? null,
        reportId: args.reportId ?? null,
        userEmail: args.userEmail ?? null,
        userName: args.userName ?? null,
        ip: args.ip ?? null,
        userAgent: args.userAgent ?? null,
        referer: args.referer ?? null,
        path: args.path ?? null,
        metaJson,
      };

  const event: EventRecord = {
    ...created,
    metaJson: normalizeMeta(
      (created as { metaJson?: Prisma.InputJsonValue }).metaJson ?? metaJson,
    ),
  };

  sendEventNotificationEmail({
    eventType: event.type,
    occurredAtISO: event.createdAt.toISOString(),
    clinicPublicId: event.clinicPublicId,
    userEmail: event.userEmail,
    userName: event.userName,
    submissionId: event.submissionId,
    reportId: event.reportId,
    path: event.path,
    meta: event.metaJson,
  }).catch(() => {});

  return event;
}
