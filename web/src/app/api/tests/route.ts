import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

type TestPayload = {
  email: string;
  answers: number[];
  turnstileToken?: string | null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const scoreFromAnswers = (answers: number[]) =>
  answers.reduce((total, value) => total + clamp(value, 0, 4), 0);

export async function POST(request: Request) {
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
    const { success } = await ratelimit.limit(`tests:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        { status: 429 }
      );
    }
  }

  const body = (await request.json()) as Partial<TestPayload>;
  const email = body.email?.trim();
  const answers = Array.isArray(body.answers) ? body.answers : null;
  const turnstileToken = body.turnstileToken ?? null;

  if (!email || !answers) {
    return NextResponse.json(
      { error: "Email and answers are required." },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstile(
    turnstileToken,
    request.headers.get("x-forwarded-for")
  );
  if (!turnstile.success) {
    return NextResponse.json(
      { error: "Turnstile verification failed." },
      { status: 403 }
    );
  }

  const session = await auth();

  // Require authentication to save results
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required to save results. Please log in or create an account." },
      { status: 401 }
    );
  }

  const score = scoreFromAnswers(answers);

  const test = await prisma.cognitiveTest.create({
    data: {
      email,
      answers,
      score,
      userId: session.user.id,
    },
  });

  // Queue a follow-up email via Inngest.
  try {
    const { inngest } = await import("@/lib/inngest");
    await inngest.send({
      name: "assessment.completed",
      data: {
        testId: test.id,
        email: test.email,
        score: test.score,
      },
    });
  } catch {
    // If Inngest is not configured, skip enqueueing the follow-up.
  }

  return NextResponse.json({ id: test.id, score });
}
