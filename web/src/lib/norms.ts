/**
 * Normative reference metadata for cognitive test scoring.
 * This provides transparency about how percentiles are calculated.
 */

export type NormativeReference = {
  name: string;
  version: string;
  sampleSize: number | null; // null if not yet determined
  dateRange: string | null; // e.g., "2024-2026" or null if not available
  url: string | null; // Link to more information
  description: string;
};

export const NORMATIVE_REFERENCE: NormativeReference = {
  name: "PrimeState normative dataset",
  version: "v1.0",
  sampleSize: null, // TODO: Update when sample size is established
  dateRange: null, // TODO: Update when data collection period is finalized
  url: "/how-it-works#scoring-methodology",
  description:
    "Percentiles are derived from preliminary normative data collected from PrimeState users. As our dataset grows, these norms will be refined for greater accuracy.",
};

/**
 * Age buckets used for age-matched percentile calculations.
 * Returns the bucket label (e.g., "25-34") for a given age.
 */
export function getAgeBucket(age: number): string | null {
  if (age < 18) return null; // Below minimum age
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  if (age < 75) return "65-74";
  return "75+";
}

/**
 * Calculate age in years from date of birth.
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get reference text based on whether age is available.
 */
export function getReferenceDescription(age: number | null): {
  percentileLabel: string;
  normsUsed: string;
  explanation: string;
} {
  if (age !== null && age >= 18) {
    const bucket = getAgeBucket(age);
    return {
      percentileLabel: "age-matched",
      normsUsed: `Age-matched norms (Age bucket: ${bucket})`,
      explanation: `Your score is compared to others in your age group (${bucket} years).`,
    };
  }

  return {
    percentileLabel: "general reference",
    normsUsed: "General adult reference (age not provided)",
    explanation:
      "Percentile shown is based on general adult reference data. Add your age for personalized age-matched comparisons.",
  };
}
