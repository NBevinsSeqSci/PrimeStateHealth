import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, termsAccepted, termsVersion, magicLinkOnly } =
      body;
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedFirstName =
      typeof firstName === "string" ? firstName.trim() : "";
    const trimmedLastName =
      typeof lastName === "string" ? lastName.trim() : "";
    const isMagicLinkOnly = Boolean(magicLinkOnly);

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!trimmedFirstName) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!trimmedLastName) {
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
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // For magic link flow: update existing user's name if they don't have one yet
      if (isMagicLinkOnly && !existingUser.firstName) {
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: {
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            name: `${trimmedFirstName} ${trimmedLastName}`,
          },
        });
        return NextResponse.json({ success: true, userId: existingUser.id }, { status: 200 });
      }
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password if provided (optional for magic link signup)
    let passwordHash = null;
    if (!isMagicLinkOnly) {
      if (!password || typeof password !== "string" || password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      passwordHash = await bcrypt.hash(password, 12);
    } else if (password && typeof password === "string" && password.length >= 8) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    // Create user with names and terms acceptance
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        name: `${trimmedFirstName} ${trimmedLastName}`,
        passwordHash,
        emailVerified: null,
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
        additionalLanguages: [],
        raceEthnicity: [],
        isMultilingual: false,
      },
    });

    // Track server-side signup event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: normalizedEmail,
      event: "signup_completed",
      properties: {
        method: isMagicLinkOnly ? "magic_link" : "password",
        userId: user.id,
        source: "api",
      },
    });

    // Identify user on server side
    posthog.identify({
      distinctId: normalizedEmail,
      properties: {
        email: normalizedEmail,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        name: `${trimmedFirstName} ${trimmedLastName}`,
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    }

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
