import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const demographicsSchema = z.object({
  // Identity (required)
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.preprocess(emptyToUndefined, z.string().optional()),

  // Demographics (required)
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["male", "female", "other"]),
  education: z.enum([
    "high-school",
    "some-college",
    "bachelors",
    "masters",
    "doctorate",
    "other",
  ]),

  // Location
  country: z.string().min(1, "Country is required"),
  region: z.preprocess(emptyToUndefined, z.string().optional()),
  city: z.string().min(1, "City is required"),
  postalCode: z.preprocess(emptyToUndefined, z.string().optional()),
  timeZone: z.preprocess(emptyToUndefined, z.string().optional()),

  // Background (optional)
  primaryLanguage: z.preprocess(emptyToUndefined, z.string().optional()),
  englishProficiency: z.preprocess(
    emptyToUndefined,
    z.enum(["native", "fluent", "conversational", "limited"]).optional()
  ),
  isMultilingual: z.boolean().optional(),
  additionalLanguages: z.array(z.string()).optional(),
  handedness: z.preprocess(
    emptyToUndefined,
    z.enum(["right", "left", "ambidextrous"]).optional()
  ),
  raceEthnicity: z.array(z.string()).optional(),
  deviceType: z.preprocess(emptyToUndefined, z.string().optional()),
}).refine(
  (data) => {
    // Require region for US, Canada, Australia
    if (["United States", "Canada", "Australia"].includes(data.country)) {
      return data.region && data.region.length > 0;
    }
    return true;
  },
  {
    message: "State/Province is required for US, Canada, and Australia",
    path: ["region"],
  }
).refine(
  (data) => {
    // Validate US ZIP code if country is US and postalCode is provided
    if (data.country === "United States" && data.postalCode) {
      return /^\d{5}(-\d{4})?$/.test(data.postalCode);
    }
    return true;
  },
  {
    message: "Invalid US ZIP code format",
    path: ["postalCode"],
  }
);

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate the input
    const validationResult = demographicsSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update user with demographics
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        // Identity
        firstName: data.firstName,
        lastName: data.lastName,
        preferredName: data.preferredName || null,
        name: data.preferredName || `${data.firstName} ${data.lastName}`,

        // Demographics
        dateOfBirth: new Date(data.dateOfBirth),
        sex: data.sex,
        education: data.education,

        // Location
        country: data.country,
        region: data.region || null,
        city: data.city,
        postalCode: data.postalCode || null,
        timeZone: data.timeZone || null,

        // Background
        primaryLanguage: data.primaryLanguage || null,
        englishProficiency: data.englishProficiency || null,
        isMultilingual: data.isMultilingual ?? false,
        additionalLanguages: data.additionalLanguages || [],
        handedness: data.handedness || null,
        raceEthnicity: data.raceEthnicity || [],
        deviceType: data.deviceType || null,

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

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        preferredName: true,
        dateOfBirth: true,
        sex: true,
        education: true,
        country: true,
        region: true,
        city: true,
        postalCode: true,
        timeZone: true,
        primaryLanguage: true,
        englishProficiency: true,
        isMultilingual: true,
        additionalLanguages: true,
        handedness: true,
        raceEthnicity: true,
        deviceType: true,
        demographicsCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || null,
    });
  } catch (error) {
    console.error("Error fetching demographics:", error);
    return NextResponse.json(
      { error: "Failed to fetch demographics" },
      { status: 500 }
    );
  }
}
