import { normalizeName } from "./normalize";
import type { AnalyteDef, AnalyteRow } from "./types";
import type { MetaboliteResult, PathwayDefinition } from "@/lib/pathways/types";
import { findAnalyteMetadata, getPathwaysForAnalyte } from "./metadata";

export function buildAnalyteRows(
  registry: AnalyteDef[],
  results: MetaboliteResult[] = [],
  _pathwaysByAnalyte?: Map<string, PathwayDefinition[]>,
): AnalyteRow[] {
  const resultMap = new Map<string, MetaboliteResult>();
  results.forEach((result) => {
    if (!result?.name) return;
    const normalized = normalizeName(result.name);
    if (!resultMap.has(normalized)) {
      resultMap.set(normalized, result);
    }
  });

  return registry.map((def) => {
    const normalizedAliases = (def.aliases ?? []).map((alias) => normalizeName(alias));
    const candidateKeys = [def.normalized, ...normalizedAliases];
    let matchedResult: MetaboliteResult | undefined;

    for (const key of candidateKeys) {
      const possible = resultMap.get(key);
      if (possible) {
        matchedResult = possible;
        break;
      }
    }

    const metadata = findAnalyteMetadata(def.id) ?? findAnalyteMetadata(def.display);
    const pathways: PathwayDefinition[] = metadata ? getPathwaysForAnalyte(metadata) : [];

    return {
      def,
      result: matchedResult,
      matchedName: matchedResult?.name,
      pathways,
    } satisfies AnalyteRow;
  });
}
