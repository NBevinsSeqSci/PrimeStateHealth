import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const nonEmpty = (max: number) => z.string().min(1).max(max);

export const DemographicsSchema = z
  .object({
    name: nonEmpty(120).optional().nullable(),
    firstName: nonEmpty(64).optional().nullable(),
    lastName: nonEmpty(64).optional().nullable(),
    preferredName: nonEmpty(64).optional().nullable(),
    dateOfBirth: z
      .string()
      .datetime()
      .or(z.string().regex(dateOnlyRegex))
      .optional()
      .nullable(),
    sex: nonEmpty(32).optional().nullable(),
    education: nonEmpty(64).optional().nullable(),
    country: nonEmpty(64).optional().nullable(),
    region: nonEmpty(64).optional().nullable(),
    city: nonEmpty(64).optional().nullable(),
    postalCode: nonEmpty(20).optional().nullable(),
    timeZone: nonEmpty(64).optional().nullable(),
    primaryLanguage: nonEmpty(64).optional().nullable(),
    englishProficiency: z
      .enum(["native", "fluent", "conversational", "limited"])
      .optional()
      .nullable(),
    isMultilingual: z.boolean().optional().nullable(),
    additionalLanguages: z.array(nonEmpty(64)).optional().nullable(),
    handedness: z.enum(["right", "left", "ambidextrous"]).optional().nullable(),
    raceEthnicity: z.array(nonEmpty(64)).optional().nullable(),
    deviceType: nonEmpty(64).optional().nullable(),
  })
  .passthrough();

const toCleanString = (value: unknown) => {
  if (value === undefined || value === "") return undefined;
  if (value === null) return null;
  return String(value);
};

const toBoolean = (value: unknown) => {
  if (value === undefined || value === "") return undefined;
  if (value === null) return null;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return undefined;
};

const toStringArray = (value: unknown) => {
  if (value === undefined || value === "") return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : undefined;
  }
  return undefined;
};

export function normalizeDemographics(input: unknown) {
  const raw = (input ?? {}) as Record<string, unknown>;

  const dateOfBirth =
    raw.dateOfBirth ??
    raw.dob ??
    raw.birthDate ??
    raw.birth_date ??
    raw.date_of_birth;
  const sex = raw.sex ?? raw.sexAtBirth ?? raw.sex_at_birth ?? raw.sex_birth;
  const region =
    raw.region ?? raw.state ?? raw.province ?? raw.stateProvince ?? raw.state_province;
  const name = raw.name ?? raw.fullName ?? raw.full_name;

  return {
    name: toCleanString(name),
    firstName: toCleanString(raw.firstName ?? raw.first_name),
    lastName: toCleanString(raw.lastName ?? raw.last_name),
    preferredName: toCleanString(raw.preferredName ?? raw.preferred_name),
    dateOfBirth: toCleanString(dateOfBirth),
    sex: toCleanString(sex),
    education: toCleanString(raw.education),
    country: toCleanString(raw.country),
    region: toCleanString(region),
    city: toCleanString(raw.city),
    postalCode: toCleanString(raw.postalCode ?? raw.postal_code ?? raw.zip ?? raw.zipCode),
    timeZone: toCleanString(raw.timeZone ?? raw.time_zone),
    primaryLanguage: toCleanString(raw.primaryLanguage ?? raw.primary_language),
    englishProficiency: toCleanString(raw.englishProficiency ?? raw.english_proficiency),
    isMultilingual: toBoolean(raw.isMultilingual ?? raw.is_multilingual),
    additionalLanguages: toStringArray(raw.additionalLanguages ?? raw.additional_languages),
    handedness: toCleanString(raw.handedness),
    raceEthnicity: toStringArray(raw.raceEthnicity ?? raw.race_ethnicity ?? raw.race),
    deviceType: toCleanString(raw.deviceType ?? raw.device_type),
  };
}

export function zodIssues(err: z.ZodError) {
  return err.issues.map((issue) => ({
    path: issue.path.join(".") || "body",
    message: issue.message,
  }));
}
