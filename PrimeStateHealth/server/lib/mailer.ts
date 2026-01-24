import nodemailer from "nodemailer";

type MailerMode = "smtp" | "console" | "disabled";

type MailPayload = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

const getMailerMode = (): MailerMode => {
  const raw = (process.env.MAILER_MODE || "").toLowerCase();
  if (raw === "smtp" || raw === "console" || raw === "disabled") {
    return raw;
  }
  return process.env.NODE_ENV === "production" ? "disabled" : "console";
};

const smtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

const sanitizeText = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 500 ? `${trimmed.slice(0, 500)}...` : trimmed;
};

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;
let initialized = false;
let initReason: string | undefined;

const initTransportOnce = () => {
  if (initialized) return;
  initialized = true;

  const mode = getMailerMode();
  if (mode !== "smtp") {
    initReason = `mode=${mode}`;
    return;
  }

  if (!smtpConfigured()) {
    initReason = "missing SMTP_* configuration";
    console.warn("[mailer] MAILER_MODE=smtp but SMTP_* missing. Email disabled; app will continue.");
    return;
  }

  transport = nodemailer.createTransport({
    host: String(process.env.SMTP_HOST),
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_PORT) === "465",
    auth: {
      user: String(process.env.SMTP_USER),
      pass: String(process.env.SMTP_PASS),
    },
  });
};

export const mailerStatus = () => {
  const mode = getMailerMode();
  initTransportOnce();
  if (mode === "disabled") {
    return { mode, enabled: false, reason: "MAILER_MODE=disabled" };
  }
  if (mode === "console") {
    return { mode, enabled: false, reason: "MAILER_MODE=console" };
  }
  if (!transport) {
    return { mode, enabled: false, reason: initReason ?? "smtp not configured" };
  }
  return { mode, enabled: true };
};

export async function sendMail(payload: MailPayload): Promise<void> {
  const mode = getMailerMode();

  if (mode === "disabled") {
    return;
  }

  if (mode === "console") {
    console.log("[mailer:console]", {
      to: payload.to,
      subject: payload.subject,
      text: sanitizeText(payload.text),
      hasHtml: Boolean(payload.html),
    });
    return;
  }

  initTransportOnce();
  if (!transport) {
    return;
  }

  try {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@primestatehealth.com";
    await transport.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  } catch (error) {
    console.error("[mailer] send failed (non-fatal):", error);
  }
}

const DEFAULT_OWNER_NOTIFY = "nbevins@sequencesciences.com";

function ownerRecipients(): string[] {
  const raw = process.env.OWNER_NOTIFY_EMAILS ?? DEFAULT_OWNER_NOTIFY;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendEventNotificationEmail(args: {
  eventType: string;
  occurredAtISO: string;
  clinicPublicId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  submissionId?: string | null;
  reportId?: string | null;
  path?: string | null;
  meta?: Record<string, unknown>;
}) {
  const to = ownerRecipients();
  const subject = `[Prime State Health] Event: ${args.eventType}`;

  const metaLines = args.meta
    ? Object.entries(args.meta)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join("\n")
    : "none";

  const text = `Prime State Health event recorded.

Type: ${args.eventType}
Time: ${args.occurredAtISO}
Clinic: ${args.clinicPublicId ?? "n/a"}
User: ${args.userName ?? "n/a"} <${args.userEmail ?? "n/a"}>

Submission ID: ${args.submissionId ?? "n/a"}
Report ID: ${args.reportId ?? "n/a"}
Path: ${args.path ?? "n/a"}

Meta:
${metaLines}

(Keep emails free of detailed answers/PHI; review within the app when needed.)`;

  await sendMail({ to: to.join(","), subject, text });
}
