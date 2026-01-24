export type Unit = "uM" | "mmol/L" | "mg/L" | "%" | "ratio";

export type Measurement = {
  value: number | null;
  unit: Unit;
  loq?: number | null;
  censored?: "LT_LOQ" | "ND";
};

export type DisplayValue =
  | { kind: "NUM"; text: string; numeric: number }
  | { kind: "LT_LOQ"; text: string }
  | { kind: "ND"; text: string }
  | { kind: "MISSING"; text: string };

export function formatMeasurement(m: Measurement, digits = 2): DisplayValue {
  if (m.value === null || Number.isNaN(m.value)) return { kind: "MISSING", text: "-" };

  if (m.censored === "ND") return { kind: "ND", text: "Not detected" };
  if (m.censored === "LT_LOQ" && (m.loq ?? null) !== null) {
    return { kind: "LT_LOQ", text: `<${trimZeros(m.loq!, digits)} ${m.unit}` };
  }

  if (m.value < 0) {
    if ((m.loq ?? null) !== null) return { kind: "LT_LOQ", text: `<${trimZeros(m.loq!, digits)} ${m.unit}` };
    return { kind: "ND", text: "Not detected" };
  }

  if ((m.loq ?? null) !== null && m.value < m.loq!) {
    return { kind: "LT_LOQ", text: `<${trimZeros(m.loq!, digits)} ${m.unit}` };
  }

  return { kind: "NUM", text: `${trimZeros(m.value, digits)} ${m.unit}`, numeric: m.value };
}

function trimZeros(v: number, digits: number) {
  return v.toFixed(digits).replace(/\.?0+$/, "");
}
