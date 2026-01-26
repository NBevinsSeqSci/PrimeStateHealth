import { NextResponse } from "next/server";
import { sendMagicLinkEmail } from "@/lib/brevo";

const getTokenFromRequest = (request: Request) => {
  const headerToken = request.headers.get("x-smoke-token");
  if (headerToken) {
    return headerToken;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return null;
};

const isAuthorized = (request: Request) => {
  const token = process.env.SMOKE_TEST_TOKEN;
  if (!token) {
    return false;
  }

  return getTokenFromRequest(request) === token;
};

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
  };

  if (!body.email) {
    return NextResponse.json(
      { ok: false, error: "Email is required." },
      { status: 400 }
    );
  }

  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const normalizedAppUrl = appUrl.replace(/\/$/, "");

  let host = "localhost";
  try {
    host = new URL(appUrl).host || host;
  } catch {
    // Fallback to default host.
  }

  try {
    await sendMagicLinkEmail({
      email: body.email,
      url: `${normalizedAppUrl || "http://localhost:3000"}/login?smoke=1`,
      host,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Send failed.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
