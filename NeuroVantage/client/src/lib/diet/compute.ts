import { normalizeName } from "@/lib/analytes/normalize";
import type { MetaboliteResult } from "@/lib/pathways/types";
import { buildEvidenceItem, type DietEvidenceItem } from "@/lib/diet/format";

export const buildResultMap = (results: MetaboliteResult[]) => {
  const map = new Map<string, MetaboliteResult>();
  results.forEach((result) => {
    if (!result?.name) return;
    const key = normalizeName(result.name);
    if (!map.has(key)) {
      map.set(key, result);
    }
  });
  return map;
};

export const getResult = (map: Map<string, MetaboliteResult>, key: string) => map.get(normalizeName(key));

export const isHigh = (result: MetaboliteResult | undefined, threshold = 1) =>
  result?.zScore != null && result.zScore >= threshold;

export const isLow = (result: MetaboliteResult | undefined, threshold = -1) =>
  result?.zScore != null && result.zScore <= threshold;

export const collectEvidence = (
  items: Array<{ id: string; label: string; result?: MetaboliteResult; direction?: "up" | "down" }>,
) =>
  items
    .map(({ id, label, result, direction }) => buildEvidenceItem({ id, label, result, direction }))
    .filter(Boolean) as DietEvidenceItem[];

export const splitEvidence = (items: DietEvidenceItem[]) => {
  if (!items || items.length === 0) {
    return { top: [], all: undefined } as { top: DietEvidenceItem[]; all?: DietEvidenceItem[] };
  }
  const top = items.slice(0, 3);
  const all = items.length > 3 ? items : undefined;
  return { top, all };
};
