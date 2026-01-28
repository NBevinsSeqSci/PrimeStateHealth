import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: null, // Will be verified via magic link or after first password login
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
