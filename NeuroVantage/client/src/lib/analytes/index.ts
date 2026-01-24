import { ANALYTE_REGISTRY } from "./analyteRegistry";
import type { MetaboliteResult } from "@/lib/pathways/types";
import { buildAnalyteRows as buildRowsFromRegistry } from "./buildRows";

export const buildAnalyteRows = (results: MetaboliteResult[] = []) =>
  buildRowsFromRegistry(ANALYTE_REGISTRY, results);
