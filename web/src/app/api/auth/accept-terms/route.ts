import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, termsVersion } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email and update terms acceptance
    // This handles the case where the user is created via magic link (NextAuth)
    // and we need to record their terms acceptance afterwards
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
      },
      create: {
        email,
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
      },
    });

    // Track terms accepted event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email,
      event: "terms_accepted",
      properties: {
        termsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
        userId: user.id,
        source: "api",
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    console.error("Accept terms error:", error);
    return NextResponse.json(
      { error: "Failed to record terms acceptance" },
      { status: 500 }
    );
  }
}
