import type { MetaboliteResult } from "@/lib/pathways/types";
import {
  buildResultMap,
  collectEvidence,
  getResult,
  isHigh,
  isLow,
  splitEvidence,
} from "@/lib/diet/compute";
import type { DietEvidenceItem } from "@/lib/diet/format";
import { sortEvidenceBySignificance } from "@/lib/diet/format";

export type DietSignalCategory = "Deficiency" | "DietSource" | "Microbiome" | "Macronutrient";

export type MarkerStatus = "Sufficient" | "Deficient" | "Indeterminate";

export type DietSignalStatusMarker = {
  label: string;
  status: MarkerStatus;
};

export type DietSignal = {
  id: string;
  category: DietSignalCategory;
  title: string;
  strength: "Low" | "Moderate" | "High";
  takeaway: string;
  contextFlags: string[];
  topEvidence: DietEvidenceItem[];
  allEvidence?: DietEvidenceItem[];
  nextSteps: string[];
  caveats: string[];
  statusMarker?: DietSignalStatusMarker;
};

type DietSignalDraft = Omit<DietSignal, "topEvidence" | "allEvidence"> & { evidence: DietEvidenceItem[] };

export type DietSignalsResult = {
  signals: DietSignal[];
  renalCaution: boolean;
  hasFishSignal: boolean;
  hasPolyolSignal: boolean;
  hasCaffeineSignal: boolean;
};

const STANDARD_RETEST = ["Morning draw", "Consistent fasting", "Alcohol 48h", "Heavy training 24–48h"];

export const FISH_RETEST_STEP = "Fish 48–72h";
export const POLYOL_RETEST_STEP = "Polyols 24h";
export const CAFFEINE_RETEST_STEP = "Caffeine timing consistent";

type PatientContext = Partial<{
  fishLast72h?: boolean;
  fastingHours?: number;
  lastExerciseHours?: number;
  alcoholLast48h?: boolean;
  caffeineTiming?: string;
  sugarAlcohols?: boolean;
}>;

const sortSignals = (signals: DietSignal[]) => {
  const categoryOrder: DietSignalCategory[] = ["Deficiency", "Macronutrient", "DietSource", "Microbiome"];
  const strengthOrder: Record<DietSignal["strength"], number> = { High: 0, Moderate: 1, Low: 2 };
  return [...signals].sort((a, b) => {
    const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    const strengthDiff = strengthOrder[a.strength] - strengthOrder[b.strength];
    if (strengthDiff !== 0) return strengthDiff;
    return a.title.localeCompare(b.title);
  });
};

const withEvidence = (signal?: DietSignalDraft) => {
  if (!signal) return undefined;
  const { evidence, ...rest } = signal;
  const sortedEvidence = sortEvidenceBySignificance(evidence);
  const { top, all } = splitEvidence(sortedEvidence);
  return {
    ...rest,
    topEvidence: top,
    allEvidence: all,
  } satisfies DietSignal;
};

export const detectDietSignals = (
  results: MetaboliteResult[],
  patientContext?: PatientContext,
): DietSignalsResult => {
  const resultMap = buildResultMap(results);
  const renalMarkers = ["creatinine", "sdma", "pseudouridine", "ribothymidine", "5-methylcytidine"];
  const renalCaution = renalMarkers.some((marker) => isHigh(getResult(resultMap, marker)));

  const signals: DietSignal[] = [];
  let hasFishSignal = false;
  let hasPolyolSignal = false;
  let hasCaffeineSignal = false;

  const addSignal = (signal?: DietSignal) => {
    if (signal) signals.push(signal);
  };

  addSignal(withEvidence(buildB12Signal(resultMap)));
  addSignal(withEvidence(buildFolateSignal(resultMap)));
  addSignal(withEvidence(buildOmega3Signal(resultMap)));
  addSignal(withEvidence(buildCreatineSignal(resultMap)));
  const caffeineSignal = withEvidence(buildCaffeineSignal(resultMap));
  if (caffeineSignal) {
    hasCaffeineSignal = true;
    addSignal(caffeineSignal);
  }
  const fishSignal = withEvidence(buildTMAOSignal(resultMap, patientContext));
  if (fishSignal) {
    hasFishSignal = true;
    addSignal(fishSignal);
  }
  const polyolSignal = withEvidence(buildPolyolSignal(resultMap));
  if (polyolSignal) {
    hasPolyolSignal = true;
    addSignal(polyolSignal);
  }
  addSignal(withEvidence(buildButyrateSignal(resultMap)));
  addSignal(withEvidence(buildProteolyticSignal(resultMap)));
  addSignal(withEvidence(buildIndoleSignal(resultMap)));
  addSignal(withEvidence(buildPropionateSignal(resultMap)));

  return {
    signals: sortSignals(signals),
    renalCaution,
    hasFishSignal,
    hasPolyolSignal,
    hasCaffeineSignal,
  };
};

const buildB12Signal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const mma = getResult(resultMap, "methylmalonic");
  const methylcitric = getResult(resultMap, "2-methylcitric");
  const c3 = getResult(resultMap, "propionylcarnitine");
  const pgly = getResult(resultMap, "propionylglycine");
  const homoc = getResult(resultMap, "homocysteine");

  const mmaHigh = isHigh(mma);
  const methylcitricHigh = isHigh(methylcitric);
  const c3High = isHigh(c3);
  const pglyHigh = isHigh(pgly);

  if (!(mmaHigh || methylcitricHigh || c3High || pglyHigh)) return undefined;

  let strength: DietSignal["strength"] = "Low";
  if (mmaHigh && (methylcitricHigh || c3High || pglyHigh)) strength = "High";
  else if (mmaHigh || (methylcitricHigh && (c3High || pglyHigh))) strength = "Moderate";

  const evidence = collectEvidence([
    { id: "mma", label: "Methylmalonic acid (MMA)", result: mma },
    { id: "2mca", label: "2-methylcitric", result: methylcitric },
    { id: "c3", label: "Propionylcarnitine (C3)", result: c3 },
    { id: "pgly", label: "Propionylglycine", result: pgly },
    { id: "homoc", label: "Homocysteine", result: homoc },
  ]);

  const status: MarkerStatus = mma && mma.zScore != null && mma.zScore >= 1.5 && (methylcitricHigh || c3High || pglyHigh)
    ? "Deficient"
    : "Indeterminate";

  return {
    id: "DEF_B12_FUNCTIONAL",
    category: "Deficiency",
    title: "Possible functional B12 insufficiency",
    strength,
    takeaway:
      "Pattern can be consistent with reduced B12 availability and/or increased propionate handling demand.",
    contextFlags: ["Standardize fasting/training"],
    evidence,
    nextSteps: [
      "Prioritize B12-rich foods (meat, fish, eggs, dairy) if appropriate.",
      "Consider clinician-guided confirmatory testing if symptoms or risk factors exist.",
      "Re-test after a stable training/diet week if draw captured illness or heavy training.",
    ],
    caveats: ["Confirm with serum B12, MMA, homocysteine; consider absorption, PPI/metformin, and renal context."],
    statusMarker: {
      label: "B12 status",
      status,
    },
  };
};

const buildFolateSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const folate = getResult(resultMap, "folate");
  const thf = getResult(resultMap, "thf");
  const serine = getResult(resultMap, "serine");
  const glycine = getResult(resultMap, "glycine");
  const homoc = getResult(resultMap, "homocysteine");

  const folateLow = isLow(folate) || isLow(thf);
  const serineLow = isLow(serine);
  const glycineLow = isLow(glycine);
  const homocHigh = isHigh(homoc);

  if (!(folateLow || serineLow || glycineLow || homocHigh)) return undefined;

  let strength: DietSignal["strength"] = "Low";
  if (folateLow && homocHigh) strength = "High";
  else if (folateLow || homocHigh) strength = "Moderate";

  const evidence = collectEvidence([
    { id: "folate", label: "Folate", result: folate },
    { id: "thf", label: "THF", result: thf },
    { id: "serine", label: "Serine", result: serine },
    { id: "glycine", label: "Glycine", result: glycine },
    { id: "homoc", label: "Homocysteine", result: homoc },
  ]);

  const hasDirectMeasure = Boolean(folate || thf);
  let status: MarkerStatus = "Indeterminate";
  if (folateLow) status = "Deficient";
  else if (hasDirectMeasure && !homocHigh) status = "Sufficient";

  return {
    id: "DEF_FOLATE",
    category: "Deficiency",
    title: "Possible low folate / one-carbon supply",
    strength,
    takeaway: "Lower folate/serine/glycine input can stress methionine cycle flow—confirm before supplementing.",
    contextFlags: ["Interpret alongside methylation labs"],
    evidence,
    nextSteps: [
      "Increase leafy greens, legumes, citrus, and quality protein for serine/glycine.",
      "Ensure balanced methyl donor intake; avoid high-dose supplements without clinician guidance.",
    ],
    caveats: ["Use RBC folate + serum folate/B12 to differentiate intake vs. utilization."],
    statusMarker: {
      label: "Folate status",
      status,
    },
  };
};

const buildOmega3Signal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const omegaIndex = getResult(resultMap, "omega-3 index") ?? getResult(resultMap, "omega 3 index");
  if (!omegaIndex) return undefined;
  const low = isLow(omegaIndex);
  const strength: DietSignal["strength"] = low ? (isLow(omegaIndex, -1.5) ? "High" : "Moderate") : "Low";
  const status: MarkerStatus = low ? "Deficient" : "Sufficient";
  const evidence = collectEvidence([{ id: "omega3", label: "Omega-3 index", result: omegaIndex }]);

  if (!low && status === "Sufficient" && strength === "Low") {
    // Provide reassurance only when requested by context; otherwise skip to reduce noise
    return undefined;
  }

  return {
    id: "INTAKE_OMEGA3",
    category: "DietSource",
    title: "Omega-3 intake signal",
    strength,
    takeaway: "Omega-3 index below goal commonly reflects low fatty fish or supplement exposure.",
    contextFlags: ["Kidney/hydration context"],
    evidence,
    nextSteps: [
      "Increase fatty fish 2x/week or consider clinician-guided EPA/DHA supplement.",
      "Re-test after 8–12 weeks if attempting to raise index.",
    ],
    caveats: ["If on anticoagulants or bleeding risk, discuss supplement use with a clinician."],
    statusMarker: {
      label: "Omega-3 status",
      status,
    },
  };
};

const buildCreatineSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const gaa = getResult(resultMap, "guanidinoacetic");
  const creatine = getResult(resultMap, "creatine");
  const creatinine = getResult(resultMap, "creatinine");
  const highGAA = isHigh(gaa, 1);
  const lowCreatine = isLow(creatine, -0.5);

  if (!highGAA && !lowCreatine) return undefined;

  const evidence = collectEvidence([
    { id: "gaa", label: "Guanidinoacetic acid", result: gaa },
    { id: "creatine", label: "Creatine", result: creatine },
    { id: "creatinine", label: "Creatinine", result: creatinine },
  ]);

  const status: MarkerStatus = highGAA && lowCreatine ? "Deficient" : "Indeterminate";
  const strength: DietSignal["strength"] = highGAA && lowCreatine ? "Moderate" : "Low";

  return {
    id: "DEF_CREATINE",
    category: "Macronutrient",
    title: "Creatine intake / methyl demand signal",
    strength,
    takeaway: "Creatine precursor buildup with lower creatine can reflect low intake or higher methyl demand.",
    contextFlags: ["Kidney/hydration context"],
    evidence,
    nextSteps: [
      "If low animal-protein intake, consider more creatine-rich foods (meat/fish) if appropriate.",
      "Discuss clinician-guided creatine trial if symptoms align; monitor renal labs.",
    ],
    caveats: ["Creatine/creatinine reflect kidney function and muscle mass—interpret together."],
    statusMarker: {
      label: "Creatine status",
      status,
    },
  };
};

const buildCaffeineSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const markers = ["paraxanthine", "theobromine", "theophylline", "1,7-dimethylxanthine"];
  const elevated = markers
    .map((marker, idx) => ({ marker, idx, result: getResult(resultMap, marker) }))
    .filter(({ result }) => isHigh(result, 0.8));

  if (elevated.length === 0) return undefined;

  const evidence = collectEvidence(
    elevated.map(({ marker, idx, result }) => ({ id: `caffeine-${idx}`, label: marker, result })),
  );

  return {
    id: "SOURCE_CAFFEINE",
    category: "DietSource",
    title: "Caffeine exposure signal",
    strength: elevated.length >= 2 ? "Moderate" : "Low",
    takeaway: "Elevated methylxanthines suggest caffeine intake close to the draw.",
    contextFlags: ["Match caffeine timing for follow-up"],
    evidence,
    nextSteps: [
      "If insomnia or anxiety present, shift caffeine earlier or reduce dose gradually.",
      "Keep dose/timing consistent when comparing re-tests.",
    ],
    caveats: ["Represents exposure timing, not toxicity."],
  };
};

const buildTMAOSignal = (
  resultMap: Map<string, MetaboliteResult>,
  patientContext?: PatientContext,
): DietSignalDraft | undefined => {
  const tmao = getResult(resultMap, "trimethylamine-n-oxide") ?? getResult(resultMap, "tmao");
  if (!isHigh(tmao)) return undefined;
  const evidence = collectEvidence([{ id: "tmao", label: "TMAO", result: tmao }]);
  return {
    id: "SOURCE_TMAO_FISH",
    category: "DietSource",
    title: "Likely recent fish/seafood intake signal",
    strength: isHigh(tmao, 2) ? "High" : "Moderate",
    takeaway: "TMAO commonly rises with fish intake and renal retention.",
    contextFlags: ["Kidney/hydration context"],
    evidence,
    nextSteps: [
      "No change needed if fish intake intentional.",
      "For baseline testing, avoid fish/seafood 48–72h before draw.",
    ],
    caveats: ["Interpret alongside kidney markers (SDMA/creatinine) and hydration."],
  };
};

const buildPolyolSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const polyolKeys = ["sorbitol", "mannitol", "xylitol", "arabitol", "ribitol", "galactitol"];
  const elevated = polyolKeys
    .map((key, idx) => ({ key, idx, result: getResult(resultMap, key) }))
    .filter(({ result }) => isHigh(result, 1));

  if (elevated.length === 0) return undefined;

  const evidence = collectEvidence(
    elevated.map(({ key, idx, result }) => ({ id: `polyol-${idx}`, label: key, result })),
  );

  return {
    id: "SOURCE_POLYOLS",
    category: "DietSource",
    title: "Sugar alcohol intake signal",
    strength: elevated.length >= 2 ? "Moderate" : "Low",
    takeaway: "Multiple polyol elevations often reflect sugar alcohol intake or poor clearance.",
    contextFlags: ["Kidney/hydration context"],
    evidence,
    nextSteps: [
      "Check labels (gums, protein bars, supplements) for sorbitol/mannitol/xylitol.",
      "Trial reducing sugar alcohols for 2–3 weeks if GI symptoms present.",
    ],
    caveats: ["Elevations often reflect diet more than dysbiosis; hyperglycemia can also contribute."],
  };
};

const buildButyrateSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const butyrate = getResult(resultMap, "butyrate");
  if (!butyrate || !isLow(butyrate)) return undefined;
  const evidence = collectEvidence([{ id: "butyrate", label: "Butyrate", result: butyrate }]);
  return {
    id: "MICROBIOME_SCFA_LOW",
    category: "Microbiome",
    title: "Low butyrate (SCFA) signal",
    strength: "Moderate",
    takeaway: "Reduced butyrate can align with lower fermentable fiber intake or slow recovery post-illness.",
    contextFlags: ["Interpret with stool pattern"],
    evidence,
    nextSteps: [
      "Increase soluble fiber sources (oats, legumes, psyllium/PHGG if tolerated).",
      "Prioritize bowel regularity and plant diversity.",
    ],
    caveats: ["Diarrhea/constipation or antibiotics can transiently lower levels."],
    statusMarker: {
      label: "Butyrate support",
      status: "Deficient",
    },
  };
};

const buildProteolyticSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const aromaticKeys = [
    "phenylacetic",
    "phenyllactic",
    "phenylpyruvic",
    "4-hydroxyphenylacetic",
    "4-hydroxyphenyllactic",
    "4-hydroxyphenylpyruvic",
  ];
  const aromaticElev = aromaticKeys
    .map((key, idx) => ({ key, idx, result: getResult(resultMap, key) }))
    .filter(({ result }) => isHigh(result, 1));
  const polyamines = ["putrescine", "cadaverine"]
    .map((key, idx) => ({ key, idx, result: getResult(resultMap, key) }))
    .filter(({ result }) => isHigh(result, 1));
  if (aromaticElev.length < 1 && polyamines.length < 1) return undefined;

  const evidence = collectEvidence([
    ...aromaticElev.map(({ key, idx, result }) => ({ id: `aromatic-${idx}`, label: key, result })),
    ...polyamines.map(({ key, idx, result }) => ({ id: `polyamine-${idx}`, label: key, result })),
  ]);

  return {
    id: "MICROBIOME_PROTEOLYSIS",
    category: "Microbiome",
    title: "Proteolytic fermentation / slow transit pattern",
    strength: aromaticElev.length >= 2 ? "Moderate" : "Low",
    takeaway: "Pattern can align with slow transit and higher protein fermentation in the colon.",
    contextFlags: ["Constipation/slow transit"],
    evidence,
    nextSteps: [
      "Prioritize bowel regularity; consider soluble fiber or magnesium as appropriate.",
      "Distribute protein across meals; minimize very large late dinners.",
    ],
    caveats: ["Also influenced by dysbiosis or high-protein supplements; correlate with GI history."],
  };
};

const buildIndoleSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const indoleKeys = ["indole-3-propionic", "indole-3-acetic", "indolelactic", "indole-3-butyric", "indole-3-aldehyde"];
  const abnormal = indoleKeys
    .map((key, idx) => ({ key, idx, result: getResult(resultMap, key) }))
    .filter(({ result }) => Math.abs(result?.zScore ?? 0) >= 1);
  if (abnormal.length === 0) return undefined;
  const evidence = collectEvidence(
    abnormal.map(({ key, idx, result }) => ({ id: `indole-${idx}`, label: key, result })),
  );
  return {
    id: "MICROBIOME_INDOLES",
    category: "Microbiome",
    title: "Indole signaling pattern",
    strength: abnormal.length >= 2 ? "Moderate" : "Low",
    takeaway: "Altered indoles can reflect microbiome-derived tryptophan handling and AhR tone.",
    contextFlags: ["Interpret with gut symptoms"],
    evidence,
    nextSteps: [
      "Support plant diversity and tolerated soluble fiber.",
      "Avoid very large late-night protein boluses.",
    ],
    caveats: ["Transit changes, antibiotics, or protein load can shift indoles."],
  };
};

const buildPropionateSignal = (resultMap: Map<string, MetaboliteResult>): DietSignalDraft | undefined => {
  const hydroxyProp = getResult(resultMap, "3-hydroxypropionic");
  const oxoButyric = getResult(resultMap, "2-oxobutyric");
  const pgly = getResult(resultMap, "propionylglycine");
  const c3 = getResult(resultMap, "propionylcarnitine");
  const markers = [hydroxyProp, oxoButyric, pgly, c3].filter((result) => isHigh(result, 1));
  if (markers.length < 2) return undefined;
  const evidence = collectEvidence(
    markers.map((result, idx) => ({ id: `prop-${idx}`, label: result?.name ?? "Propionate metabolite", result })),
  );
  return {
    id: "MICROBIOME_PROPIONATE",
    category: "Microbiome",
    title: "Propionate fermentation load",
    strength: markers.length >= 3 ? "Moderate" : "Low",
    takeaway: "Elevated propionate-linked analytes without MMA elevation may reflect microbiome fermentation.",
    contextFlags: ["Fasting/training context"],
    evidence,
    nextSteps: [
      "Pause high-dose inulin/FOS/GOS/resistant starch supplements for 2–3 weeks if tolerated.",
      "Reduce large FODMAP boluses temporarily and support bowel transit.",
    ],
    caveats: ["Overlap with fasting/training stress—overlay with context tracking."],
  };
};

export const dietRetestChecklist = STANDARD_RETEST;
