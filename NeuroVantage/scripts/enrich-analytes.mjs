#!/usr/bin/env node
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATA_PATH = path.join(ROOT, "client/src/data/analytes.json");
const CACHE_DIR = path.join(ROOT, "scripts/.cache/pubchem");
const STRUCTURE_DIR = path.join(ROOT, "client/public/structures");

const args = new Set(process.argv.slice(2));
const refresh = args.has("--refresh");

await mkdir(CACHE_DIR, { recursive: true });
await mkdir(STRUCTURE_DIR, { recursive: true });

const analytes = JSON.parse(await readFile(DATA_PATH, "utf8"));

const unresolvedCid = [];
const missingCas = [];
const missingStructure = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const SAFE_DELAY_MS = 150;

const sanitizeFileName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const cachePathFor = (id) => path.join(CACHE_DIR, `${sanitizeFileName(id)}.json`);

const structurePathFor = (id) => path.join(STRUCTURE_DIR, `${sanitizeFileName(id)}.png`);

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
};

const fetchBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) return null;
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const fetchCidForQuery = async (query) => {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`;
  const data = await fetchJson(url);
  const cid = data?.IdentifierList?.CID?.[0];
  await delay(SAFE_DELAY_MS);
  return cid ?? null;
};

const fetchPropertiesForCid = async (cid) => {
  const props = [
    "CanonicalSMILES",
    "InChIKey",
    "MolecularFormula",
    "MolecularWeight",
    "MonoisotopicMass",
  ];
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/${props.join(
    ",",
  )}/JSON`;
  const data = await fetchJson(url);
  await delay(SAFE_DELAY_MS);
  return data?.PropertyTable?.Properties?.[0] ?? null;
};

const fetchSynonymsForCid = async (cid) => {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
  const data = await fetchJson(url);
  await delay(SAFE_DELAY_MS);
  return data?.InformationList?.Information?.[0]?.Synonym ?? [];
};

const downloadStructureImage = async (cid, filePath) => {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`;
  const buffer = await fetchBuffer(url);
  if (!buffer) return null;
  await writeFile(filePath, buffer);
  return `/structures/${path.basename(filePath)}`;
};

const readCache = async (id) => {
  try {
    const cacheRaw = await readFile(cachePathFor(id), "utf8");
    return JSON.parse(cacheRaw);
  } catch {
    return null;
  }
};

const writeCache = async (id, payload) => {
  await writeFile(cachePathFor(id), JSON.stringify(payload, null, 2));
};

const findCasFromSynonyms = (synonyms = []) => {
  const CAS_REGEX = /^\d{2,7}-\d{2}-\d$/;
  return synonyms.find((syn) => CAS_REGEX.test(syn));
};

const uniqList = (list) => Array.from(new Set(list.filter(Boolean)));

const updateAnalyteFromPubChem = async (record) => {
  const cache = !refresh ? await readCache(record.id) : null;
  if (cache && cache.cid) {
    return cache;
  }

  const queries = uniqList([record.displayName, ...(record.synonyms ?? [])]);
  for (const query of queries) {
    const cid = await fetchCidForQuery(query);
    if (!cid) continue;
    const properties = await fetchPropertiesForCid(cid);
    const synonyms = await fetchSynonymsForCid(cid);
    const structureFile = structurePathFor(record.id);
    const structureImagePath = await downloadStructureImage(cid, structureFile).catch(() => null);
    const payload = {
      cid,
      properties,
      synonyms,
      structureImagePath,
      query,
      fetchedAt: new Date().toISOString(),
    };
    await writeCache(record.id, payload);
    return payload;
  }

  const noHitPayload = {
    cid: null,
    synonyms: [],
    properties: null,
    structureImagePath: null,
    queries,
    fetchedAt: new Date().toISOString(),
  };
  await writeCache(record.id, noHitPayload);
  return noHitPayload;
};

for (const record of analytes) {
  try {
    const payload = await updateAnalyteFromPubChem(record);
    if (!payload || !payload.cid) {
      unresolvedCid.push(record.displayName);
      missingStructure.push(record.displayName);
      if (!record.cas) {
        missingCas.push(record.displayName);
      }
      continue;
    }

    record.pubchemCid = payload.cid;
    if (payload.properties?.CanonicalSMILES) {
      record.smiles = payload.properties.CanonicalSMILES;
    }
    if (payload.properties?.InChIKey) {
      record.inchiKey = payload.properties.InChIKey;
    }
    if (payload.properties?.MolecularFormula) {
      record.formula = payload.properties.MolecularFormula;
    }
    if (payload.properties?.MolecularWeight != null) {
      record.molecularWeight = Number(payload.properties.MolecularWeight);
    }
    if (payload.properties?.MonoisotopicMass != null) {
      record.monoisotopicMass = Number(payload.properties.MonoisotopicMass);
    }

    const combinedSynonyms = uniqList([
      ...(record.synonyms ?? []),
      ...(payload.synonyms ?? []),
      record.displayName,
    ]);
    record.synonyms = combinedSynonyms.sort((a, b) => a.localeCompare(b));

    if (!record.cas) {
      const cas = findCasFromSynonyms(combinedSynonyms);
      if (cas) {
        record.cas = cas;
      }
    }

    if (!record.cas) {
      missingCas.push(record.displayName);
    }

    if (payload.structureImagePath) {
      record.structureImagePath = payload.structureImagePath;
    } else {
      const expectedStructure = structurePathFor(record.id);
      try {
        await access(expectedStructure);
        record.structureImagePath = `/structures/${path.basename(expectedStructure)}`;
      } catch {
        record.structureImagePath ??= null;
        missingStructure.push(record.displayName);
      }
    }
  } catch (error) {
    console.error(`Failed to enrich ${record.displayName}:`, error.message);
    unresolvedCid.push(record.displayName);
  }
}

const nullableFields = [
  "cas",
  "pubchemCid",
  "smiles",
  "inchiKey",
  "formula",
  "molecularWeight",
  "monoisotopicMass",
  "structureImagePath",
];

analytes.forEach((record) => {
  nullableFields.forEach((field) => {
    if (!(field in record) || record[field] === undefined) {
      record[field] = null;
    }
  });
  if (!Array.isArray(record.synonyms)) {
    record.synonyms = [];
  }
});

await writeFile(DATA_PATH, JSON.stringify(analytes, null, 2));

console.log(`\nUpdated analyte metadata written to ${path.relative(ROOT, DATA_PATH)}`);

const summaryLine = (label, list) => {
  if (list.length === 0) {
    console.log(`${label}: none`);
    return;
  }
  console.log(`${label} (${list.length}):`);
  list.forEach((item) => console.log(`  • ${item}`));
};

console.log("\n==== Enrichment Report ====");
summaryLine("No PubChem CID match", unresolvedCid);
summaryLine("Missing CAS number", missingCas);
summaryLine("Missing structure image", missingStructure);
