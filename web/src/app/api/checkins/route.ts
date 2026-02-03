import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { timestamp, ratings, notes } = body;

    if (!ratings || typeof ratings !== "object") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const required = ["mood", "anxiety", "focus", "motivation", "stress", "sleep", "energy"] as const;
    for (const key of required) {
      const val = ratings[key];
      if (typeof val !== "number" || val < 0 || val > 4) {
        return NextResponse.json(
          { error: `Invalid or missing field: ${key}` },
          { status: 400 }
        );
      }
    }

    const checkIn = await prisma.quickCheckIn.create({
      data: {
        userId: session.user.id,
        mood: ratings.mood,
        anxiety: ratings.anxiety,
        focus: ratings.focus,
        motivation: ratings.motivation,
        stress: ratings.stress,
        sleep: ratings.sleep,
        energy: ratings.energy,
        notes: typeof notes === "string" ? notes.slice(0, 2000) || null : null,
        submittedAt: timestamp ? new Date(timestamp) : new Date(),
      },
      select: { id: true, submittedAt: true },
    });

    return NextResponse.json(
      {
        success: true,
        id: checkIn.id,
        submittedAt: checkIn.submittedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Failed to record check-in" },
      { status: 500 }
    );
  }
}
