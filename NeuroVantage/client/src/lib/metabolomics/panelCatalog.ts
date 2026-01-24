const SYNONYMS: Record<string, string> = {
  larginine: "arginine",
  arg: "arginine",
  lcitrulline: "citrulline",
  lornithine: "ornithine",
  ltyrosine: "tyrosine",
  ltryptophan: "tryptophan",
  lphenylalanine: "phenylalanine",
  nacetyltyrosine: "nacetyltyrosine",
  dopa: "ldopa",
  levodopa: "ldopa",
  hva: "homovanillic",
  homovanillicacid: "homovanillic",
  vma: "vanillylmandelic",
  vanillylmandelicacid: "vanillylmandelic",
  mhpg: "mhpg",
  indole3acetic: "indole3acetic",
  indole3aldehyde: "indole3aldehyde",
  indole3propionic: "indole3propionic",
  indolelactic: "indolelactic",
};

const PANEL_ANALYTES = [
  "arginine",
  "citrulline",
  "ornithine",
  "phenylalanine",
  "tyrosine",
  "tryptophan",
  "nacetyltyrosine",
  "tyramine",
  "tryptamine",
  "ldopa",
  "dopamine",
  "epinephrine",
  "norepinephrine",
  "homovanillic",
  "vanillylmandelic",
  "mhpg",
  "kynurenine",
  "kynurenic",
  "quinolinic",
  "indole3acetic",
  "indole3aldehyde",
  "indole3propionic",
  "indolelactic",
];

const PANEL_SET = new Set(PANEL_ANALYTES.map((item) => normalizeAnalyteKey(item)));

export function normalizeAnalyteKey(name: string): string {
  if (!name) return "";
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return SYNONYMS[cleaned] ?? cleaned;
}

export function isInPanel(analyteKey: string): boolean {
  const normalized = normalizeAnalyteKey(analyteKey);
  return PANEL_SET.has(normalized);
}
