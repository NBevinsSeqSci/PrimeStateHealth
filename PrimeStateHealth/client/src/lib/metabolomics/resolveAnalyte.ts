import type { AnalyteDef } from "@/lib/analytes/types";

export function resolveAnalyteSlug(requested: string, registry: AnalyteDef[]): string | null {
  const key = requested.trim().toLowerCase();
  const direct = registry.find((item) => item.id.toLowerCase() === key || item.display.toLowerCase() === key);
  if (direct) return direct.id;
  const alias = registry.find((item) => (item.aliases ?? []).some((entry) => entry.trim().toLowerCase() === key));
  return alias ? alias.id : null;
}
