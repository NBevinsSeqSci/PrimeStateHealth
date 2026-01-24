import type { MetaboliteResult, PathwayDefinition } from "@/lib/pathways/types";
import type { AnalyteCategory, PreanalyticRisk } from "@/types/analyte";

export type AnalyteId = string;

export type AnalyteDef = {
  id: AnalyteId;
  display: string;
  normalized: string;
  aliases?: string[];
  category?: AnalyteCategory;
  preanalyticRisk?: PreanalyticRisk;
};

export type AnalyteRow = {
  def: AnalyteDef;
  result?: MetaboliteResult;
  matchedName?: string;
  pathways?: PathwayDefinition[];
};
