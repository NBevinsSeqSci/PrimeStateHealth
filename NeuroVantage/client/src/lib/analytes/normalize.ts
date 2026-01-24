import { ANALYTE_ALIASES } from "./analyteAliases";

const GREEK: Record<string, string> = {
  α: "alpha",
  β: "beta",
  γ: "gamma",
  δ: "delta",
  ω: "omega",
  μ: "mu",
};

const CONTROLLED = new Map<string, string>();
Object.entries(ANALYTE_ALIASES).forEach(([target, aliases]) => {
  aliases.forEach((alias) => {
    const normalizedAlias = alias
      .normalize("NFKD")
      .split("")
      .map((char) => GREEK[char] ?? char)
      .join("")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[\s_\-()/[\],.]+/g, "")
      .replace(/[^a-z0-9]/g, "");
    CONTROLLED.set(normalizedAlias, target);
  });
});

export const normalizeName = (value: string): string => {
  if (!value) return "";
  const stripped = value
    .normalize("NFKD")
    .split("")
    .map((char) => GREEK[char] ?? char)
    .join("")
    .replace(/[\u0300-\u036f]/g, "");

  const lowered = stripped.toLowerCase();
  const cleaned = lowered
    .replace(/[\s_\-()/[\],.]+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return CONTROLLED.get(cleaned) ?? cleaned;
};
