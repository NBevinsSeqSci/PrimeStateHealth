// Auto-generated mock metabolomics results for Neurovantage UI demos.
// Source analyte list: Comprehensive_metabolomics_CA.pdf (global metabolite panel).

export type ResultFlag = "High" | "Low" | "Normal" | "Not reported";

export interface AnalyteResult {
  name: string;
  value: number | null;
  units: string | null;
  flag: ResultFlag;
  refLow: number | null;
  refHigh: number | null;
}

export const ALL_ANALYTES = [
  "(2/3)-amino(iso)butyric acid",
  "(3/5)-methylcytidine",
  "1,7-dimethylxanthine",
  "1-alpha,25-dihydroxyvitamin D3",
  "1-methylhistidine",
  "2-aminobutyric",
  "2-decenedioic",
  "2-deoxyadenosine",
  "2-deoxycytidine",
  "2-deoxyguanosine",
  "2-deoxyinosine",
  "2-deoxyuridine",
  "2-ethyl-3-hydroxypropionic",
  "2-hydroxy-3-methylvaleric",
  "2-hydroxyadipic",
  "2-hydroxybutyric",
  "2-hydroxyglutaric",
  "2-hydroxyisocaproic",
  "2-hydroxyisovaleric",
  "2-hydroxyphenylacetic",
  "2-hydroxysebacic",
  "2-methylacetoacetic",
  "2-methylbutyrylcarnitine",
  "2-methylbutyrylglycine",
  "2-methylcitric",
  "2-octenedioic",
  "2-oxoadipic",
  "2-oxobutyric",
  "2-oxoglutaric",
  "2-oxoisocaproic",
  "2-oxoisovaleric",
  "3-(3-MeO-4-OH)phenyllactic",
  "3-(3-OH-phenyl)-3-OH-propionic",
  "3-hydroxy-2-methylbutyric",
  "3-hydroxy-3-methylglutaric",
  "3-hydroxyadipic",
  "3-hydroxyadipic_",
  "3-hydroxybutyric",
  "3-hydroxybutyric_",
  "3-hydroxyglutaric",
  "3-hydroxyhippuric",
  "3-hydroxyisobutyric",
  "3-hydroxyisovaleric",
  "3-hydroxypropionic",
  "3-hydroxysebacic",
  "3-methyl-2-oxobutyric",
  "3-methyladipic",
  "3-methylglutaconic",
  "3-methylglutaric",
  "3-methylhistidine",
  "3-methylxanthine",
  "3-methoxy-4-hydroxyphenylglycol sulfate",
  "3-methoxytyrosine",
  "3-nitrotyrosine",
  "3-oxoadipic",
  "3-phenyllactic",
  "3-phosphoglyceric",
  "4-aminobutyric",
  "4-hydroxy-3-methoxybenzoic",
  "4-hydroxy-3-methoxyphenylacetic",
  "4-hydroxy-3-methoxyphenylglycol",
  "4-hydroxy-3-methoxyphenylglycol sulfate",
  "4-hydroxy-3-methoxyphenyllactic",
  "4-hydroxy-3-methoxyphenylpyruvic",
  "4-hydroxybenzoic",
  "4-hydroxybutyric",
  "4-hydroxycyclohexylacetic",
  "4-hydroxyhippuric",
  "4-hydroxyisovaleric",
  "4-hydroxyphenylacetic",
  "4-hydroxyphenyllactic",
  "4-hydroxyphenylpyruvic",
  "4-hydroxyproline",
  "4-pyridoxic",
  "4-pyridoxic_lactone",
  "5-aminolevulinic",
  "5-Hydroxymethyluracil",
  "5-hydroxyhexanoic",
  "5-hydroxyindoleacetic",
  "5-hydroxypipecolic",
  "5-methylcytidine",
  "5-oxoproline",
  "6-hydroxynicotinic",
  "7,8-dihydrobiopterin",
  "7-hydroxyoctanoic",
  "7-methylguanine",
  "8-hydroxy-2-deoxyguanosine",
  "8-hydroxyguanine",
  "a-ketoisovaleric",
  "acetohydroxybutyric",
  "acetohydroxyisovaleric",
  "acetoacetic",
  "acetylcarnitine",
  "acetylcarnitine_",
  "adenine",
  "adenosine",
  "adipic",
  "adrenic",
  "alanine",
  "alpha-ketoglutaric",
  "alpha-lipoic",
  "anserine",
  "anthranilic",
  "arabinose",
  "arachidic",
  "arachidonic",
  "arginine",
  "argininosuccinic",
  "asparagine",
  "aspartic",
  "beta-alanine",
  "betaine",
  "biopterin",
  "butyrylcarnitine",
  "butyrylcarnitine_",
  "caffeic",
  "carnitine",
  "carnosine",
  "catechol sulfate",
  "choline",
  "cinnamic",
  "citric",
  "citrulline",
  "cortisol",
  "creatinine",
  "cystathionine",
  "cysteine",
  "cystine",
  "decanoylcarnitine",
  "decanoylcarnitine_",
  "dehydroascorbic",
  "deoxycholic",
  "dihydroxyphenylacetic",
  "dodecanoylcarnitine",
  "dodecanoylcarnitine_",
  "dopamine sulfate",
  "dopaquinone",
  "D-ribose",
  "erythritol",
  "ethanolamine",
  "ethylmalonic",
  "ethylmalonic_",
  "fenylacetylglutamine",
  "fumaric",
  "galactose",
  "gamma-aminobutyric",
  "glucose",
  "glucuronic",
  "glutamic",
  "glutamine",
  "glutathione",
  "glycine",
  "glycolic",
  "guanosine",
  "heptanoylcarnitine",
  "heptanoylcarnitine_",
  "hexanoylcarnitine",
  "hexanoylcarnitine_",
  "hippuric",
  "histidine",
  "homocysteine",
  "homocystine",
  "hydroxyacetic",
  "hydroxybutyric",
  "hydroxyisobutyric",
  "hypoxanthine",
  "indoleacetic",
  "indolelactic",
  "inosine",
  "isobutyrylcarnitine",
  "isobutyrylglycine",
  "isocitric",
  "isoleucine",
  "isovalerylcarnitine",
  "isovalerylglycine",
  "itaconic",
  "kynurenic",
  "kynurenine",
  "lactic",
  "lauric",
  "leucine",
  "linoleic",
  "lithocholic",
  "lysine",
  "maleic",
  "malic",
  "malonic",
  "methylmalonic",
  "methylsuccinic",
  "myristic",
  "N-acetylaspartic",
  "N-acetylglutamic",
  "N-acetylneuraminic",
  "nicotinamide",
  "nicotinic",
  "octanoylcarnitine",
  "octanoylcarnitine_",
  "oleic",
  "ornithine",
  "oxalic",
  "palmitic",
  "pantothenic",
  "phenylalanine",
  "phenylpyruvic",
  "pipecolic",
  "propionylcarnitine",
  "propionylcarnitine_",
  "proline",
  "pyruvic",
  "riboflavin",
  "sarcosine",
  "S-adenosylhomocysteine",
  "S-adenosylmethionine",
  "serine",
  "shikimic",
  "sorbitol",
  "stearic",
  "suberic",
  "succinate",
  "succinic",
  "succinylacetone",
  "taurine",
  "thiamine",
  "threonic",
  "threonine",
  "tryptophan",
  "tyrosine",
  "uracil",
  "uric",
  "uridine",
  "urocanic",
  "valerylcarnitine",
  "valerylglycine",
  "valine",
  "vanillylmandelic",
  "vitamin D3 sulfate",
  "xanthine",
  "xanthosine",
  // NOTE: If you already have a canonical analyte list elsewhere in the repo,
  // replace this array with that source-of-truth.
] as const;

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
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

function defaultUnitsFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("vitamin d")) return "ng/mL";
  if (n.includes("glucose")) return "mg/dL";
  if (n.includes("creatinine")) return "mg/dL";
  return "µmol/L";
}

export function generateMockMetabolomicsResults(): AnalyteResult[] {
  // Explicit overrides (case-insensitive) so key analytes never fall into the
  // pseudo-random "Not reported" bucket.
  const OVERRIDES: Record<string, Omit<AnalyteResult, "name">> = {
    // 3-hydroxyisovaleric acid — serum control interval ~1.5–3.0 µM
    // Ueyanagi et al., Diagnostics 2021; PMID: 34943431
    "3-hydroxyisovaleric": {
      value: 7.97,
      units: "µM",
      flag: "High",
      refLow: 1.5,
      refHigh: 3.0,
    },
    // Decanoylcarnitine (C10) — plasma reference for ≥8 years: <0.88 nmol/mL (i.e., <0.88 µmol/L)
    // Source: Mayo Clinic acylcarnitines quantitative plasma reference values.
    decanoylcarnitine: {
      value: 21.9,
      units: "µM",
      flag: "High",
      refLow: 0.0,
      refHigh: 0.88,
    },
    // Indole-3-aldehyde / indole-3-carboxaldehyde (IALD)
    // Plasma (µM) ranges reported by Anesi et al., Metabolites 2019 (Table 2): 0.0103–0.186 µM
    // PubMed: https://pubmed.ncbi.nlm.nih.gov/31683910/
    "indole-3-aldehyde": {
      value: 0.08,
      units: "µM",
      flag: "Normal",
      refLow: 0.0103,
      refHigh: 0.186,
    },
    "indole-3-carboxaldehyde": {
      value: 0.08,
      units: "µM",
      flag: "Normal",
      refLow: 0.0103,
      refHigh: 0.186,
    },
    // Trimethylamine (TMA)
    // Pragmatic plasma benchmark from controls in an early-pregnancy cohort:
    // median (IQR) 114.5 (67.8–199.4) nmol/mL = µmol/L (µM)
    // PMID: 31373635
    trimethylamine: {
      value: 150.0,
      units: "µM",
      flag: "Normal",
      refLow: 67.8,
      refHigh: 199.4,
    },
    // Glycocholic (glycocholic acid; GCA)
    // Reference value used in clinical bile acid profiling: ≤2.17 nmol/mL (= µmol/L = µM)
    // Source: Mayo Clinic Bile Acid Profile (BAPS); PubMed methodology context: PMID 29202363; candidate RMP: PMID 39046504
    glycocholic: {
      value: 0.12,
      units: "µM",
      flag: "Normal",
      refLow: 0.0,
      refHigh: 2.17,
    },
    "glycocholic acid": {
      value: 0.12,
      units: "µM",
      flag: "Normal",
      refLow: 0.0,
      refHigh: 2.17,
    },
    // Xanthosine
    // HMDB0000299 lists adult blood concentration 0.0842 ± 0.0451 µM (reference: PMID 12675874).
    // Using mean ± 2SD as a pragmatic interval: ~0.00–0.17 µM (clamped at 0).
    xanthosine: {
      value: 0.09,
      units: "µM",
      flag: "Normal",
      refLow: 0.0,
      refHigh: 0.17,
    },
    // Acetoacetic (acetoacetate)
    // Normal fasting plasma is typically low; pragmatic clinical interval: 0.00–0.30 mmol/L.
    // Ketosis/DKA rises above this; keep demo value in-range.
    // Method/context references: PMID 28425001; PMID 27881484
    acetoacetic: {
      value: 0.12,
      units: "mmol/L",
      flag: "Normal",
      refLow: 0.0,
      refHigh: 0.30,
    },
    "acetoacetic acid": {
      value: 0.12,
      units: "mmol/L",
      flag: "Normal",
      refLow: 0.0,
      refHigh: 0.30,
    },
    // Hippuric (hippurate)
    // Pragmatic plasma interval (µM) used for UI demos: 5–50 µM.
    // Methodology context for quantification in human plasma/serum: PMID 31683910; PMID 33556163
    hippuric: {
      value: 22.0,
      units: "µM",
      flag: "Normal",
      refLow: 5.0,
      refHigh: 50.0,
    },
    "hippuric acid": {
      value: 22.0,
      units: "µM",
      flag: "Normal",
      refLow: 5.0,
      refHigh: 50.0,
    },
    // 5-oxoproline (pyroglutamic acid; PGA)
    // Keep UI aligned with your report screenshot: 9.57–26.2 µM (plasma/serum panel interval).
    // PubMed context: assay + reference interval work (PMID 28089749), gamma-glutamyl cycle review (PMID 24235282), plasma kinetics (PMID 11788355)
    "5-oxoproline": {
      value: 15.4,
      units: "µM",
      flag: "Normal",
      refLow: 9.57,
      refHigh: 26.2,
    },
    pyroglutamic: {
      value: 15.4,
      units: "µM",
      flag: "Normal",
      refLow: 9.57,
      refHigh: 26.2,
    },
    "pyroglutamic acid": {
      value: 15.4,
      units: "µM",
      flag: "Normal",
      refLow: 9.57,
      refHigh: 26.2,
    },
    // SAM (S-adenosylmethionine)
    // Keep UI aligned with your screenshot: 4.22–26.4 µM and value 12.0 µM.
    // PubMed context for SAM/SAH quantification in plasma: PMID 11734539; PMID 18603242; PMID 24007663
    sam: {
      value: 12.0,
      units: "µM",
      flag: "Normal",
      refLow: 4.22,
      refHigh: 26.4,
    },
    "s-adenosylmethionine": {
      value: 12.0,
      units: "µM",
      flag: "Normal",
      refLow: 4.22,
      refHigh: 26.4,
    },
    // Carnitine (free L-carnitine)
    // Keep UI aligned with your screenshot: 5.26–16.9 µM and value 9.39 µM.
    // PubMed context for plasma/serum free carnitine by LC-MS/MS and clinical utility: PMID 18281923; PMID 33071282; PMID 34954532
    carnitine: {
      value: 9.39,
      units: "µM",
      flag: "Normal",
      refLow: 5.26,
      refHigh: 16.9,
    },
    "l-carnitine": {
      value: 9.39,
      units: "µM",
      flag: "Normal",
      refLow: 5.26,
      refHigh: 16.9,
    },
    // Guanidinoacetic (guanidinoacetic acid; GAA)
    // Keep UI aligned with your screenshot: 1.04–18.4 µM and value 12.2 µM.
    // PubMed context: creatine biosynthesis and GAA as a biomarker (PMID 17517637; PMID 24682862; PMID 28425001)
    guanidinoacetic: {
      value: 12.2,
      units: "µM",
      flag: "Normal",
      refLow: 1.04,
      refHigh: 18.4,
    },
    "guanidinoacetic acid": {
      value: 12.2,
      units: "µM",
      flag: "Normal",
      refLow: 1.04,
      refHigh: 18.4,
    },
    // Lauroylcholine (dodecanoylcholine)
    // Keep UI aligned with your screenshot: 5.64–11.9 µM and value 11.6 µM (High).
    // PubMed context for acylcholines / choline esters measurement by LC-MS/MS: PMID 26864355; PMID 34258650
    lauroylcholine: {
      value: 11.6,
      units: "µM",
      flag: "High",
      refLow: 5.64,
      refHigh: 11.9,
    },
    dodecanoylcholine: {
      value: 11.6,
      units: "µM",
      flag: "High",
      refLow: 5.64,
      refHigh: 11.9,
    },
    // Succinic semialdehyde (4-oxobutanoic acid) — GABA shunt intermediate
    // Keep UI aligned with your screenshot: 5.91–17.4 µM and value 16.6 µM.
    // PubMed context (SSADH deficiency / GABA shunt biomarkers): PMID 33393837; PMID 20973619; PMID 32093054
    "succinic semialdehyde": {
      value: 16.6,
      units: "µM",
      flag: "Normal",
      refLow: 5.91,
      refHigh: 17.4,
    },
    "succinic acid semialdehyde": {
      value: 16.6,
      units: "µM",
      flag: "Normal",
      refLow: 5.91,
      refHigh: 17.4,
    },
    "4-oxobutanoic": {
      value: 16.6,
      units: "µM",
      flag: "Normal",
      refLow: 5.91,
      refHigh: 17.4,
    },
    "4-oxobutanoic acid": {
      value: 16.6,
      units: "µM",
      flag: "Normal",
      refLow: 5.91,
      refHigh: 17.4,
    },
    // Kynurenine (L-kynurenine)
    // Pragmatic plasma interval (µM) for UI demos: 1.5–3.5 µM.
    // (Kynurenine is typically low-µM in human plasma; refine later if you adopt a lab-specific RI.)
    // PubMed context for K/T ratio and kynurenine pathway activity: PMID 34670021; PMID 30372813
    kynurenine: {
      value: 3.2,
      units: "µM",
      flag: "Normal",
      refLow: 1.5,
      refHigh: 3.5,
    },
    "l-kynurenine": {
      value: 3.2,
      units: "µM",
      flag: "Normal",
      refLow: 1.5,
      refHigh: 3.5,
    },
    // Suberic (suberate; octanedioic acid)
    // Pragmatic plasma interval (µM) for UI demos: 0.05–2.00 µM.
    // (Dicarboxylic acids rise with fatty-acid oxidation defects/ketosis; refine when you adopt lab-specific RI.)
    // PubMed context: dicarboxylic acids & beta-oxidation disorders review: PMID 18281923; acylcarnitine profiling standard: PMID 33071282
    suberic: {
      value: 0.85,
      units: "µM",
      flag: "Normal",
      refLow: 0.05,
      refHigh: 2.0,
    },
    suberate: {
      value: 0.85,
      units: "µM",
      flag: "Normal",
      refLow: 0.05,
      refHigh: 2.0,
    },
    octanedioic: {
      value: 0.85,
      units: "µM",
      flag: "Normal",
      refLow: 0.05,
      refHigh: 2.0,
    },
    "octanedioic acid": {
      value: 0.85,
      units: "µM",
      flag: "Normal",
      refLow: 0.05,
      refHigh: 2.0,
    },
    // Anthranilic acid (2-aminobenzoic acid)
    // Pragmatic plasma interval (µM) for UI demos: 0.02–0.20 µM.
    // PubMed context: kynurenine pathway branch metabolites (anthranilic/quinolinic) and neuroinflammation: PMID 34670021; PMID 30372813
    anthranilic: {
      value: 0.11,
      units: "µM",
      flag: "Normal",
      refLow: 0.02,
      refHigh: 0.2,
    },
    "anthranilic acid": {
      value: 0.11,
      units: "µM",
      flag: "Normal",
      refLow: 0.02,
      refHigh: 0.2,
    },
    "2-aminobenzoic": {
      value: 0.11,
      units: "µM",
      flag: "Normal",
      refLow: 0.02,
      refHigh: 0.2,
    },
    "2-aminobenzoic acid": {
      value: 0.11,
      units: "µM",
      flag: "Normal",
      refLow: 0.02,
      refHigh: 0.2,
    },
    // Azelaic (azelaic acid; nonanedioic acid)
    // Keep UI aligned with your screenshot: 3.66–19.6 µM and value 18.0 µM (High).
    // PubMed context: dicarboxylic acids/omega-oxidation and FAO stress patterns: PMID 18281923; PMID 33071282
    azelaic: {
      value: 18.0,
      units: "µM",
      flag: "High",
      refLow: 3.66,
      refHigh: 19.6,
    },
    "azelaic acid": {
      value: 18.0,
      units: "µM",
      flag: "High",
      refLow: 3.66,
      refHigh: 19.6,
    },
    nonanedioic: {
      value: 18.0,
      units: "µM",
      flag: "High",
      refLow: 3.66,
      refHigh: 19.6,
    },
    "nonanedioic acid": {
      value: 18.0,
      units: "µM",
      flag: "High",
      refLow: 3.66,
      refHigh: 19.6,
    },
    // Homocysteine
    // Common clinical reference interval for fasting plasma total homocysteine: 4.0–10.0 µmol/L.
    // PubMed context: homocysteine and cardiovascular risk (PMID 10614701) and B-vitamin lowering trials (PMID 16531613).
    homocysteine: {
      value: 12.4,
      units: "µmol/L",
      flag: "High",
      refLow: 4.0,
      refHigh: 10.0,
    },
    // Propionylglycine (N-propionylglycine; 2-(propanoylamino)acetic acid)
    // Keep UI aligned with your screenshot: 1.25–25.1 µM and value 22.3 µM.
    // PubMed context: propionate metabolism disorders where propionylglycine increases (PMID 2342832; PMID 7313494) and biomarker review (PMID 35038174).
    propionylglycine: {
      value: 22.3,
      units: "µM",
      flag: "Normal",
      refLow: 1.25,
      refHigh: 25.1,
    },
    "n-propionylglycine": {
      value: 22.3,
      units: "µM",
      flag: "Normal",
      refLow: 1.25,
      refHigh: 25.1,
    },
    "propionyl glycine": {
      value: 22.3,
      units: "µM",
      flag: "Normal",
      refLow: 1.25,
      refHigh: 25.1,
    },
    // Benzoic acid (benzoic)
    // Literature context range (derived, mean ± 2 SD) from HMDB/Loke et al. 2009: ~7.0–18.0 µM
    // PMID: 19812218
    benzoic: {
      value: 12.5,
      units: "µM",
      flag: "Normal",
      refLow: 7.0,
      refHigh: 18.0,
    },
    "benzoic acid": {
      value: 12.5,
      units: "µM",
      flag: "Normal",
      refLow: 7.0,
      refHigh: 18.0,
    },
    // Anchor example to match your screenshot
    homocysteine: {
      value: 12.4,
      units: "µmol/L",
      flag: "High",
      refLow: 4.0,
      refHigh: 10.0,
    },
  };

  return (ALL_ANALYTES as readonly string[]).map((name) => {
    const key = name.toLowerCase();
    const override = OVERRIDES[key];
    if (override) {
      return { name, ...override };
    }

    const seed = hashStringToUint32(name);
    const rnd = mulberry32(seed);

    // ~10% "Not reported"
    if (seed % 10 === 0) {
      return {
        name,
        value: null,
        units: null,
        flag: "Not reported",
        refLow: null,
        refHigh: null,
      };
    }

    // plausible-looking ref range + value
    const units = defaultUnitsFor(name);
    const refLow = round2(0.5 + rnd() * 10); // 0.5–10.5
    const refHigh = round2(refLow + 5 + rnd() * 20); // +5–25

    const p = rnd();
    let value = round2(refLow + rnd() * (refHigh - refLow));
    let flag: ResultFlag = "Normal";

    if (p < 0.1) {
      value = round2(refHigh + (0.5 + rnd() * 3));
      flag = "High";
    } else if (p < 0.2) {
      value = round2(Math.max(0, refLow - (0.2 + rnd() * 2)));
      flag = "Low";
    }

    // Add 3 realistic mock results for analytes that were previously "Not reported"
    if (name.toLowerCase() === "2-aminobutyric") {
      return {
        name,
        value: 18.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 0.0,
        refHigh: 40.0, // ref: <=40 µmol/L
      };
    }

    if (name.toLowerCase() === "citrulline") {
      return {
        name,
        value: 28.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 10.0,
        refHigh: 45.0,
      };
    }

    if (name.toLowerCase() === "creatinine") {
      return {
        name,
        value: 1.02,
        units: "mg/dL",
        flag: "Normal",
        refLow: 0.74,
        refHigh: 1.35,
      };
    }

    // 5 additional realistic mock results (adult ref intervals; units µmol/L)
    if (name.toLowerCase() === "alanine") {
      return {
        name,
        value: 320.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 124.8,
        refHigh: 564.2,
      };
    }

    if (name.toLowerCase() === "glycine") {
      return {
        name,
        value: 240.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 132.0,
        refHigh: 467.0,
      };
    }

    if (name.toLowerCase() === "leucine") {
      return {
        name,
        value: 120.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 54.9,
        refHigh: 205.0,
      };
    }

    if (name.toLowerCase() === "valine") {
      return {
        name,
        value: 220.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 102.6,
        refHigh: 345.4,
      };
    }

    if (name.toLowerCase() === "methionine") {
      return {
        name,
        value: 22.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 12.7,
        refHigh: 41.1,
      };
    }

    // 5 additional realistic mock results (units µmol/L)
    if (name.toLowerCase() === "glutamine") {
      return {
        name,
        value: 560.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 350.0,
        refHigh: 750.0,
      };
    }

    if (name.toLowerCase() === "serine") {
      return {
        name,
        value: 118.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 70.0,
        refHigh: 190.0,
      };
    }

    if (name.toLowerCase() === "phenylalanine") {
      return {
        name,
        value: 58.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 35.0,
        refHigh: 85.0,
      };
    }

    if (name.toLowerCase() === "tryptophan") {
      return {
        name,
        value: 54.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 40.0,
        refHigh: 90.0,
      };
    }

    if (name.toLowerCase() === "tyrosine") {
      return {
        name,
        value: 66.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 35.0,
        refHigh: 110.0,
      };
    }

    // 10 additional realistic mock results (units µmol/L unless noted)
    if (name.toLowerCase() === "arginine") {
      return {
        name,
        value: 78.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 40.0,
        refHigh: 120.0,
      };
    }

    if (name.toLowerCase() === "cysteine") {
      return {
        name,
        value: 245.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 180.0,
        refHigh: 320.0,
      };
    }

    if (name.toLowerCase() === "taurine") {
      return {
        name,
        value: 58.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 30.0,
        refHigh: 120.0,
      };
    }

    if (name.toLowerCase() === "ornithine") {
      return {
        name,
        value: 62.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 30.0,
        refHigh: 110.0,
      };
    }

    if (name.toLowerCase() === "lysine") {
      return {
        name,
        value: 160.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 90.0,
        refHigh: 240.0,
      };
    }

    if (name.toLowerCase() === "aspartic") {
      return {
        name,
        value: 6.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 1.0,
        refHigh: 11.0,
      };
    }

    if (name.toLowerCase() === "asparagine") {
      return {
        name,
        value: 46.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 25.0,
        refHigh: 80.0,
      };
    }

    if (name.toLowerCase() === "histidine") {
      return {
        name,
        value: 78.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 55.0,
        refHigh: 110.0,
      };
    }

    if (name.toLowerCase() === "isoleucine") {
      return {
        name,
        value: 64.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 30.0,
        refHigh: 110.0,
      };
    }

    if (name.toLowerCase() === "threonine") {
      return {
        name,
        value: 125.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 60.0,
        refHigh: 200.0,
      };
    }

    // 9 additional realistic mock results (units µmol/L unless noted)
    if (name.toLowerCase() === "proline") {
      return {
        name,
        value: 210.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 90.0,
        refHigh: 330.0,
      };
    }

    if (name.toLowerCase() === "beta-alanine") {
      return {
        name,
        value: 3.2,
        units: "µmol/L",
        flag: "Normal",
        refLow: 0.5,
        refHigh: 8.0,
      };
    }

    if (name.toLowerCase() === "sarcosine") {
      return {
        name,
        value: 3.8,
        units: "µmol/L",
        flag: "Normal",
        refLow: 0.0,
        refHigh: 10.0,
      };
    }

    if (name.toLowerCase() === "betaine") {
      return {
        name,
        value: 42.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 20.0,
        refHigh: 70.0,
      };
    }

    if (name.toLowerCase() === "choline") {
      return {
        name,
        value: 9.8,
        units: "µmol/L",
        flag: "Normal",
        refLow: 6.0,
        refHigh: 15.0,
      };
    }

    if (name.toLowerCase() === "uric") {
      return {
        name,
        value: 320.0,
        units: "µmol/L",
        flag: "Normal",
        refLow: 200.0,
        refHigh: 420.0,
      };
    }

    if (name.toLowerCase() === "lactic") {
      return {
        name,
        value: 1.3,
        units: "mmol/L",
        flag: "Normal",
        refLow: 0.5,
        refHigh: 2.2,
      };
    }

    if (name.toLowerCase() === "pyruvic") {
      return {
        name,
        value: 0.08,
        units: "mmol/L",
        flag: "Normal",
        refLow: 0.03,
        refHigh: 0.12,
      };
    }

    if (name.toLowerCase() === "glucose") {
      return {
        name,
        value: 92.0,
        units: "mg/dL",
        flag: "Normal",
        refLow: 70.0,
        refHigh: 99.0,
      };
    }

    return { name, value, units, flag, refLow, refHigh };
  });
}

export const mockMetabolomicsResults: AnalyteResult[] =
  generateMockMetabolomicsResults();
