import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PATHWAY_REGISTRY } from "../client/src/data/pathwayRegistry";
import { normalizeName } from "../client/src/lib/analytes/normalize";

type AnalyteRecord = { id?: string };

type MissingBuckets = {
  required: Map<string, string>;
  optional: Map<string, string>;
  calculations: Map<string, string>;
};

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const analytesPath = path.join(rootDir, "client/src/data/analytes.json");
const analytesRaw = JSON.parse(readFileSync(analytesPath, "utf8")) as AnalyteRecord[];

const analyteIds = analytesRaw.map((entry) => entry.id).filter(Boolean) as string[];
const analyteSet = new Set(analyteIds.map((id) => normalizeName(id)));
const referenced = new Set<string>();
const missing: MissingBuckets = {
  required: new Map<string, string>(),
  optional: new Map<string, string>(),
  calculations: new Map<string, string>(),
};

const recordAnalyte = (id: string | undefined, bucket: keyof MissingBuckets) => {
  if (!id) return;
  const normalized = normalizeName(id);
  referenced.add(normalized);
  if (!analyteSet.has(normalized) && !missing[bucket].has(normalized)) {
    missing[bucket].set(normalized, id);
  }
};

PATHWAY_REGISTRY.forEach((definition) => {
  definition.requiredAnalytes.forEach((id) => recordAnalyte(id, "required"));
  (definition.optionalAnalytes ?? []).forEach((id) => recordAnalyte(id, "optional"));

  (definition.calculations.metaboliteLines ?? []).forEach((line) => recordAnalyte(line.analyteId, "calculations"));

  const ratioDefinitions = definition.calculations.ratioDefinitions?.length
    ? definition.calculations.ratioDefinitions
    : definition.calculations.ratioDefinition
      ? [definition.calculations.ratioDefinition]
      : [];
  ratioDefinitions.forEach((ratio) => {
    recordAnalyte(ratio.numeratorAnalyteId, "calculations");
    recordAnalyte(ratio.denominatorAnalyteId, "calculations");
  });
});

const formatList = (values: Iterable<string>) => Array.from(values).sort();
const missingRequired = formatList(missing.required.values());
const missingOptional = formatList(missing.optional.values());
const missingCalculations = formatList(missing.calculations.values());

const unusedAnalytes = analyteIds
  .filter((id) => !referenced.has(normalizeName(id)))
  .sort();

const printSection = (title: string, values: string[]) => {
  if (values.length === 0) {
    console.log(`${title}: none`);
    return;
  }
  console.log(`${title} (${values.length}):`);
  values.forEach((value) => console.log(`  - ${value}`));
};

console.log("Pathway analyte validation");
console.log(`Analytes in registry: ${analyteIds.length}`);
console.log(`Referenced analytes: ${referenced.size}`);
console.log("");

printSection("Missing required analyte IDs", missingRequired);
printSection("Missing optional analyte IDs", missingOptional);
printSection("Missing calculation analyte IDs", missingCalculations);
console.log("");
printSection("Unused analyte IDs", unusedAnalytes);

if (missingRequired.length > 0) {
  process.exitCode = 1;
}
