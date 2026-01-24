import analyteData from "@/data/analytes.json";
import { PATHWAY_REGISTRY } from "@/data/pathwayRegistry";
import { normalizeName } from "@/lib/analytes/normalize";
import type { PathwayDefinition } from "@/lib/pathways/types";
import type { AnalyteMetadata } from "@/types/analyte";

const rawData = analyteData as AnalyteMetadata[];
const URL_SAFE_ID = /^[A-Za-z0-9._~-]+$/;

const PATHWAY_BY_ID = new Map<string, PathwayDefinition>();
const PATHWAY_ORDER_INDEX = new Map<string, number>();
PATHWAY_REGISTRY.forEach((definition, index) => {
  PATHWAY_BY_ID.set(definition.id, definition);
  PATHWAY_ORDER_INDEX.set(definition.id, index);
});

const PATHWAYS_BY_ANALYTE = new Map<string, PathwayDefinition[]>();
PATHWAY_REGISTRY.forEach((definition) => {
  const analytes = [...definition.requiredAnalytes, ...(definition.optionalAnalytes ?? [])];
  analytes.forEach((analyteId) => {
    const normalized = normalizeName(analyteId);
    if (!PATHWAYS_BY_ANALYTE.has(normalized)) {
      PATHWAYS_BY_ANALYTE.set(normalized, []);
    }
    PATHWAYS_BY_ANALYTE.get(normalized)!.push(definition);
  });
});

const LEGACY_PATHWAY_ID_MAP: Record<string, PathwayDefinition["id"]> = {
  A1_TCA: "A1_TCA",
  A2_FAO_CORE: "A4_BETA_OX",
  A3_BCAA_OX: "A5_BCAA",
  A4_CREATINE_BUFFER: "G6_CREATINE",
  B1_KETONES: "A6_KETONES",
  B2_OMEGA_OX: "A4_BETA_OX",
  B3_REDOX_GSH: "B1_GSH",
  B4_PROPIONATE_ANAPLEROSIS: "E5_LYSINE",
  C1_LIVER_CONTEXT: "F4_BILE_DECONJ",
  C1A_BILE_FLOW: "F4_BILE_DECONJ",
  C1B_GLUCURO: "B5_GLUCURONIDATION",
  C1C_GLYCINE_CONJ: "B6_XENO",
  C1D_UREA_AMMONIA: "E1_UREA",
  C1E_AROMATIC_AA: "E4_AROMATIC",
  C2_KIDNEY_CLEARANCE: "E1_UREA",
  D1_METHIONINE_CORE: "D1_METHYLATION",
  D2_BHMT: "D5_CHOLINE",
  D3_FOLATE_SUPPLY: "D2_FOLATE",
  D4_TRANSSULF: "D3_TRANSSULFURATION",
  D5_POLYAMINES: "D6_POLYAMINE",
  D6_CARNITINE_BIOSYN: "E5_LYSINE",
  E1_NO_AXIS: "C6_NO",
  E2_TH1_IFN_KYN: "C2_QUINOLINIC",
  F1_INDOLES_AHR: "F3_INDOLE",
  F2_AROMATIC_FERMENT: "F2_PHENYL_MICROBIOME",
  F3_TMA_TMAO: "F6_TMAO",
  F4_PROTEIN_PUTREF: "D6_POLYAMINE",
  F5_POLYOLS_YEAST: "F5_YEAST",
  G1_SEROTONIN_MEL: "G3_SEROTONIN",
  G2_KYN_NEURO: "C2_QUINOLINIC",
  G3_CATECHOL_TURN: "G2_CATECHOL",
  G4_GABA_SHUNT: "G1_GABA",
  G5_CHOLINERGIC: "D5_CHOLINE",
  G6_METHYLXANTHINES: "B6_XENO",
};

const metadataByExactId = new Map<string, AnalyteMetadata>();
const metadataByNormalized = new Map<string, AnalyteMetadata>();
const validationIssues: string[] = [];

const resolvePathwayDisplay = (pathwayId: string) => PATHWAY_BY_ID.get(pathwayId);

export const analyteSlug = (metadata: Pick<AnalyteMetadata, "id" | "slug">) =>
  metadata.slug ?? metadata.id;

const enrichedData: AnalyteMetadata[] = rawData.map((entry) => {
  if (!entry.id) {
    validationIssues.push(`Missing id for analyte "${entry.displayName}"`);
    return entry;
  }

  if (!entry.displayName) {
    validationIssues.push(`Missing displayName for analyte id "${entry.id}"`);
  }
  if (!entry.slug && !URL_SAFE_ID.test(entry.id)) {
    validationIssues.push(`Analyte "${entry.id}" should define a URL-safe slug for routing/asset paths.`);
  }

  const normalizedId = normalizeName(entry.id);
  const resolvedPathways = new Set<string>();

  (entry.pathways ?? []).forEach((legacyId) => {
    const canonicalId = LEGACY_PATHWAY_ID_MAP[legacyId] ?? legacyId;
    if (!resolvePathwayDisplay(canonicalId)) {
      validationIssues.push(`Unknown pathway "${legacyId}" for analyte "${entry.displayName}"`);
      return;
    }
    resolvedPathways.add(canonicalId);
  });

  (PATHWAYS_BY_ANALYTE.get(normalizedId) ?? []).forEach((definition) => {
    resolvedPathways.add(definition.id);
  });

  const sortedPathways = Array.from(resolvedPathways).sort(
    (a, b) =>
      (PATHWAY_ORDER_INDEX.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (PATHWAY_ORDER_INDEX.get(b) ?? Number.MAX_SAFE_INTEGER),
  );

  if (sortedPathways.length === 0) {
    validationIssues.push(`No pathways assigned to "${entry.displayName}" (${entry.id})`);
  }

  const enriched: AnalyteMetadata = { ...entry, pathways: sortedPathways };

  metadataByExactId.set(enriched.id, enriched);

  const normalizedDisplay = normalizeName(enriched.displayName);
  metadataByNormalized.set(normalizedId, enriched);
  metadataByNormalized.set(normalizedDisplay, enriched);

  (enriched.synonyms ?? []).forEach((synonym) => {
    const normalizedSyn = normalizeName(synonym);
    if (!metadataByNormalized.has(normalizedSyn)) {
      metadataByNormalized.set(normalizedSyn, enriched);
    }
  });

  return enriched;
});

if (import.meta.env?.DEV && validationIssues.length > 0) {
  // eslint-disable-next-line no-console
  console.warn("[analyte-metadata] Validation issues detected:", validationIssues);
}

export const ANALYTE_METADATA: AnalyteMetadata[] = enrichedData;

export const ANALYTE_METADATA_BY_ID = metadataByExactId;

export const ANALYTE_METADATA_BY_NORMALIZED = metadataByNormalized;

export const getPathwaysForAnalyte = (metadata?: AnalyteMetadata) => {
  if (!metadata) return [];
  return (metadata.pathways ?? [])
    .map((id) => PATHWAY_BY_ID.get(id))
    .filter((definition): definition is PathwayDefinition => Boolean(definition));
};

export const findAnalyteMetadata = (idOrName?: string) => {
  if (!idOrName) return undefined;
  return metadataByExactId.get(idOrName) ?? metadataByNormalized.get(normalizeName(idOrName));
};

export const getAnalyteMetadataIssues = () => [...validationIssues];
