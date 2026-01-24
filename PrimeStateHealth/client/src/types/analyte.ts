export type AnalyteCategory =
  | "Energy"
  | "FAO"
  | "BCAA"
  | "Redox"
  | "Methylation"
  | "Liver"
  | "Kidney"
  | "Gut"
  | "CNS"
  | "Vascular"
  | "Exposure";

export type PreanalyticRisk = "High" | "Medium" | "Low";

export interface AnalyteMetadata {
  id: string;
  displayName: string;
  commonName?: string | null;
  slug?: string | null;
  hmdbId?: string | null;
  category: AnalyteCategory | null;
  preanalyticRisk: PreanalyticRisk | null;
  matrix?: string | null;
  synonyms: string[];
  pathways: string[];
  cas: string | null;
  casPrimary?: string | null;
  casRelated?: string[] | null;
  pubchemCid: number | null;
  smiles: string | null;
  inchi?: string | null;
  inchiKey: string | null;
  formula: string | null;
  molecularWeight: number | null;
  monoisotopicMass: number | null;
  structureImagePath: string | null;
  contextRanges?: Array<{
    low?: number | null;
    high?: number | null;
    unit: string;
    matrix?: string | null;
    rangeType?: string | null;
    sourceNote?: string | null;
    pmid?: string | null;
  }>;
  notes?: string[];
}

export type AnalyteMetadataRecord = AnalyteMetadata;
