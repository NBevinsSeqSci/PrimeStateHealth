import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, termsAccepted, termsVersion } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Create user with terms acceptance
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: null,
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: termsVersion || process.env.TERMS_VERSION || "2026-01-28",
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
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
