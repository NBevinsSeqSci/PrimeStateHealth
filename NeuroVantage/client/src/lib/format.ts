export function formatNumber(value: number | null, digits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
}

export function formatMs(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)} ms`;
}

export function formatPercent(value: number | null, digits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatScore(value: number | null, suffix = "") {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value}${suffix}`;
}
