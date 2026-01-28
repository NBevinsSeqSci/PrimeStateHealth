"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Country list (subset for brevity - expand as needed)
const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "New Zealand",
  "Japan",
  "South Korea",
  "Singapore",
  "India",
  "Brazil",
  "Mexico",
  "Argentina",
  "Other",
];

// US States
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

// Canadian Provinces
const CA_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

// Australian States
const AU_STATES = [
  "New South Wales", "Victoria", "Queensland", "Western Australia",
  "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Japanese",
  "Korean",
  "Hindi",
  "Arabic",
  "Russian",
  "Dutch",
  "Polish",
  "Vietnamese",
  "Tagalog",
  "Other",
];

const RACE_ETHNICITY_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Middle Eastern or North African",
  "Native Hawaiian or Pacific Islander",
  "White",
  "Prefer not to say",
  "Other",
];

// Common time zones
const TIME_ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Kolkata",
];

type FormData = {
  // Identity
  firstName: string;
  lastName: string;
  preferredName: string;
  // Demographics
  dateOfBirth: string;
  sex: string;
  education: string;
  // Location
  country: string;
  region: string;
  city: string;
  postalCode: string;
  timeZone: string;
  // Background
  primaryLanguage: string;
  englishProficiency: string;
  isMultilingual: boolean;
  additionalLanguages: string[];
  handedness: string;
  raceEthnicity: string[];
  deviceType: string;
};

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua) && !/tablet/i.test(ua)) return "phone";
  return "desktop";
}

function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export default function DemographicsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    sex: "",
    education: "",
    country: "United States",
    region: "",
    city: "",
    postalCode: "",
    timeZone: "",
    primaryLanguage: "English",
    englishProficiency: "",
    isMultilingual: false,
    additionalLanguages: [],
    handedness: "",
    raceEthnicity: [],
    deviceType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Auto-detect device and timezone on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      deviceType: getDeviceType(),
      timeZone: prev.timeZone || getBrowserTimeZone(),
    }));
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/signup");
    return null;
  }

  const requiresRegion = ["United States", "Canada", "Australia"].includes(formData.country);

  const getRegionOptions = () => {
    if (formData.country === "United States") return US_STATES;
    if (formData.country === "Canada") return CA_PROVINCES;
    if (formData.country === "Australia") return AU_STATES;
    return [];
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.sex) errors.sex = "Sex is required";
    if (!formData.education) errors.education = "Education level is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (requiresRegion && !formData.region) errors.region = "State/Province is required";

    // US ZIP code validation
    if (formData.country === "United States" && formData.postalCode) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(formData.postalCode)) {
        errors.postalCode = "Invalid US ZIP code format";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/demographics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save demographics");
      }

      router.push("/try");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      // Reset region when country changes
      ...(name === "country" ? { region: "" } : {}),
    }));

    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleMultiSelect = (name: "raceEthnicity" | "additionalLanguages", value: string) => {
    setFormData((prev) => {
      const current = prev[name];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v) => v !== value) };
      }
      return { ...prev, [name]: [...current, value] };
    });
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.dateOfBirth &&
    formData.sex &&
    formData.education &&
    formData.country &&
    formData.city.trim() &&
    (!requiresRegion || formData.region);

  const inputClassName = (fieldName: string) =>
    `mt-2 w-full rounded-xl border ${
      validationErrors[fieldName] ? "border-red-300" : "border-slate-200"
    } bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
            Step 1 of 1
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tell us about yourself
          </h1>
          <p className="text-base text-slate-600">
            This information helps us compare you to similar peers and interpret test results.
            <span className="block mt-1 text-sm text-slate-500">
              Optional items can be skipped.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Section A: Identity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Identity</h2>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClassName("firstName")}
                    placeholder="John"
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClassName("lastName")}
                    placeholder="Doe"
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="preferredName" className="block text-sm font-semibold text-slate-900">
                  Preferred name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  What should we call you?
                </p>
                <input
                  type="text"
                  id="preferredName"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                  className={inputClassName("preferredName")}
                  placeholder="Johnny"
                />
              </div>
            </div>
          </div>

          {/* Section B: Location */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Location</h2>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-slate-900">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClassName("country")}
                  >
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {validationErrors.country && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.country}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-semibold text-slate-900">
                    State/Province {requiresRegion && <span className="text-red-500">*</span>}
                    {!requiresRegion && <span className="text-slate-400 font-normal">(optional)</span>}
                  </label>
                  {requiresRegion ? (
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={inputClassName("region")}
                    >
                      <option value="">Select...</option>
                      {getRegionOptions().map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={inputClassName("region")}
                      placeholder="Region or province"
                    />
                  )}
                  {validationErrors.region && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.region}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-900">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClassName("city")}
                    placeholder="New York"
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-semibold text-slate-900">
                    Postal code <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={inputClassName("postalCode")}
                    placeholder={formData.country === "United States" ? "12345" : "Postal code"}
                  />
                  {validationErrors.postalCode && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.postalCode}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="timeZone" className="block text-sm font-semibold text-slate-900">
                  Time zone <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <select
                  id="timeZone"
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                  className={inputClassName("timeZone")}
                >
                  <option value="">Select time zone...</option>
                  {TIME_ZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section C: Demographics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Demographics</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-900">
                  Date of birth <span className="text-red-500">*</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Used for age-matched comparisons
                </p>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={inputClassName("dateOfBirth")}
                />
                {validationErrors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sex" className="block text-sm font-semibold text-slate-900">
                    Sex assigned at birth <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={inputClassName("sex")}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other/Prefer not to say</option>
                  </select>
                  {validationErrors.sex && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.sex}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="education" className="block text-sm font-semibold text-slate-900">
                    Education level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={inputClassName("education")}
                  >
                    <option value="">Select...</option>
                    <option value="high-school">High school or equivalent</option>
                    <option value="some-college">Some college</option>
                    <option value="bachelors">Bachelor&rsquo;s degree</option>
                    <option value="masters">Master&rsquo;s degree</option>
                    <option value="doctorate">Doctoral degree</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.education && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.education}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Background */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Background</h2>
            <p className="text-xs text-slate-500 mb-6">
              These optional fields help us better interpret your cognitive test results.
            </p>
            <div className="space-y-5">
              {/* Language */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="primaryLanguage" className="block text-sm font-semibold text-slate-900">
                    Primary language <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    id="primaryLanguage"
                    name="primaryLanguage"
                    value={formData.primaryLanguage}
                    onChange={handleChange}
                    className={inputClassName("primaryLanguage")}
                  >
                    <option value="">Select...</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="englishProficiency" className="block text-sm font-semibold text-slate-900">
                    English proficiency <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    id="englishProficiency"
                    name="englishProficiency"
                    value={formData.englishProficiency}
                    onChange={handleChange}
                    className={inputClassName("englishProficiency")}
                  >
                    <option value="">Select...</option>
                    <option value="native">Native</option>
                    <option value="fluent">Fluent</option>
                    <option value="conversational">Conversational</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
              </div>

              {/* Multilingual */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isMultilingual"
                    name="isMultilingual"
                    checked={formData.isMultilingual}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  />
                  <label htmlFor="isMultilingual" className="text-sm font-medium text-slate-900">
                    I speak additional languages
                  </label>
                </div>
                {formData.isMultilingual && (
                  <div className="pl-7">
                    <p className="text-xs text-slate-500 mb-2">Select all that apply:</p>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.filter((l) => l !== formData.primaryLanguage).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleMultiSelect("additionalLanguages", lang)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                            formData.additionalLanguages.includes(lang)
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Handedness */}
              <div>
                <label htmlFor="handedness" className="block text-sm font-semibold text-slate-900">
                  Handedness <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Relevant for some motor/reaction time norms
                </p>
                <select
                  id="handedness"
                  name="handedness"
                  value={formData.handedness}
                  onChange={handleChange}
                  className={inputClassName("handedness")}
                >
                  <option value="">Select...</option>
                  <option value="right">Right-handed</option>
                  <option value="left">Left-handed</option>
                  <option value="ambidextrous">Ambidextrous</option>
                </select>
              </div>

              {/* Race/Ethnicity */}
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Race/Ethnicity <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <p className="mt-1 text-xs text-slate-500 mb-3">
                  Select all that apply
                </p>
                <div className="flex flex-wrap gap-2">
                  {RACE_ETHNICITY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleMultiSelect("raceEthnicity", option)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                        formData.raceEthnicity.includes(option)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Type (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Device type <span className="text-slate-400 font-normal">(auto-detected)</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Helps interpret reaction time variations
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {formData.deviceType === "phone" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    ) : formData.deviceType === "tablet" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    )}
                  </svg>
                  <span className="capitalize">{formData.deviceType || "Detecting..."}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-semibold">Your information is private</p>
                <p className="mt-1 text-blue-800">
                  We use this data only to provide you with personalized insights and will never share it without your explicit consent.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Continue to tests"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
