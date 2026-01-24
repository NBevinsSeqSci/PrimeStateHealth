import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";
import { subscribeToKit } from "@/lib/kit";

export async function POST(request: Request) {
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
    const { success } = await ratelimit.limit(`marketing:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        { status: 429 }
      );
    }
  }

  const body = (await request.json()) as { email?: string; firstName?: string };
  if (!body.email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  await subscribeToKit({ email: body.email, firstName: body.firstName });
  return NextResponse.json({ ok: true });
}
