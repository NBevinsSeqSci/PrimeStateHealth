export type DomainAudience = "patient" | "clinician";

export type DomainKey =
  | "mood"
  | "anxiety"
  | "attention"
  | "reaction_speed"
  | "processing_speed"
  | "visual_memory"
  | "executive_function"
  | "inhibition"
  | "working_memory"
  | "verbal_learning"
  | "fluency"
  | "orientation"
  | "symbol_coding"
  | "set_shifting";

type DomainDef = {
  patientLabel: string;
  clinicianLabel: string;
  units?: string;
};

const DOMAIN_DEFS: Record<DomainKey, DomainDef> = {
  mood: {
    patientLabel: "Mood",
    clinicianLabel: "Mood screening",
    units: "points",
  },
  anxiety: {
    patientLabel: "Anxiety",
    clinicianLabel: "Anxiety screening",
    units: "points",
  },
  attention: {
    patientLabel: "Attention",
    clinicianLabel: "Attention screening",
    units: "points",
  },
  reaction_speed: {
    patientLabel: "Reaction speed",
    clinicianLabel: "Reaction speed",
    units: "ms",
  },
  processing_speed: {
    patientLabel: "Processing speed",
    clinicianLabel: "Processing speed",
    units: "ms",
  },
  visual_memory: {
    patientLabel: "Visual memory",
    clinicianLabel: "Visual memory",
    units: "items",
  },
  executive_function: {
    patientLabel: "Executive function",
    clinicianLabel: "Executive function",
    units: "score",
  },
  inhibition: {
    patientLabel: "Inhibition control",
    clinicianLabel: "Response inhibition",
    units: "score",
  },
  working_memory: {
    patientLabel: "Working memory",
    clinicianLabel: "Working memory",
    units: "score",
  },
  verbal_learning: {
    patientLabel: "Verbal learning",
    clinicianLabel: "Verbal learning",
    units: "words",
  },
  fluency: {
    patientLabel: "Fluency",
    clinicianLabel: "Verbal fluency",
    units: "count",
  },
  orientation: {
    patientLabel: "Orientation",
    clinicianLabel: "Orientation",
    units: "points",
  },
  symbol_coding: {
    patientLabel: "Symbol coding",
    clinicianLabel: "Symbol coding",
    units: "score",
  },
  set_shifting: {
    patientLabel: "Set shifting",
    clinicianLabel: "Set shifting",
    units: "seconds",
  },
};

const DOMAIN_ALIASES: Record<string, DomainKey> = {
  reaction: "reaction_speed",
  cpt: "processing_speed",
  memory: "visual_memory",
  visual_memory: "visual_memory",
  executive: "executive_function",
  stroop: "executive_function",
  go_no_go: "inhibition",
  digit_span: "working_memory",
  list: "verbal_learning",
  fluency: "fluency",
  orientation: "orientation",
  symbol: "symbol_coding",
  trails: "set_shifting",
  depression: "mood",
  gad: "anxiety",
};

const normalizeKey = (key: string) =>
  key.toLowerCase().replace(/\s+/g, "_").replace(/-+/g, "_");

export function normalizeDomainKey(key: string): DomainKey | null {
  const normalized = normalizeKey(key);
  return DOMAIN_ALIASES[normalized] ?? (DOMAIN_DEFS[normalized as DomainKey] ? (normalized as DomainKey) : null);
}

export function getDomainLabel(key: DomainKey, audience: DomainAudience = "patient") {
  const def = DOMAIN_DEFS[key];
  return audience === "clinician" ? def.clinicianLabel : def.patientLabel;
}

export function getDomainUnits(key: DomainKey) {
  return DOMAIN_DEFS[key]?.units ?? "";
}
