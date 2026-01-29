import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, termsAccepted, termsVersion, magicLinkOnly } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }

    // Enforce terms acceptance
    if (termsAccepted !== true) {
      return NextResponse.json(
        { error: "You must accept the Terms of Use to create an account" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // For magic link flow: update existing user's name if they don't have one yet
      if (magicLinkOnly && !existingUser.firstName) {
        await prisma.user.update({
          where: { email },
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: `${firstName.trim()} ${lastName.trim()}`,
          },
        });
        return NextResponse.json({ success: true, userId: existingUser.id }, { status: 200 });
      }
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password if provided (optional for magic link signup)
    let passwordHash = null;
    if (password && typeof password === "string" && password.length >= 8) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    // Create user with names and terms acceptance
    const user = await prisma.user.create({
      data: {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        passwordHash,
        emailVerified: null,
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
      },
    });

    // Track server-side signup event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email,
      event: "signup_completed",
      properties: {
        method: magicLinkOnly ? "magic_link" : "password",
        userId: user.id,
        source: "api",
      },
    });

    // Identify user on server side
    posthog.identify({
      distinctId: email,
      properties: {
        email: email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        createdAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Track signup failure
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "anonymous",
      event: "signup_failed",
      properties: {
        error: error instanceof Error ? error.message : "Unknown error",
        source: "api",
      },
    });

    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
