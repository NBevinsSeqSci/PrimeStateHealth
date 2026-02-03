import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  DemographicsSchema,
  normalizeDemographics,
  zodErrorToMessage,
} from "@/lib/demographicsSchema";
import type { Prisma } from "@prisma/client";

const REQUIRED_REGION_COUNTRIES = new Set([
  "United States",
  "Canada",
  "Australia",
]);
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;

const hasText = (value: string | null | undefined) =>
  typeof value === "string" && value.trim().length > 0;

const hasValidDate = (value: Date | string | null | undefined) => {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime());
};

const isDemographicsComplete = (data: {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | string | null;
  sex: string | null;
  education: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  postalCode: string | null;
}) => {
  if (!hasText(data.firstName)) return false;
  if (!hasText(data.lastName)) return false;
  if (!hasValidDate(data.dateOfBirth)) return false;
  if (!hasText(data.sex)) return false;
  if (!hasText(data.education)) return false;
  if (!hasText(data.country)) return false;
  if (!hasText(data.city)) return false;

  if (data.country && REQUIRED_REGION_COUNTRIES.has(data.country)) {
    if (!hasText(data.region)) return false;
  }

  if (data.country === "United States" && hasText(data.postalCode)) {
    if (!US_ZIP_REGEX.test(data.postalCode)) return false;
  }

  return true;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId && !userEmail) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const normalized = normalizeDemographics(body);

    const validationResult = DemographicsSchema.safeParse(normalized);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      }));
      const details = zodErrorToMessage(validationResult.error);
      console.warn("[/api/user/demographics] validation failed:", details, {
        keys: Object.keys(body ?? {}),
      });
      return NextResponse.json(
        { ok: false, error: "Validation failed", errors, details },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const where = userId ? { id: userId } : { email: userEmail! };
    const existing = await prisma.user.findUnique({
      where,
      select: {
        firstName: true,
        lastName: true,
        preferredName: true,
        name: true,
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

    const normalizedDateOfBirth =
      typeof data.dateOfBirth !== "undefined"
        ? data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null
        : undefined;
    const normalizedAdditionalLanguages =
      typeof data.additionalLanguages !== "undefined"
        ? data.additionalLanguages ?? []
        : undefined;
    const normalizedRaceEthnicity =
      typeof data.raceEthnicity !== "undefined"
        ? data.raceEthnicity ?? []
        : undefined;

    const updateData: Prisma.UserUpdateInput = {};
    if (typeof data.firstName !== "undefined") updateData.firstName = data.firstName;
    if (typeof data.lastName !== "undefined") updateData.lastName = data.lastName;
    if (typeof data.preferredName !== "undefined") updateData.preferredName = data.preferredName;
    if (typeof normalizedDateOfBirth !== "undefined") {
      updateData.dateOfBirth = normalizedDateOfBirth;
    }
    if (typeof data.sex !== "undefined") updateData.sex = data.sex;
    if (typeof data.education !== "undefined") updateData.education = data.education;
    if (typeof data.country !== "undefined") updateData.country = data.country;
    if (typeof data.region !== "undefined") updateData.region = data.region;
    if (typeof data.city !== "undefined") updateData.city = data.city;
    if (typeof data.postalCode !== "undefined") updateData.postalCode = data.postalCode;
    if (typeof data.timeZone !== "undefined") updateData.timeZone = data.timeZone;
    if (typeof data.primaryLanguage !== "undefined") {
      updateData.primaryLanguage = data.primaryLanguage;
    }
    if (typeof data.englishProficiency !== "undefined") {
      updateData.englishProficiency = data.englishProficiency;
    }
    if (typeof data.isMultilingual !== "undefined") {
      updateData.isMultilingual = data.isMultilingual;
    }
    if (typeof normalizedAdditionalLanguages !== "undefined") {
      updateData.additionalLanguages = normalizedAdditionalLanguages;
    }
    if (typeof data.handedness !== "undefined") updateData.handedness = data.handedness;
    if (typeof normalizedRaceEthnicity !== "undefined") {
      updateData.raceEthnicity = normalizedRaceEthnicity;
    }
    if (typeof data.deviceType !== "undefined") updateData.deviceType = data.deviceType;

    const current = existing ?? {
      firstName: null,
      lastName: null,
      preferredName: null,
      name: null,
      dateOfBirth: null,
      sex: null,
      education: null,
      country: null,
      region: null,
      city: null,
      postalCode: null,
      timeZone: null,
      primaryLanguage: null,
      englishProficiency: null,
      isMultilingual: false,
      additionalLanguages: [],
      handedness: null,
      raceEthnicity: [],
      deviceType: null,
      demographicsCompleted: false,
    };

    const nextFirstName =
      typeof data.firstName !== "undefined" ? data.firstName : current.firstName;
    const nextLastName =
      typeof data.lastName !== "undefined" ? data.lastName : current.lastName;
    const nextPreferredName =
      typeof data.preferredName !== "undefined" ? data.preferredName : current.preferredName;

    if (
      typeof data.firstName !== "undefined" ||
      typeof data.lastName !== "undefined" ||
      typeof data.preferredName !== "undefined"
    ) {
      const nextName =
        nextPreferredName ||
        (nextFirstName && nextLastName ? `${nextFirstName} ${nextLastName}` : null);
      updateData.name = nextName;
    }

    const merged = {
      firstName: nextFirstName ?? null,
      lastName: nextLastName ?? null,
      dateOfBirth:
        typeof normalizedDateOfBirth === "undefined"
          ? current.dateOfBirth
          : normalizedDateOfBirth,
      sex: (typeof data.sex !== "undefined" ? data.sex : current.sex) ?? null,
      education:
        (typeof data.education !== "undefined" ? data.education : current.education) ?? null,
      country:
        (typeof data.country !== "undefined" ? data.country : current.country) ?? null,
      region:
        (typeof data.region !== "undefined" ? data.region : current.region) ?? null,
      city: (typeof data.city !== "undefined" ? data.city : current.city) ?? null,
      postalCode:
        (typeof data.postalCode !== "undefined" ? data.postalCode : current.postalCode) ??
        null,
    };

    const nextDemographicsCompleted = isDemographicsComplete(merged);
    if (nextDemographicsCompleted !== current.demographicsCompleted) {
      updateData.demographicsCompleted = nextDemographicsCompleted;
    }

    const normalizedAdditionalLanguagesForCreate =
      typeof normalizedAdditionalLanguages === "undefined"
        ? current.additionalLanguages
        : normalizedAdditionalLanguages;
    const normalizedRaceEthnicityForCreate =
      typeof normalizedRaceEthnicity === "undefined"
        ? current.raceEthnicity
        : normalizedRaceEthnicity;

    if (Object.keys(updateData).length > 0 || !existing) {
      if (existing) {
        await prisma.user.update({
          where,
          data: updateData,
        });
      } else {
        const createData: Prisma.UserCreateInput = {
          ...(userId ? { id: userId } : {}),
          ...(userEmail ? { email: userEmail } : {}),
          ...(typeof data.firstName !== "undefined" ? { firstName: data.firstName } : {}),
          ...(typeof data.lastName !== "undefined" ? { lastName: data.lastName } : {}),
          ...(typeof data.preferredName !== "undefined"
            ? { preferredName: data.preferredName }
            : {}),
          ...(typeof normalizedDateOfBirth !== "undefined"
            ? { dateOfBirth: normalizedDateOfBirth }
            : {}),
          ...(typeof data.sex !== "undefined" ? { sex: data.sex } : {}),
          ...(typeof data.education !== "undefined" ? { education: data.education } : {}),
          ...(typeof data.country !== "undefined" ? { country: data.country } : {}),
          ...(typeof data.region !== "undefined" ? { region: data.region } : {}),
          ...(typeof data.city !== "undefined" ? { city: data.city } : {}),
          ...(typeof data.postalCode !== "undefined" ? { postalCode: data.postalCode } : {}),
          ...(typeof data.timeZone !== "undefined" ? { timeZone: data.timeZone } : {}),
          ...(typeof data.primaryLanguage !== "undefined"
            ? { primaryLanguage: data.primaryLanguage }
            : {}),
          ...(typeof data.englishProficiency !== "undefined"
            ? { englishProficiency: data.englishProficiency }
            : {}),
          ...(typeof data.isMultilingual !== "undefined"
            ? { isMultilingual: data.isMultilingual ?? false }
            : {}),
          ...(typeof data.handedness !== "undefined" ? { handedness: data.handedness } : {}),
          ...(typeof data.deviceType !== "undefined" ? { deviceType: data.deviceType } : {}),
          ...(typeof updateData.name !== "undefined" ? { name: updateData.name as string | null } : {}),
          additionalLanguages: normalizedAdditionalLanguagesForCreate ?? [],
          raceEthnicity: normalizedRaceEthnicityForCreate ?? [],
          demographicsCompleted: nextDemographicsCompleted,
        };

        await prisma.user.create({
          data: createData,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      demographicsCompleted:
        typeof updateData.demographicsCompleted === "boolean"
          ? updateData.demographicsCompleted
          : current.demographicsCompleted,
    });
  } catch (error) {
    console.error("Error saving demographics:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to save demographics" },
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
