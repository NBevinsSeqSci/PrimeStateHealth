#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATA_PATH = path.join(ROOT, "client/src/data/analytes.json");

const analytes = JSON.parse(await readFile(DATA_PATH, "utf8"));

const errors = [];
const seenIds = new Set();

analytes.forEach((record) => {
  if (!record.id || typeof record.id !== "string") {
    errors.push(`Missing id for record ${record.displayName ?? "unknown"}`);
    return;
  }
  if (seenIds.has(record.id)) {
    errors.push(`Duplicate analyte id detected: ${record.id}`);
  }
  seenIds.add(record.id);

  if (!record.displayName) {
    errors.push(`Analyte ${record.id} is missing a displayName`);
  }

  if (!Array.isArray(record.synonyms)) {
    errors.push(`Analyte ${record.displayName} has invalid synonyms shape`);
  }

  if (!Array.isArray(record.pathways) || record.pathways.length === 0) {
    errors.push(`Analyte ${record.displayName} must be associated with at least one pathway id`);
  }

  if (!("category" in record)) {
    errors.push(`Analyte ${record.displayName} is missing category`);
  }

  if (!("preanalyticRisk" in record)) {
    errors.push(`Analyte ${record.displayName} is missing preanalyticRisk`);
  }

  if ("contextRanges" in record && record.contextRanges != null) {
    if (!Array.isArray(record.contextRanges)) {
      errors.push(`Analyte ${record.displayName} has invalid contextRanges shape`);
    } else {
      record.contextRanges.forEach((range, index) => {
        if (!range || typeof range.unit !== "string" || range.unit.trim() === "") {
          errors.push(`Analyte ${record.displayName} has contextRanges[${index}] without a unit`);
        }
      });
    }
  }
});

if (errors.length > 0) {
  console.error("Analyte metadata failed validation:");
  errors.forEach((error) => console.error(`  • ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${analytes.length} analytes from ${path.relative(ROOT, DATA_PATH)}.`);
}
