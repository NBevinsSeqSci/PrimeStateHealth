import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicationsLinks } from "@/components/pathways/PublicationsLinks";
import { getAnalytePublications } from "@/data/analyteLiterature";
import { MoleculeRenderer } from "./MoleculeRenderer";
import type { AnalyteRow } from "@/lib/analytes/types";
import type { AnalyteMetadata } from "@/types/analyte";
import { analyteSlug } from "@/lib/analytes/metadata";
import {
  formatAnalyteValue,
  formatReferenceRange,
  formatZScore,
  hasMeasuredValue,
} from "@/lib/analytes/format";

interface AnalyteRowDetailsProps {
  row: AnalyteRow;
  metadata?: AnalyteMetadata;
  onPathwayNavigate?: (pathwayId: string) => void;
}

export function AnalyteRowDetails({ row, metadata, onPathwayNavigate }: AnalyteRowDetailsProps) {
  const pathways = row.pathways ?? [];
  const casValue = metadata?.casPrimary ?? metadata?.cas;
  const cas = casValue ?? "—";
  const relatedCas = metadata?.casRelated ?? [];
  const smiles = metadata?.smiles ?? undefined;
  const measured = hasMeasuredValue(row.result);
  const { value, unit } = formatAnalyteValue(row.result);
  const zScore = formatZScore(row.result?.zScore);
  const referenceRange = formatReferenceRange(row.result?.refRange) ?? "—";
  const structureImage =
    metadata?.structureImagePath ?? (metadata ? `/structures/${analyteSlug(metadata)}.png` : null);
  const analytePublications = getAnalytePublications(metadata?.displayName ?? row.def.display);
  const rangeLow = row.result?.refRange?.low;
  const rangeHigh = row.result?.refRange?.high;
  const numericValue = typeof row.result?.value === "number" ? row.result.value : undefined;
  const unitLabel = row.result?.unit;
  const normalizedId = row.def.id.toLowerCase();
  const hasNumericRange =
    typeof rangeLow === "number" &&
    typeof rangeHigh === "number" &&
    Number.isFinite(rangeLow) &&
    Number.isFinite(rangeHigh) &&
    rangeHigh > rangeLow;
  const showRangeGauge = measured && typeof numericValue === "number" && hasNumericRange;
  const gaugePosition = (() => {
    if (!showRangeGauge) return 0.5;
    const span = rangeHigh - rangeLow;
    const min = rangeLow - span;
    const max = rangeHigh + span;
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0.5;
    const normalized = (numericValue - min) / (max - min);
    return Math.min(1, Math.max(0, normalized));
  })();

  const INCHIKEY_REGEX = /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/;
  const identifierRows: Array<{ label: string; value?: string | null }> = [
    { label: "Formula", value: metadata?.formula },
    {
      label: "Molecular weight",
      value: metadata?.molecularWeight != null ? `${Number(metadata.molecularWeight).toFixed(2)} g/mol` : null,
    },
    {
      label: "Monoisotopic mass",
      value: metadata?.monoisotopicMass != null ? `${Number(metadata.monoisotopicMass).toFixed(2)} g/mol` : null,
    },
    {
      label: metadata?.inchiKey && INCHIKEY_REGEX.test(metadata.inchiKey) ? "InChIKey" : "InChI",
      value: metadata?.inchiKey && INCHIKEY_REGEX.test(metadata.inchiKey) ? metadata.inchiKey : metadata?.inchi,
    },
    { label: "InChI", value: metadata?.inchi },
    { label: "SMILES", value: smiles },
  ];
  const contextRanges = metadata?.contextRanges ?? [];
  const warnings: string[] = [];

  const normalizedUnit = unitLabel?.toLowerCase();
  if ((normalizedId === "butyrate" || normalizedId === "propionate") && normalizedUnit) {
    if (normalizedUnit.includes("mmol") || normalizedUnit.includes("mm") || normalizedUnit.includes("mg/dl")) {
      warnings.push("SCFA units usually reported in µM; verify unit conversion and matrix.");
    }
    if (typeof numericValue === "number" && normalizedUnit.includes("µm") && numericValue > 20) {
      warnings.push("SCFA value is unusually high for plasma; check matrix or unit scaling.");
    }
  }
  if (normalizedId === "nad" && typeof numericValue === "number" && normalizedUnit) {
    const matrix = metadata?.matrix;
    if (matrix === "plasma" && normalizedUnit.includes("µmol") && numericValue > 5) {
      warnings.push("Plasma NAD+ is typically sub‑µM; verify matrix or unit scaling.");
    }
    if (matrix === "whole_blood" && normalizedUnit.includes("µmol") && numericValue < 1) {
      warnings.push("Whole‑blood NAD+ is typically tens of µM; verify matrix or unit scaling.");
    }
  }
  if (normalizedId === "trimethylamine") {
    warnings.push("Do not confuse with TMAO; TMAO is typically higher.");
  }
  if (metadata?.notes?.length) {
    warnings.push(...metadata.notes);
  }

  const formatContextRange = (range: (typeof contextRanges)[number]) => {
    const low = typeof range.low === "number" ? range.low.toFixed(2) : null;
    const high = typeof range.high === "number" ? range.high.toFixed(2) : null;
    if (low && high) return `${low}–${high} ${range.unit}`;
    if (low) return `≥ ${low} ${range.unit}`;
    if (high) return `≤ ${high} ${range.unit}`;
    return null;
  };

  const handleCopy = (value?: string) => {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(value).catch(() => {});
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Measurement summary</p>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Value</p>
              <p className="font-mono text-base text-slate-900">
                {measured ? (
                  <>
                    {value}
                    {unit && <span className="font-sans text-xs text-slate-500"> {unit}</span>}
                  </>
                ) : (
                  "Not reported"
                )}
              </p>
            </div>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Z-score</p>
              <p className="font-mono text-base text-slate-900">{zScore ?? "—"}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Reference range</p>
              {showRangeGauge ? (
                <div className="mt-2">
                  <div className="relative h-6">
                    <div
                      className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #ef4444 0%, #f59e0b 22%, #22c55e 50%, #f59e0b 78%, #ef4444 100%)",
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${gaugePosition * 100}%` }}
                    >
                      <div className="flex flex-col items-center -translate-x-1/2">
                        <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-amber-400" />
                        <div className="-mt-1 h-3 w-3 rounded-full bg-black" />
                        <div className="-mt-1 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-400" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-600">{referenceRange}</p>
                </div>
              ) : (
                <p className="font-mono text-base text-slate-900">{referenceRange}</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pathways</p>
          {pathways.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pathways.map((pathway) => (
                <Badge
                  key={pathway.id}
                  variant="secondary"
                  className="cursor-pointer whitespace-nowrap text-[11px]"
                  onClick={() => onPathwayNavigate?.(pathway.id)}
                >
                  {pathway.framework}.{pathway.title}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">—</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Chemical structure</p>
          {structureImage ? (
            <div className="flex h-44 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-2">
              <img
                src={structureImage}
                alt={`Chemical structure for ${row.def.display}`}
                className="max-h-40 max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ) : smiles ? (
            <MoleculeRenderer smiles={smiles} />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              —
            </div>
          )}
          <dl className="mt-3 space-y-1 text-xs text-slate-600">
            {identifierRows.map(({ label, value }) => {
              if (!value) return null;
              return (
                <div key={label} className="flex items-center justify-between gap-2">
                  <dt className="font-semibold text-slate-500">{label}</dt>
                  <dd className="font-mono text-slate-900 break-all">{value}</dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">CAS number</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-slate-900">{cas}</p>
            {casValue && (
              <Button size="sm" variant="outline" onClick={() => handleCopy(casValue)}>
                Copy
              </Button>
            )}
          </div>
          {relatedCas.length > 0 && (
            <p className="text-xs text-slate-500">Related CAS: {relatedCas.join(", ")}</p>
          )}
          {metadata?.pubchemCid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${metadata.pubchemCid}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View on PubChem
            </a>
          )}
          <div className="mt-4">
            <PublicationsLinks entries={analytePublications} status="computed" />
          </div>
        </div>
      </div>
      {(warnings.length > 0 || contextRanges.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600">Guardrails</p>
              <ul className="mt-2 space-y-1">
                {warnings.map((warning) => (
                  <li key={warning}>- {warning}</li>
                ))}
              </ul>
            </div>
          )}
          {contextRanges.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-xs text-slate-700">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Literature context
              </p>
              <ul className="mt-2 space-y-1">
                {contextRanges.map((range, index) => (
                  <li key={`${range.matrix ?? "context"}-${index}`}>
                    <span className="font-semibold">{formatContextRange(range) ?? "—"}</span>
                    {range.matrix && <span className="text-slate-500"> · {range.matrix}</span>}
                    {range.rangeType && <span className="text-slate-500"> · {range.rangeType}</span>}
                    {range.sourceNote && (
                      <span className="block text-[11px] text-slate-500">{range.sourceNote}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
