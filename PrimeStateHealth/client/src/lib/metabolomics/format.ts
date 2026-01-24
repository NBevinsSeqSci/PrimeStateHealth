export const formatZ = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const normalized = Object.is(value, -0) ? 0 : value;
  const sign = normalized >= 0 ? "+" : "";
  return `${sign}${normalized.toFixed(1)}σ`;
};
