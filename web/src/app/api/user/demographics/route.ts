import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { dateOfBirth, sex, education, country } = body;

    // Validate required fields
    if (!dateOfBirth || !sex || !education || !country) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update user with demographics
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dateOfBirth: new Date(dateOfBirth),
        sex,
        education,
        country,
        demographicsCompleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving demographics:", error);
    return NextResponse.json(
      { error: "Failed to save demographics" },
      { status: 500 }
    );
  }
}
