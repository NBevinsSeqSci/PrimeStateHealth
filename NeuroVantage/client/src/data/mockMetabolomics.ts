import { ANALYTE_REGISTRY } from "@/lib/analytes/analyteRegistry";
import type { MetaboliteResult } from "@/lib/pathways/types";

type OverrideResult = MetaboliteResult & { name: string };

const EXTRA_ANALYTES = [
  "Omega-3 index",
  "Tryptophan",
  "Glutathione (reduced)",
  "Glutathione (oxidized)",
  "Butyrate",
];

const OVERRIDES: OverrideResult[] = [
  {
    name: "Kynurenine",
    value: 4.8,
    unit: "uM",
    refRange: { low: 1.5, high: 3.8 },
    zScore: 2.1,
  },
  {
    name: "Tryptophan",
    value: 62,
    unit: "uM",
    refRange: { low: 53, high: 85 },
    zScore: -0.2,
  },
  {
    name: "Arginine",
    value: 68,
    unit: "uM",
    refRange: { low: 45, high: 95 },
    zScore: 0.3,
  },
  {
    name: "Tyrosine",
    value: 58,
    unit: "uM",
    refRange: { low: 40, high: 85 },
    zScore: 0.2,
  },
  {
    name: "Homocysteine",
    value: 12.4,
    unit: "umol/L",
    refRange: { low: 4, high: 10 },
    zScore: 1.6,
  },
  {
    name: "Glutathione (reduced)",
    value: 4.1,
    unit: "uM",
    refRange: { low: 5, high: 9 },
    zScore: -1.8,
  },
  {
    name: "Glutathione (oxidized)",
    value: 0.9,
    unit: "uM",
    refRange: { low: 0.1, high: 0.4 },
    zScore: 1.9,
  },
  {
    name: "Butyrate",
    value: 45,
    unit: "uM",
    refRange: { low: 60, high: 110 },
    zScore: -1.3,
  },
  {
    name: "Propionylcarnitine",
    value: 0.24,
    unit: "uM",
    refRange: { low: 0.3, high: 0.6 },
    zScore: -1.1,
  },
  {
    name: "Omega-3 index",
    value: 5.1,
    unit: "%",
    refRange: { low: 8 },
    zScore: -1.6,
  },
  {
    name: "1,7-dimethylxanthine",
    value: 1.3,
    unit: "uM",
    refRange: { low: 0.2, high: 0.8 },
    zScore: 1.9,
  },
  {
    name: "3-hydroxyisovaleric",
    value: 7.97,
    unit: "uM",
    refRange: { low: 1.5, high: 3.0 },
    zScore: 2.1,
  },
  {
    name: "cysteinylglycine",
    value: 12.0,
    unit: "uM",
    refRange: { low: 5.0, high: 25.0 },
    zScore: 0.2,
  },
  {
    name: "glycine",
    value: 240.0,
    unit: "uM",
    refRange: { low: 132.0, high: 467.0 },
    zScore: -0.1,
  },
  {
    name: "glycodeoxycholic",
    value: 0.12,
    unit: "uM",
    refRange: { low: 0.02, high: 0.35 },
    zScore: 0.0,
  },
  {
    name: "hexanoylcarnitine",
    value: 0.08,
    unit: "uM",
    refRange: { low: 0.01, high: 0.25 },
    zScore: 0.1,
  },
  {
    name: "melatonin",
    value: 18.0,
    unit: "pg/mL",
    refRange: { low: 5.0, high: 60.0 },
    zScore: 0.3,
  },
  {
    name: "quinolinic",
    value: 0.45,
    unit: "uM",
    refRange: { low: 0.1, high: 1.2 },
    zScore: 0.2,
  },
  {
    name: "ribitol",
    value: 8.0,
    unit: "uM",
    refRange: { low: 0.0, high: 30.0 },
    zScore: -0.2,
  },
  {
    name: "theophylline",
    value: 0.3,
    unit: "mg/L",
    refRange: { low: 0.0, high: 5.0 },
    zScore: 0.1,
  },
  {
    name: "trimethylamine-N-oxide",
    value: 3.2,
    unit: "uM",
    refRange: { low: 0.5, high: 6.0 },
    zScore: 0.2,
  },
  {
    // Trimethylamine (TMA) plasma benchmark from controls in early-pregnancy cohort:
    // median (IQR) 114.5 (67.8-199.4) nmol/mL = uM. PMID: 31373635
    name: "trimethylamine",
    value: 150.0,
    unit: "uM",
    refRange: { low: 67.8, high: 199.4 },
    zScore: 0.0,
  },
  {
    name: "undecanedioic",
    value: 0.12,
    unit: "uM",
    refRange: { low: 0.03, high: 0.4 },
    zScore: 0.0,
  },
];

const overrideByNormalized = new Map(
  OVERRIDES.map((entry) => [entry.name.toLowerCase(), entry]),
);

const buildAnalyteNames = () => {
  const registry = ANALYTE_REGISTRY.map((def) => def.display);
  return Array.from(new Set([...registry, ...EXTRA_ANALYTES]));
};

function hashStringToUint32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

function defaultUnitFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("vitamin d")) return "ng/mL";
  if (n.includes("glucose") || n.includes("creatinine")) return "mg/dL";
  if (n.includes("index")) return "%";
  return "uM";
}

function generateMockResult(name: string): MetaboliteResult {
  const override = overrideByNormalized.get(name.toLowerCase());
  if (override) {
    return { ...override, name: override.name };
  }

  const seed = hashStringToUint32(name);
  const rnd = mulberry32(seed);

  if (seed % 10 === 0) {
    return { name };
  }

  const unit = defaultUnitFor(name);
  const refLow = round2(0.5 + rnd() * 10);
  const refHigh = round2(refLow + 5 + rnd() * 20);
  const mean = (refLow + refHigh) / 2;
  const sd = (refHigh - refLow) / 4 || 1;

  const p = rnd();
  let zScore = round2((rnd() - 0.5) * 1.2);
  if (p < 0.1) zScore = round2(1 + rnd() * 1.8);
  else if (p < 0.2) zScore = round2(-(1 + rnd() * 1.8));

  const value = round2(mean + zScore * sd);

  return {
    name,
    value,
    unit,
    zScore,
    refRange: { low: refLow, high: refHigh },
  };
}

export const mockMetabolomicsResults: MetaboliteResult[] = buildAnalyteNames().map(
  (name) => generateMockResult(name),
);
