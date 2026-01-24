import type { MetaboliteResult } from "@/lib/pathways/types";
import { formatAnalyteValue } from "@/lib/analytes/format";

export type DietEvidenceItem = {
  id: string;
  label: string;
  analyte: string;
  value?: string;
  unit?: string;
  zScore?: number;
  direction?: "up" | "down";
};

export const buildEvidenceItem = ({
  id,
  label,
  result,
  direction,
}: {
  id: string;
  label: string;
  result?: MetaboliteResult;
  direction?: "up" | "down";
}): DietEvidenceItem | undefined => {
  if (!result) return undefined;
  const { value, unit } = formatAnalyteValue(result);
  const zScore = result.zScore;
  if (!value && !unit && zScore == null) return undefined;

  const resolvedDirection =
    direction ??
    (zScore != null ? (zScore >= 0 ? ("up" as const) : ("down" as const)) : undefined);

  return {
    id,
    label,
    analyte: result.name ?? label,
    value,
    unit,
    zScore,
    direction: resolvedDirection,
  };
};

export const sortEvidenceBySignificance = (items: DietEvidenceItem[] = []) =>
  [...items].sort((a, b) => {
    const aScore = Math.abs(a.zScore ?? 0);
    const bScore = Math.abs(b.zScore ?? 0);
    return bScore - aScore;
  });
