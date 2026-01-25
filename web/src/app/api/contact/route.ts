import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ratelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

type Payload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  turnstileToken?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    }
  );

  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "local";

    if (ratelimit) {
      const { success } = await ratelimit.limit(`contact:${ip}`);
      if (!success) {
        return NextResponse.json(
          { ok: false, error: "Rate limit exceeded." },
          { status: 429 }
        );
      }
    }

    const body = (await request.json()) as Partial<Payload>;

    if (body.company && String(body.company).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const turnstileToken = String(body.turnstileToken || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email." },
        { status: 400 }
      );
    }
    if (message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Message is too short." },
        { status: 400 }
      );
    }

    const shouldVerifyTurnstile = !!process.env.TURNSTILE_SECRET_KEY;
    if (shouldVerifyTurnstile) {
      if (!turnstileToken) {
        return NextResponse.json(
          { ok: false, error: "Turnstile verification failed." },
          { status: 400 }
        );
      }
      const verified = await verifyTurnstile(
        turnstileToken,
        ip === "local" ? undefined : ip
      );
      if (!verified) {
        return NextResponse.json(
          { ok: false, error: "Turnstile verification failed." },
          { status: 400 }
        );
      }
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from =
      process.env.SMTP_FROM || "Prime State Health <no-reply@primestatehealth.com>";

    if (!to || !host || !user || !pass) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email is not configured. Set SMTP_* and CONTACT_TO_EMAIL env vars.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const text = [
      "New contact form submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const safeSubject = subject.replace(/[\r\n]+/g, " ").slice(0, 140);

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `[Prime State Health] ${safeSubject}`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}
