import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getPostHogClient } from "@/lib/posthog-server";

type SaveResultPayload = {
  kind: string;
  score: number;
  answers?: unknown;
};

// GET - Fetch user's test history
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const results = await prisma.cognitiveTest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      kind: true,
      score: true,
      createdAt: true,
    },
  });

  // Get completion status by test kind
  const completedTests = new Set(
    results.filter((r) => r.kind).map((r) => r.kind)
  );

  // Get most recent result for each test kind
  const latestByKind: Record<string, { score: number; createdAt: Date }> = {};
  for (const result of results) {
    if (result.kind && !latestByKind[result.kind]) {
      latestByKind[result.kind] = {
        score: result.score,
        createdAt: result.createdAt,
      };
    }
  }

  // Get user info for personalization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      preferredName: true,
      name: true,
    },
  });

  const displayName =
    user?.preferredName || user?.firstName || user?.name?.split(" ")[0] || null;

  return NextResponse.json({
    displayName,
    totalTests: results.length,
    completedTestKinds: Array.from(completedTests),
    latestByKind,
    recentResults: results.slice(0, 5),
  });
}

// POST - Save a test result
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required to save results" },
      { status: 401 }
    );
  }

  const body = (await request.json()) as Partial<SaveResultPayload>;
  const { kind, score, answers } = body;

  if (!kind || typeof kind !== "string") {
    return NextResponse.json(
      { error: "Test kind is required" },
      { status: 400 }
    );
  }

  if (typeof score !== "number" || !Number.isFinite(score)) {
    return NextResponse.json(
      { error: "Valid score is required" },
      { status: 400 }
    );
  }

  const result = await prisma.cognitiveTest.create({
    data: {
      userId: session.user.id,
      email: session.user.email,
      kind,
      score: Math.round(score),
      answers: answers !== undefined ? (answers as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });

  // Track server-side test result saved event
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: session.user.email ?? session.user.id,
    event: "test_result_saved",
    properties: {
      testId: result.id,
      testKind: result.kind,
      score: result.score,
      userId: session.user.id,
      source: "api",
    },
  });

  return NextResponse.json({
    id: result.id,
    kind: result.kind,
    score: result.score,
    createdAt: result.createdAt,
  });
}
