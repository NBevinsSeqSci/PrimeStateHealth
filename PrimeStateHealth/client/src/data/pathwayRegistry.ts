import type {
  PathwayCalculationSpec,
  PathwayDefinition,
  PathwayFramework,
  PathwayMetaboliteLineDefinition,
} from "@/types/pathways";

export const FRAMEWORK_SEQUENCE: PathwayFramework[] = ["A", "B", "C", "D", "E", "F", "G"];

export const FRAMEWORK_TITLES: Record<PathwayFramework, string> = {
  A: "Core Engines",
  B: "Redox & Detox",
  C: "Inflammation & Immune Signaling",
  D: "One-Carbon & Sulfur",
  E: "Amino Acids & Protein Turnover",
  F: "Gut & Microbiome",
  G: "Neurotransmitters & CNS-adjacent",
};

type BasePathwayDefinition = Omit<PathwayDefinition, "display" | "calculations"> & {
  flowLabel?: string;
  display?: PathwayDefinition["display"];
  calculations?: PathwayDefinition["calculations"];
};

const defaultMetaboliteLines = (requiredAnalytes: string[]): PathwayMetaboliteLineDefinition[] =>
  requiredAnalytes.map((analyteId) => ({
    analyteId,
    displayMetric: "zScore",
  }));

const defaultCalculations = (requiredAnalytes: string[]): PathwayCalculationSpec => ({
  pathwayScoreMethod: "weightedZ",
  metaboliteLines: defaultMetaboliteLines(requiredAnalytes),
  implemented: true,
});

const withDefaults = (base: BasePathwayDefinition): PathwayDefinition => {
  const { flowLabel, display, calculations, publications, pubmedPmids, ...rest } = base;
  const nextDisplay = {
    flowLabel: display?.flowLabel ?? flowLabel,
    metricLabels: display?.metricLabels ?? [],
  };
  const nextCalculations = calculations ?? defaultCalculations(base.requiredAnalytes);
  const mergedPmids = [
    ...(pubmedPmids ?? []),
    ...(publications ?? []).map((entry) => entry.pmid).filter(Boolean) as string[],
  ];
  const nextPmids = Array.from(
    new Set(
      mergedPmids
        .map((pmid) => pmid.trim())
        .filter((pmid) => pmid.length > 0),
    ),
  );
  return {
    ...rest,
    publications,
    pubmedPmids: nextPmids.length > 0 ? nextPmids : undefined,
    display: nextDisplay,
    calculations: nextCalculations,
  };
};

const baseRegistry: BasePathwayDefinition[] = [
  // Framework A
  {
    id: "A1_TCA",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 1,
    title: "TCA cycle throughput",
    subtitle: "Core mitochondrial engine",
    requiredAnalytes: ["citric", "isocitric", "2oxoglutaric", "succinic", "fumaric", "malic"],
    optionalAnalytes: ["aconiticz"],
    flowLabel: "Acetyl-CoA → Citrate → α-KG → Succinyl-CoA → Malate → Oxaloacetate",
    pubmedPmids: ["31900386"],
  },
  {
    id: "A2_ETC",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 2,
    title: "Mitochondrial redox & substrate pressure",
    subtitle: "TCA cycle efficiency + ketone metabolism",
    requiredAnalytes: ["succinic", "malic", "3hydroxybutyric"],
    optionalAnalytes: ["acetoacetic", "fumaric", "citric", "2oxoglutaric", "lactic", "pyruvic"],
    flowLabel: "TCA (succinate/malate) + ketone redox (beta-hydroxybutyrate/acetoacetate)",
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "redoxPressure",
      ratioDefinitions: [
        {
          numeratorAnalyteId: "3hydroxybutyric",
          denominatorAnalyteId: "acetoacetic",
          ratioTransform: "log",
          label: "Ketone redox ratio",
        },
        {
          numeratorAnalyteId: "lactic",
          denominatorAnalyteId: "pyruvic",
          ratioTransform: "log",
          label: "Cytosolic redox ratio",
        },
      ],
      metaboliteLines: [
        { analyteId: "succinic", displayMetric: "zScore" },
        { analyteId: "malic", displayMetric: "zScore" },
        { analyteId: "3hydroxybutyric", displayMetric: "zScore" },
        { analyteId: "acetoacetic", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "Your ketones are elevated, which often happens with fasting, low-carb intake, or endurance exercise. " +
      "We also look at the BHB/AcAc ratio, which in preclinical models reflects hepatic redox state and in humans is an indirect proxy that should be interpreted cautiously.",
    actions: [
      "1) Confirm context: fasting duration, low-carb/keto intake, last 48h training, alcohol, recent illness, hydration.",
      "2) If ketosis is intentional: hydrate + electrolytes, keep intake consistent, retest only after 1-2 weeks if tracking adaptation.",
      "3) If ketosis is unintentional or unclear: check fasting glucose + HbA1c within 1-2 weeks; review a 3-day food log.",
      "4) Re-test standardization: 8-12h fast, no heavy training 24-48h, no alcohol 48h, consistent caffeine timing.",
      "5) Seek care (safety): if severe symptoms or diabetes risk; include symptoms like excessive thirst, frequent urination, nausea, confusion.",
    ],
    publications: [
      {
        pmid: "421996",
        note: "Ketone ratio reflects hepatic redox (animal model; inverse ratio).",
      },
      {
        pmid: "6309158",
        note: "Mechanistic mitochondrial redox link.",
      },
      {
        pmid: "38375486",
        note: "Clinical assay + stability + reference ranges.",
      },
    ],
    pubmedPmids: ["421996", "6309158", "38375486"],
  },
  {
    id: "A3_GLYCOLYSIS",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 3,
    title: "Fuel switching + 2-hydroxybutyrate signal",
    subtitle: "Ketone use + NADH/oxidative-stress proxy",
    requiredAnalytes: ["2hydroxybutyric", "2oxobutyric", "2aminobutyric", "3hydroxybutyric"],
    optionalAnalytes: ["alphaaminobutyric", "acetoacetic"],
    flowLabel: "Alpha-ketobutyrate -> 2-hydroxybutyrate (redox-linked) + ketone context (beta-hydroxybutyrate)",
    display: {
      metricLabels: ["Signal score (z)"],
    },
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "hydroxybutyrateSignal",
      metaboliteLines: [
        { analyteId: "2hydroxybutyric", displayLabel: "2-hydroxybutyrate", displayMetric: "zScore" },
      { analyteId: "2oxobutyric", displayLabel: "2-oxobutyrate (alpha-ketobutyrate)", displayMetric: "zScore" },
        { analyteId: "2aminobutyric", displayLabel: "2-aminobutyrate", displayMetric: "zScore" },
      { analyteId: "3hydroxybutyric", displayLabel: "beta-hydroxybutyrate (ketone)", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "This pattern combines two ideas: (1) whether you're currently using more fat/ketones for fuel, and (2) whether a marker called 2-hydroxybutyrate is higher than typical. " +
      "2-hydroxybutyrate has been associated with insulin resistance risk and altered metabolic/redox balance in human studies. " +
      "Beta-hydroxybutyrate usually rises with fasting, low-carb/keto eating, or prolonged exercise. " +
      "This is not diagnostic on its own; it's best interpreted with diet, timing of the blood draw, exercise in the prior 24-48h, alcohol intake, and overall clinical context.",
    actions: [
      "If you were fasting, low-carb, or exercised hard in the last 24-48h: this pattern can be expected - consider repeating under standardized conditions (8-12h fast, no heavy exercise for 24h).",
      "If this was NOT expected: consider checking fasting glucose + HbA1c and reviewing a 3-day food log (especially late-day carbs/alcohol).",
      "Retest after 1-2 weeks with consistent diet, sleep, and training load to see if the signal normalizes.",
    ],
    publications: [
      { pmid: "20526369", note: "Alpha-hydroxybutyrate (2-HB) as an early biomarker of insulin resistance / altered fuel oxidation." },
      { pmid: "34940595", note: "Review of 2-hydroxybutyrate and its relationship to insulin resistance and redox state." },
      { pmid: "10634967", note: "Ketone body physiology and interpretation context." },
    ],
    pubmedPmids: ["20526369", "34940595", "10634967"],
  },
  {
    id: "A4_BETA_OX",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 4,
    title: "Fatty-acid oxidation core",
    subtitle: "Carnitine shuttle + beta-oxidation flux",
    requiredAnalytes: ["carnitine", "acetylcarnitine"],
    optionalAnalytes: [
      "propionylcarnitine",
      "butyrylcarnitine",
      "isobutyrylcarnitine",
      "isovalerylcarnitine",
      "valerylcarnitine",
      "hexanoylcarnitine",
      "octanoylcarnitine",
      "decanoylcarnitine",
      "lauroylcarnitine",
      "myristoylcarnitine",
      "palmitoylcarnitine",
      "stearoylcarnitine",
    ],
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "faOxGrouped",
      faOxRatioStats: {
        c2c0: {
          mean: -1.4, // placeholder - replace with internal cohort mean(ln(C2/C0))
          sd: 0.35, // placeholder - replace with internal cohort sd
          reference: "internal cohort (matrix-matched)",
        },
        medc0: {
          mean: -3.1, // placeholder - replace with internal cohort mean(ln((C8+C10)/C0))
          sd: 0.45, // placeholder - replace with internal cohort sd
          reference: "internal cohort (matrix-matched)",
        },
      },
      metaboliteLines: [
        { analyteId: "carnitine", displayMetric: "zScore" },
        { analyteId: "acetylcarnitine", displayMetric: "zScore" },
        { analyteId: "propionylcarnitine", displayMetric: "zScore" },
        { analyteId: "butyrylcarnitine", displayMetric: "zScore" },
        { analyteId: "isobutyrylcarnitine", displayMetric: "zScore" },
        { analyteId: "isovalerylcarnitine", displayMetric: "zScore" },
        { analyteId: "valerylcarnitine", displayMetric: "zScore" },
        { analyteId: "hexanoylcarnitine", displayMetric: "zScore" },
        { analyteId: "octanoylcarnitine", displayMetric: "zScore" },
        { analyteId: "decanoylcarnitine", displayMetric: "zScore" },
        { analyteId: "lauroylcarnitine", displayMetric: "zScore" },
        { analyteId: "myristoylcarnitine", displayMetric: "zScore" },
        { analyteId: "palmitoylcarnitine", displayMetric: "zScore" },
        { analyteId: "stearoylcarnitine", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    flowLabel: "Carnitine shuttle → beta-oxidation",
    publications: [
      {
        pmid: "33071282",
        note: "Acylcarnitine profiling overview relevant to FAO flux interpretation.",
      },
      {
        pmid: "18281923",
        note: "Background on acylcarnitine patterns across FAO states.",
      },
      {
        pmid: "34954532",
        note: "FAO-related acylcarnitine signatures in plasma profiling.",
      },
      {
        pmid: "35710135",
        note: "Acylcarnitine nomenclature and biochemical context.",
      },
      {
        pmid: "31294795",
        note: "Acylcarnitine patterns as mitochondrial biomarkers.",
      },
    ],
    pubmedPmids: ["33071282", "18281923", "34954532", "35710135", "31294795"],
  },
  {
    id: "A5_BCAA",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 5,
    title: "BCAA mitochondrial oxidation",
    subtitle: "Valine/leucine/isoleucine fuel + signaling",
    requiredAnalytes: ["leucine", "isoleucine", "valine"],
    optionalAnalytes: [
      "2oxoisocaproic",
      "2oxoisovaleric",
      "2hydroxyisocaproic",
      "2hydroxyisovaleric",
      "3hydroxy2methylbutyric",
      "3hydroxyisovaleric",
      "3hydroxyisobutyric",
      "3methylcrotonylglycine",
      "3methylglutaconic",
      "3methylglutaric",
      "tiglylglycine",
    ],
    display: {
      metricLabels: ["BCAA oxidation score"],
    },
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "bcaaOxidation",
      metaboliteLines: [
        { analyteId: "leucine", displayLabel: "Leucine", displayMetric: "zScore" },
        { analyteId: "isoleucine", displayLabel: "Isoleucine", displayMetric: "zScore" },
        { analyteId: "valine", displayLabel: "Valine", displayMetric: "zScore" },
        { analyteId: "2oxoisocaproic", displayLabel: "Leucine keto-acid (KIC)", displayMetric: "zScore" },
        { analyteId: "2oxoisovaleric", displayLabel: "Valine keto-acid (KIV)", displayMetric: "zScore" },
        { analyteId: "2hydroxyisocaproic", displayLabel: "2-hydroxyisocaproate", displayMetric: "zScore" },
        { analyteId: "2hydroxyisovaleric", displayLabel: "2-hydroxyisovalerate", displayMetric: "zScore" },
        { analyteId: "3hydroxy2methylbutyric", displayLabel: "3-hydroxy-2-methylbutyrate", displayMetric: "zScore" },
        { analyteId: "3hydroxyisovaleric", displayLabel: "3-hydroxyisovalerate", displayMetric: "zScore" },
        { analyteId: "3hydroxyisobutyric", displayLabel: "3-hydroxyisobutyrate", displayMetric: "zScore" },
        { analyteId: "3methylcrotonylglycine", displayLabel: "3-methylcrotonylglycine", displayMetric: "zScore" },
        { analyteId: "3methylglutaconic", displayLabel: "3-methylglutaconate", displayMetric: "zScore" },
        { analyteId: "3methylglutaric", displayLabel: "3-methylglutarate", displayMetric: "zScore" },
        { analyteId: "tiglylglycine", displayLabel: "Tiglylglycine", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "BCAAs come from protein and are used as fuel. Higher patterns can happen with diet or training and sometimes with metabolic stress. Trend over time matters more than one test.",
    actions: [
      "If you recently increased protein intake, fasted longer than usual, or did hard training in the last 24–48 hours, interpret with that context.",
      "For the cleanest re-check: repeat testing after 8–12h fasting and avoid heavy exercise for 24h beforehand.",
      "If this stays abnormal over time, consider checking fasting glucose/HbA1c and reviewing overall diet and activity patterns with your clinician.",
    ],
    publications: [
      {
        pmid: "30449684",
        note: "Mechanistic: maps whole-body BCAA oxidation and key steps (BCAT/BCKDH) in vivo.",
      },
      {
        pmid: "23129134",
        note: "Clinical: BCAAs predict insulin resistance prospectively in young adults.",
      },
      {
        pmid: "26895884",
        note: "Clinical: BCAAs associated with insulin sensitivity and incident diabetes risk.",
      },
      {
        pmid: "22065088",
        note: "Clinical: BCAA-related metabolite factor predicts change in insulin resistance with weight loss.",
      },
    ],
    pubmedPmids: ["30449684", "23129134", "26895884", "22065088"],
  },
  {
    id: "A6_KETONES",
    framework: "A",
    frameworkTitle: FRAMEWORK_TITLES.A,
    order: 6,
    title: "Ketone production / utilization",
    subtitle: "Fasting / low-carb fuel shift",
    requiredAnalytes: ["3hydroxybutyric", "acetoacetic"],
    optionalAnalytes: [],
    flowLabel: "Fat → Acetoacetate ⇄ Beta-hydroxybutyrate",
    display: { metricLabels: ["BHB/AcAc ratio"] },
    calculations: {
      pathwayScoreMethod: "ratioZ",
      ratioDefinition: {
        numeratorAnalyteId: "3hydroxybutyric",
        denominatorAnalyteId: "acetoacetic",
        ratioTransform: "log",
        ratioCohortStats: { mean: -1.1, sd: 0.45, reference: "internal cohort (matrix-matched)" },
        label: "BHB/AcAc ratio",
      },
      metaboliteLines: [
        { analyteId: "3hydroxybutyric", displayLabel: "Beta-hydroxybutyrate (BHB)", displayMetric: "zScore" },
        { analyteId: "acetoacetic", displayLabel: "Acetoacetate (AcAc)", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "Ketones are fuels made from fat. They commonly rise with fasting, low-carb/keto eating, and prolonged exercise, and can also rise during illness. " +
      "We also report the BHB/AcAc ratio, which is an indirect proxy that can shift with cellular redox balance and sample handling. " +
      "This pattern is not diagnostic by itself—interpret with your diet, exercise, and how you feel. " +
      "Sample note: acetoacetate can decrease if blood isn't cooled/processed promptly, which may affect the ratio.",
    actions: [
      "Confirm context: fasting duration, low-carb/keto diet, prolonged exercise, recent illness, and alcohol in the last 24 hours.",
      "If ketosis is intentional and you feel well: hydrate, ensure electrolytes, and focus on trend over time.",
      "If ketosis is unintentional or symptoms are present: consider fasting glucose and HbA1c and review diet context.",
      "For retesting: standardize (8–12h fast, avoid heavy exercise 24h, consistent diet for several days).",
    ],
    publications: [
      {
        pmid: "38375486",
        note: "Validated LC-MS/MS ketone panel; includes reference ranges + BHB/AcAc ratio + stability notes.",
      },
      {
        pmid: "7386330",
        note: "Acetoacetate decays at room temperature; cooling/processing improves stability.",
      },
      {
        pmid: "11918279",
        note: "Preanalytical/analytical considerations for AcAc/BHB measurement.",
      },
      {
        pmid: "33592770",
        note: "UPLC-MS/MS method emphasizing AcAc instability challenges.",
      },
    ],
    pubmedPmids: ["38375486", "7386330", "11918279", "33592770"],
  },
  // Framework B
  {
    id: "B1_GSH",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 1,
    title: "Glutathione recycling (GSH:GSSG)",
    requiredAnalytes: ["glutathione(reduced)", "glutathione(oxidized)"],
    optionalAnalytes: [
      "cysteinylglycine",
      "cystathionine",
      "homocysteine",
      "5oxoproline",
      "glycine",
      "cysteine",
      "cystine",
      "glutamic",
    ],
    flowLabel: "Cys → γ-Glu-Cys → GSH ⇄ GSSG",
    display: {
      metricLabels: ["GSH/GSSG ratio"],
    },
    calculations: {
      pathwayScoreMethod: "ratioZ",
      ratioDefinition: {
        numeratorAnalyteId: "glutathione(reduced)",
        denominatorAnalyteId: "glutathione(oxidized)",
        ratioTransform: "log",
        ratioCohortStats: { mean: 2.8, sd: 0.35, reference: "internal cohort (matrix-matched)" },
        label: "GSH/GSSG ratio",
      },
      metaboliteLines: [
        { analyteId: "glutathione(reduced)", displayLabel: "Reduced GSH", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "glutathione(oxidized)", displayLabel: "Oxidized GSSG", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "cysteinylglycine", displayLabel: "Cysteinylglycine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "cysteine", displayLabel: "Cysteine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "cystine", displayLabel: "Cystine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "5oxoproline", displayLabel: "5-oxoproline", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "glycine", displayLabel: "Glycine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "glutamic", displayLabel: "Glutamic acid", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "cystathionine", displayLabel: "Cystathionine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "homocysteine", displayLabel: "Homocysteine", displayMetric: "foldChange", baseline: "referenceMid" },
      ],
      implemented: true,
    },
    interpretation:
      "Lower GSH with higher GSSG can suggest higher oxidative stress signals, but plasma glutathione is very sensitive to blood draw handling. " +
      "Processing delays and even mild hemolysis can change results. Use this as a trend marker and interpret alongside sample handling, diet, training, medications, and clinical context.",
    pubmedPmids: ["15512798", "30445289", "10719244"],
  },
  {
    id: "B2_REDOX_LOAD",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 2,
    title: "Redox demand / glutathione turnover",
    requiredAnalytes: ["5oxoproline", "cysteinylglycine", "cystathionine", "glycine", "2hydroxybutyric"],
    optionalAnalytes: ["2aminobutyric", "alphaaminobutyric"],
  },
  {
    id: "B3_NADPH",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 3,
    title: "NADPH support signals",
    subtitle: "PPP + malic enzyme (indirect proxies)",
    requiredAnalytes: ["ribulose", "malic"],
    optionalAnalytes: ["ribose", "ribitol", "arabitol"],
    flowLabel: "PPP pentoses (ribulose +/- ribose/ribitols) + malate (ME1 substrate)",
    display: {
      metricLabels: ["Composite z-score (proxy)"],
    },
    calculations: {
      pathwayScoreMethod: "weightedZ",
      metaboliteLines: [
        { analyteId: "ribulose", displayLabel: "Ribulose (PPP-related pentose)", displayMetric: "zScore" },
        { analyteId: "malic", displayLabel: "Malate (ME1 substrate)", displayMetric: "zScore" },
        { analyteId: "ribose", displayLabel: "Ribose (PPP-related pentose)", displayMetric: "zScore" },
        { analyteId: "ribitol", displayLabel: "Ribitol (polyol; pentose-related)", displayMetric: "zScore" },
        { analyteId: "arabitol", displayLabel: "Arabitol (polyol; pentose-related)", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "This section looks at blood levels of a few molecules that relate to pathways that help make NADPH, " +
      "a type of cellular \"reducing power\" used for antioxidant defenses and normal metabolism. " +
      "These markers are indirect signals (they do not measure NADPH directly), and they can shift with diet, fasting, exercise, and timing of the blood draw. " +
      "If results are unusual, the most useful next step is to repeat under standardized conditions and interpret alongside other redox markers.",
    actions: [
      "If this pathway looks unusual: repeat testing with consistent fasting (8-12h), stable diet for 3-7 days, and avoid hard exercise for 24h.",
      "Review recent supplements/medications and recent illness, which can shift carbohydrate and redox metabolism.",
      "If you want a more direct redox view: interpret alongside glutathione markers (GSH/GSSG) and related pathways.",
    ],
    publications: [
      { pmid: "37612403", note: "PPP overview: produces NADPH + ribose-5P; roles in redox balance and biosynthesis." },
      { pmid: "31058257", note: "oxPPP vs ME1/IDH1 NADPH network; oxPPP uniquely supports NADPH/NADP balance in cells." },
      { pmid: "33064660", note: "ME1 review: malate -> pyruvate generates NADPH; part of cytosolic NADPH network." },
      { pmid: "25037503", note: "PPP review emphasizing NADPH production role (context: stress states/cancer metabolism)." },
    ],
    pubmedPmids: ["37612403", "31058257", "33064660", "25037503"],
  },
  {
    id: "B4_SULFATION",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 4,
    title: "Sulfation support (not fully assessed in this panel)",
    subtitle: "PAPS / sulfate-conjugation capacity (requires sulfate + cysteine)",
    requiredAnalytes: ["sulfate", "cysteine"],
    optionalAnalytes: ["cystathionine", "taurine", "homocysteine"],
    flowLabel: "Sulfate + cysteine → PAPS → sulfation (SULT enzymes)",
    display: {
      metricLabels: ["Sulfation capacity (requires sulfate + cysteine)"],
    },
    calculations: {
      pathwayScoreMethod: "weightedZ",
      metaboliteLines: [
        { analyteId: "sulfate", displayLabel: "Sulfate", displayMetric: "zScore" },
        { analyteId: "cysteine", displayLabel: "Cysteine", displayMetric: "zScore" },
        { analyteId: "cystathionine", displayLabel: "Cystathionine (supporting)", displayMetric: "zScore" },
        { analyteId: "taurine", displayLabel: "Taurine (supporting)", displayMetric: "zScore" },
      ],
      implemented: false,
    },
    interpretation:
      "Sulfation is one of the body’s “tag-and-clear” systems. The liver and other tissues use an activated sulfate donor (called PAPS) to attach sulfate to hormones, neurotransmitters, and many medications so they can be processed and cleared. " +
      "To estimate sulfation capacity, we need sulfate and cysteine (a key sulfur amino acid). Those markers are not included in this test panel, so we can’t score this pathway reliably from the available data. " +
      "Cystathionine (shown here) relates to sulfur amino-acid flow, but by itself it is not a direct readout of sulfation capacity.",
    actions: [
      "If you want this pathway scored, use an expanded panel that includes plasma sulfate and cysteine/cystine (or a targeted sulfur-amino-acid test).",
      "For best comparability over time: test fasting (8–12h), avoid heavy exercise for 24h, and keep diet consistent for 48h.",
      "If you’re evaluating detox/drug sensitivity concerns: review medication/supplement list with a clinician rather than relying on this pathway alone.",
    ],
    publications: [
      {
        pmid: "9194521",
        note: "Review: PAPS is the obligate sulfate donor; sulfate availability and PAPS synthesis can limit sulfation capacity.",
      },
      {
        pmid: "11773860",
        note: "PAPSS2 functional variation impacts PAPS synthesis; supports biology behind ‘capacity’ concept (not a direct lab reference interval).",
      },
    ],
    pubmedPmids: ["9194521", "11773860"],
  },
  {
    id: "B5_GLUCURONIDATION",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 5,
    title: "Glucuronidation capacity",
    requiredAnalytes: ["glucuronicacid", "hippuric"],
    optionalAnalytes: ["4hydroxyhippuric"],
  },
  {
    id: "B6_XENO",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 6,
    title: "Xenobiotic / aromatic detox proxy",
    requiredAnalytes: ["benzoic", "pseudouridine", "ribothymidine"],
    optionalAnalytes: ["xanthosine"],
  },
  {
    id: "B7_OMEGA_OX",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 7,
    title: "Omega-oxidation backup fat oxidation",
    requiredAnalytes: [
      "adipic",
      "suberic",
      "sebacic",
      "undecanedioic",
      "tridecanedioic",
      "tetradecanedioic",
      "dodecanedioic",
      "azelaic",
    ],
    optionalAnalytes: ["suberylglycine", "hexanoylglycine"],
    flowLabel: "FAO stress → dicarboxylates",
  },
  {
    id: "B8_PROPIONATE",
    framework: "B",
    frameworkTitle: FRAMEWORK_TITLES.B,
    order: 8,
    title: "Propionate load + succinyl-CoA refill",
    requiredAnalytes: ["propionylcarnitine", "propionylglycine", "2methylcitric", "methylmalonic"],
    optionalAnalytes: ["3hydroxypropionic", "2oxobutyric", "propionylcholine"],
    flowLabel: "Propionate → MMA → Succinyl-CoA",
  },
  // Framework C
  {
    id: "C1_KYNURENINE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 1,
    title: "Tryptophan → Kynurenine balance (K/T ratio)",
    subtitle: "K/T (×1000)",
    requiredAnalytes: ["tryptophan", "kynurenine"],
    flowLabel: "Trp → Kyn (K/T ×1000)",
    display: {
      metricLabels: ["K/T (×1000)"],
    },
    metricLabel: "K/T (×1000)",
    referenceRangeLabel: "Typical range: 20–50 (×1000)",
    calculations: {
      pathwayScoreMethod: "ratioZ",
      ratioDefinition: {
        numeratorAnalyteId: "kynurenine",
        denominatorAnalyteId: "tryptophan",
        ratioTransform: "log",
        ratioCohortStats: { mean: -2.5, sd: 0.35, reference: "internal cohort (matrix-matched)" },
        label: "K/T ratio",
      },
      metaboliteLines: [
        { analyteId: "kynurenine", displayLabel: "Kynurenine", displayMetric: "zScore" },
        { analyteId: "tryptophan", displayLabel: "Tryptophan", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "This compares kynurenine to tryptophan. A higher K/T ratio can occur when the body shifts more " +
      "tryptophan into the kynurenine pathway at the time of the draw. This pattern is not diagnostic by itself.",
    education: {
      summary:
        "This compares kynurenine to tryptophan. A higher K/T ratio can occur when the body shifts more " +
        "tryptophan into the kynurenine pathway at the time of the draw. This pattern is not diagnostic by itself.",
      whatMeans:
        "A higher K/T ratio is commonly seen during immune activation or physiologic stress. It can " +
        "reflect inflammation signaling, recent infection, or recovery demand.",
      nonDiseaseReasons:
        "Recent illness, poor sleep, heavy training load, calorie restriction, alcohol, and some medications " +
        "can shift tryptophan metabolism. Fasting duration and stress at the time of draw can also matter.",
      retest:
        "Re-test when you’ve had stable sleep and nutrition for 1–2 weeks, avoid hard training for 24–48 " +
        "hours, and keep caffeine timing consistent. If symptoms persist, review with a clinician alongside " +
        "other labs and history.",
      calculation:
        "K/T (×1000) = 1000 × kynurenine(µM) ÷ tryptophan(µM), rounded to nearest whole number.",
      disclaimer: "This pattern is not diagnostic by itself.",
    },
    publications: [
      {
        pmid: "31488951",
        note: "Review/appraisal of plasma Kyn/Trp ratio as a commonly used proxy for IDO-related tryptophan degradation after immune activation.",
      },
      {
        pmid: "36653422",
        note: "Large cross-cohort study noting KTR and neopterin as IFN-γ–induced inflammatory markers and characterizing associations with kynurenines.",
      },
      {
        pmid: "33338598",
        note: "Clinical example (SARS-CoV-2) showing elevated Kyn:Trp ratio tracks inflammatory burden and may have biomarker value in inflammatory states.",
      },
      {
        pmid: "26823439",
        note: "Population study linking kynurenines and inflammation-related markers (including KTR) with mortality risk—supports relevance as systemic inflammation biology.",
      },
      {
        pmid: "31736978",
        note: "Review connecting tryptophan-kynurenine metabolism to inflammaging and immune regulation; supports interpretation as immune-linked pathway shift.",
      },
      {
        pmid: "32139353",
        note: "Exercise review summarizing how acute vs chronic exercise can alter kynurenine pathway metabolites—supports 'training can influence this' statement.",
      },
      {
        pmid: "27124720",
        note: "Human study: exhaustive aerobic exercise decreased tryptophan, increased kynurenine, and increased Kyn/Trp ratio correlating with neopterin—supports physiologic stress/training effects.",
      },
    ],
  },
  {
    id: "C2_QUINOLINIC",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 2,
    title: "Quinolinic neurotoxic branch",
    requiredAnalytes: ["quinolinic", "kynurenic"],
    optionalAnalytes: ["nad"],
  },
  {
    id: "C3_HISTAMINE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 3,
    title: "Histamine load / degradation",
    requiredAnalytes: ["histamine", "methylhistamine"],
    optionalAnalytes: ["methylhistidine"],
  },
  {
    id: "C4_EICOSANOIDS",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 4,
    title: "Eicosanoid precursor balance",
    subtitle: "AA/EPA proxy",
    requiredAnalytes: ["adipic", "sebacic"],
    optionalAnalytes: ["omega3index"],
  },
  {
    id: "C5_PURINE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 5,
    title: "Purine turnover / uric acid stress",
    requiredAnalytes: ["uric", "xanthosine"],
    optionalAnalytes: ["creatinine"],
  },
  {
    id: "C6_NO",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 6,
    title: "Nitric oxide signaling",
    subtitle: "Arginine/ornithine/citrulline axis",
    requiredAnalytes: ["arginine", "citrulline", "ornithine"],
    optionalAnalytes: ["homoarginine"],
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "nitricOxide",
      metaboliteLines: [
        { analyteId: "arginine", displayLabel: "Arginine", displayMetric: "zScore" },
        { analyteId: "citrulline", displayLabel: "Citrulline", displayMetric: "zScore" },
        { analyteId: "ornithine", displayLabel: "Ornithine", displayMetric: "zScore" },
      ],
      implemented: true,
    },
  },
  {
    id: "C7_LIVER_BILE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 7,
    title: "Liver overlay: bile acid synthesis + flow",
    requiredAnalytes: ["glycocholic", "glycochenodeoxycholic", "glycodeoxycholic"],
  },
  {
    id: "C8_LIVER_GLUCU",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 8,
    title: "Liver overlay: glucuronidation capacity",
    requiredAnalytes: ["glucuronicacid"],
  },
  {
    id: "C9_LIVER_GLYCINE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 9,
    title: "Liver overlay: glycine conjugation",
    requiredAnalytes: ["hippuric", "benzoic"],
    optionalAnalytes: ["cinnamoylglycinetrans", "4hydroxyhippuric", "phenylacetic"],
  },
  {
    id: "C10_LIVER_UREA",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 10,
    title: "Liver overlay: urea cycle / ammonia handling",
    requiredAnalytes: ["citrulline", "homocitrulline", "oroticacid"],
  },
  {
    id: "C11_LIVER_AROMATIC",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 11,
    title: "Liver overlay: aromatic amino acid handling",
    requiredAnalytes: [
      "phenylalanine",
      "phenylpyruvic",
      "phenyllactic",
      "4hydroxyphenylpyruvic",
      "4hydroxyphenyllactic",
      "4hydroxyphenylacetic",
      "homogentisic",
    ],
  },
  {
    id: "C12_KIDNEY_CLEARANCE",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 12,
    title: "Kidney clearance overlay",
    requiredAnalytes: [
      "creatinine",
      "sdma",
      "pseudouridine",
      "ribothymidine",
      "5methylcytidine",
      "3methylcytidine",
      "xanthosine",
      "uric",
      "hippuric",
    ],
  },
  {
    id: "C13_CONTEXT",
    framework: "C",
    frameworkTitle: FRAMEWORK_TITLES.C,
    order: 13,
    title: "Context overlay: pre-analytics + training + diet",
    requiredAnalytes: [
      "3hydroxybutyric",
      "adipic",
      "3hydroxyisovaleric",
      "trimethylaminenoxide",
      "xylitol",
      "neopterin",
    ],
  },
  // Framework D
  {
    id: "D1_METHYLATION",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 1,
    title: "Methionine cycle core",
    subtitle: "Methyl donation capacity",
    requiredAnalytes: ["sam", "sah", "homocysteine"],
    optionalAnalytes: ["betaine", "dimethylglycine"],
  },
  {
    id: "D2_FOLATE",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 2,
    title: "Folate supply + serine/glycine input",
    subtitle: "One-carbon supply line",
    requiredAnalytes: ["serine", "glycine", "folate"],
    optionalAnalytes: ["sarcosine"],
  },
  {
    id: "D3_TRANSSULFURATION",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 3,
    title: "Transsulfuration branch",
    requiredAnalytes: ["cystathionine", "cysteinylglycine", "5oxoproline", "2hydroxybutyric"],
    optionalAnalytes: ["2aminobutyric", "alphaaminobutyric", "glycine", "homocysteine"],
  },
  {
    id: "D4_TAURINE",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 4,
    title: "Taurine / bile acid conjugation",
    requiredAnalytes: ["taurine", "glycocholic", "glycochenodeoxycholic"],
    optionalAnalytes: ["glycodeoxycholic"],
  },
  {
    id: "D5_CHOLINE",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 5,
    title: "Betaine-choline remethylation",
    subtitle: "BHMT pathway",
    requiredAnalytes: ["choline", "betaine", "dimethylglycine", "homocysteine"],
    optionalAnalytes: ["sarcosine"],
  },
  {
    id: "D6_POLYAMINE",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 6,
    title: "Polyamine synthesis branch",
    requiredAnalytes: ["putrescine", "spermidine", "spermine"],
  },
  {
    id: "D7_CARNITINE",
    framework: "D",
    frameworkTitle: FRAMEWORK_TITLES.D,
    order: 7,
    title: "Carnitine biosynthesis linkage",
    subtitle: "Methyl output → FAO readout",
    requiredAnalytes: ["trimethyllysine", "gammabutyrobetaine", "carnitine", "acetylcarnitine"],
  },
  // Framework E
  {
    id: "E1_UREA",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 1,
    title: "Urea cycle / ammonia detox",
    requiredAnalytes: ["citrulline", "ornithine", "arginine"],
    optionalAnalytes: ["uric"],
    calculations: {
      pathwayScoreMethod: "weightedZ",
      metaboliteLines: [
        { analyteId: "citrulline", displayLabel: "Citrulline", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "ornithine", displayLabel: "Ornithine", displayMetric: "foldChange", baseline: "referenceMid" },
        { analyteId: "arginine", displayLabel: "Arginine", displayMetric: "foldChange", baseline: "referenceMid" },
      ],
      implemented: true,
    },
  },
  {
    id: "E2_GLN_GLU",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 2,
    title: "Glutamine–glutamate balance",
    requiredAnalytes: ["glutamine", "glutamate"],
    optionalAnalytes: ["gaba"],
  },
  {
    id: "E3_SER_GLY",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 3,
    title: "Serine/glycine interconversion",
    requiredAnalytes: ["serine", "glycine"],
    optionalAnalytes: ["sarcosine"],
  },
  {
    id: "E4_AROMATIC",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 4,
    title: "Aromatic amino acid balance",
    subtitle: "Phe/Tyr/Trp",
    requiredAnalytes: ["phenylalanine", "tyrosine", "tryptophan"],
    optionalAnalytes: [
      "nacetyltyrosine",
      "tyramine",
      "tryptamine",
      "ldopa",
      "dopamine",
      "epinephrine",
      "norepinephrine",
      "hva",
      "vma",
      "mhpg",
      "kynurenine",
      "kynurenic",
      "quinolinic",
      "serotonin",
      "melatonin",
      "5hiaa",
      "phenylpyruvic",
      "phenylacetic",
      "phenyllactic",
      "4hydroxyphenylacetic",
      "4hydroxyphenyllactic",
      "4hydroxyphenylpyruvic",
      "homogentisic",
    ],
    calculations: {
      pathwayScoreMethod: "weightedZ",
      scoreStrategy: "aromaticBalance",
      ratioDefinitions: [
        {
          numeratorAnalyteId: "phenylalanine",
          denominatorAnalyteId: "tyrosine",
          ratioTransform: "log",
          label: "Phe:Tyr ratio",
        },
        {
          numeratorAnalyteId: "kynurenine",
          denominatorAnalyteId: "tryptophan",
          ratioTransform: "log",
          label: "Kyn:Trp ratio",
        },
      ],
      metaboliteLines: [
        { analyteId: "phenylalanine", displayLabel: "Phenylalanine", displayMetric: "zScore" },
        { analyteId: "tyrosine", displayLabel: "Tyrosine", displayMetric: "zScore" },
        { analyteId: "tryptophan", displayLabel: "Tryptophan", displayMetric: "zScore" },
      ],
      implemented: true,
    },
    interpretation:
      "Phenylalanine, tyrosine, and tryptophan are aromatic amino acids that shift with protein metabolism and metabolic health. " +
      "The Phe:Tyr ratio can rise when phenylalanine hydroxylase activity is altered (reported in mechanistic models); interpret with context. " +
      "The Kyn:Trp ratio is commonly used to reflect immune activation and tryptophan catabolism; interpret with context.",
    publications: [
      {
        pmid: "23129134",
        note: "Prospective cohort: branched-chain and aromatic amino acids (incl. Phe/Tyr) predict insulin resistance.",
      },
      {
        pmid: "26221519",
        note: "Non-diabetic cohort: insulin resistance-related amino acid profile includes tyrosine and phenylalanine.",
      },
      {
        pmid: "23300845",
        note: "Immune activation links elevated phenylalanine and Phe:Tyr ratio to PAH regulation and oxidative stress.",
      },
      {
        pmid: "31488951",
        note: "Review: plasma Kyn:Trp ratio used for IDO activity and immune activation; interpret cautiously.",
      },
    ],
    pubmedPmids: ["23129134", "26221519", "23300845", "31488951"],
  },
  {
    id: "E5_LYSINE",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 5,
    title: "Lysine catabolism / carnitine precursor flux",
    requiredAnalytes: ["lysine", "carnitine", "propionylcarnitine"],
    optionalAnalytes: ["trimethyllysine"],
  },
  {
    id: "E6_COLLAGEN",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 6,
    title: "Collagen / proline–hydroxyproline turnover",
    requiredAnalytes: ["hydroxyproline", "proline"],
  },
  {
    id: "E7_NITRIC_OXIDE",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 7,
    title: "Nitric oxide availability",
    subtitle: "Endothelial function",
    requiredAnalytes: ["adma", "sdma", "homoarginine", "citrulline", "homocitrulline"],
  },
  {
    id: "E8_TH1",
    framework: "E",
    frameworkTitle: FRAMEWORK_TITLES.E,
    order: 8,
    title: "Th1 immune activation",
    subtitle: "Interferon signaling",
    requiredAnalytes: ["neopterin", "kynurenine", "kynurenic", "quinolinic"],
  },
  // Framework F
  {
    id: "F1_SCFA",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 1,
    title: "SCFA balance",
    subtitle: "Acetate/propionate/butyrate",
    requiredAnalytes: ["acetate", "propionate", "butyrate"],
  },
  {
    id: "F2_PHENYL_MICROBIOME",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 2,
    title: "Aromatic fermentation",
    requiredAnalytes: ["phenylacetic", "phenyllactic", "phenylpyruvic"],
    optionalAnalytes: [
      "4hydroxyphenylacetic",
      "4hydroxyphenyllactic",
      "4hydroxyphenylpyruvic",
      "homogentisic",
    ],
  },
  {
    id: "F3_INDOLE",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 3,
    title: "Tryptophan → indole signaling",
    requiredAnalytes: ["indole3acetic", "indole3propionic"],
    optionalAnalytes: [
      "indole3pyruvic",
      "indole3butyric",
      "indole3aldehyde",
      "indole3carboxylic",
      "indolelactic",
    ],
  },
  {
    id: "F4_BILE_DECONJ",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 4,
    title: "Bile acid deconjugation",
    requiredAnalytes: ["glycocholic", "glycochenodeoxycholic", "glycodeoxycholic"],
  },
  {
    id: "F5_YEAST",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 5,
    title: "Yeast/fungal-leaning polyol pattern",
    requiredAnalytes: ["arabitol", "ribitol", "xylitol"],
    optionalAnalytes: ["galactitol", "mannitol", "sorbitol", "ribulose"],
  },
  {
    id: "F6_TMAO",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 6,
    title: "TMA/TMAO axis",
    requiredAnalytes: ["trimethylamine", "trimethylaminenoxide"],
    optionalAnalytes: ["choline", "betaine", "dimethylglycine", "trimethyllysine", "gammabutyrobetaine", "carnitine"],
  },
  {
    id: "F7_PUTREFACTION",
    framework: "F",
    frameworkTitle: FRAMEWORK_TITLES.F,
    order: 7,
    title: "Protein putrefaction / polyamine axis",
    requiredAnalytes: ["putrescine", "cadaverine", "spermidine", "spermine"],
  },
  // Framework G
  {
    id: "G1_GABA",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 1,
    title: "GABA shunt / inhibitory balance",
    requiredAnalytes: ["gaba", "succinicsemialdehyde", "4hydroxybutyric", "succinic"],
    optionalAnalytes: ["2aminobutyric"],
  },
  {
    id: "G2_CATECHOL",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 2,
    title: "Catecholamine turnover",
    requiredAnalytes: ["ldopa", "hva", "vma", "mhpg"],
    optionalAnalytes: ["tyrosine", "dopamine", "nacetyltyrosine"],
  },
  {
    id: "G3_SEROTONIN",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 3,
    title: "Serotonin + melatonin",
    requiredAnalytes: ["serotonin", "5hiaa", "melatonin"],
    optionalAnalytes: ["tryptophan"],
  },
  {
    id: "G4_GLUTAMATE",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 4,
    title: "Glutamatergic tone proxy",
    requiredAnalytes: ["glutamate", "glutamine"],
    optionalAnalytes: ["aspartate"],
  },
  {
    id: "G5_OSMOLYTE",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 5,
    title: "Myo-inositol / osmolyte stress",
    requiredAnalytes: ["myoinositol", "sorbitol"],
    optionalAnalytes: ["mannitol"],
  },
  {
    id: "G6_CREATINE",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 6,
    title: "Creatine buffer + methyl cost",
    requiredAnalytes: ["guanidinoacetic", "creatine", "creatinine"],
    optionalAnalytes: ["sarcosine"],
  },
  {
    id: "G7_KYNURENINE",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 7,
    title: "Tryptophan → kynurenine neuroactive branch",
    requiredAnalytes: ["kynurenine", "kynurenic", "quinolinic"],
  },
  {
    id: "G8_CHOLINERGIC",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 8,
    title: "Cholinergic signaling / acetylcholine availability",
    requiredAnalytes: ["acetylcholine", "choline", "butyrylcholine", "lauroylcholine", "myristoylcholine", "propionylcholine"],
  },
  {
    id: "G9_METHYLXANTHINE",
    framework: "G",
    frameworkTitle: FRAMEWORK_TITLES.G,
    order: 9,
    title: "Methylxanthine exposure",
    requiredAnalytes: ["paraxanthine", "theobromine", "theophylline", "1,7-dimethylxanthine"],
  },
];

export const PATHWAY_REGISTRY: PathwayDefinition[] = baseRegistry.map(withDefaults);
