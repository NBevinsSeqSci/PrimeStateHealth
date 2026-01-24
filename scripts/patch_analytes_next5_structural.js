const fs = require("fs");
const path = require("path");

const ANALYTES_JSON = process.env.ANALYTES_JSON;
if (!ANALYTES_JSON) {
  console.error("ERROR: Set env var ANALYTES_JSON to the path of analytes.json (found via find).");
  process.exit(1);
}

const raw = fs.readFileSync(ANALYTES_JSON, "utf8");
let analytes = JSON.parse(raw);

function setIfMissing(obj, key, value) {
  if (obj[key] === undefined) obj[key] = value;
}

function patch(id, updater) {
  const idx = analytes.findIndex(a => a.id === id);
  if (idx === -1) throw new Error(`Missing analyte id: ${id}`);
  analytes[idx] = updater({ ...analytes[idx] });
}

function cleanSynonyms(list) {
  const badPrefixes = [
    "SCHEMBL", "DTXSID", "Q", "ST", "SY", "UNII", "RefChem:", "CHEMBL", "Gmelin:", "Beilstein:"
  ];
  const out = [];
  const seen = new Set();
  for (const s of (list || [])) {
    if (!s) continue;
    const t = String(s).trim();
    if (!t) continue;
    if (t.length > 80) continue;
    if (t.includes("...")) continue;
    if (/^[^A-Za-z0-9]+$/.test(t)) continue;
    if (badPrefixes.some(p => t.startsWith(p))) continue;
    if (/^[A-Z0-9]{8,}$/.test(t)) continue; // drop pure ID-like tokens
    const norm = t.toLowerCase();
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(t);
  }
  return out;
}

patch("2methylcitric", (a) => {
  // Audit findings:
  // - CAS 6061-96-7, CID 515, InChIKey YNOXCRMFGMSKIJ... look consistent.
  // - Missing SMILES.
  // - Synonyms list is noisy; curate.
  a.category = "Energy"; // more consistent with propionate/anaplerosis than "Redox"
  a.smiles = "CC(C(=O)O)C(CC(=O)O)(C(=O)O)O"; // PubChemLite CID 515
  a.synonyms = cleanSynonyms([
    "2-methylcitric acid",
    "Methylcitric acid",
    "2-methylcitrate",
    "2-hydroxybutane-1,2,3-tricarboxylic acid",
    ...(a.synonyms || []),
  ]);
  setIfMissing(a, "casPrimary", a.cas);
  setIfMissing(a, "casRelated", null);
  setIfMissing(a, "notes", []);
  a.notes = Array.from(new Set([
    ...(a.notes || []),
    "Structural fields (SMILES/InChIKey) aligned to PubChemLite CID 515 (2-methylcitric acid)."
  ]));
  return a;
});

patch("2oxobutyric", (a) => {
  // Audit findings:
  // - CAS 600-18-0, CID 58, InChIKey TYEYBOS... consistent.
  // - Missing SMILES.
  // - Category 'Redox' not ideal; this is a keto-acid tied to AA catabolism + propionate entry.
  a.category = "Energy";
  a.smiles = "CCC(=O)C(=O)O"; // PubChemLite CID 58
  a.synonyms = cleanSynonyms([
    "2-oxobutyric acid",
    "2-oxobutanoic acid",
    "2-ketobutyric acid",
    "alpha-ketobutyric acid",
    "propionylformic acid",
    "2-oxobutyrate",
    ...(a.synonyms || []),
  ]);
  setIfMissing(a, "casPrimary", a.cas);
  setIfMissing(a, "casRelated", null);
  setIfMissing(a, "notes", []);
  a.notes = Array.from(new Set([
    ...(a.notes || []),
    "Structural fields (SMILES/InChIKey) aligned to PubChemLite CID 58 (2-oxobutanoic acid)."
  ]));
  return a;
});

patch("2oxoglutaric", (a) => {
  // Audit findings:
  // - This record is the dianion (2-oxoglutarate(2-)), not the neutral acid.
  // - CAS 64-15-3 + formula C5H4O5-2 + InChIKey ...-L are appropriate for the 2- charge state.
  // - Missing SMILES.
  a.smiles = "[O-]C(=O)CCC(=O)C([O-])=O"; // Rhea/ChEBI entry for 2-oxoglutarate(2-)
  a.synonyms = cleanSynonyms([
    "alpha-ketoglutarate",
    "2-oxoglutarate",
    "2-ketoglutarate",
    "2-oxopentanedioate",
    "2-oxoglutaric acid",
    ...(a.synonyms || []),
  ]);
  setIfMissing(a, "casPrimary", a.cas);
  setIfMissing(a, "casRelated", null);
  setIfMissing(a, "notes", []);
  a.notes = Array.from(new Set([
    ...(a.notes || []),
    "Record represents 2-oxoglutarate(2-) (dianion). SMILES aligned to Rhea/ChEBI: [O-]C(=O)CCC(=O)C([O-])=O."
  ]));
  return a;
});

patch("2oxoisocaproic", (a) => {
  // Audit findings:
  // - CAS 816-66-0 correct for 4-methyl-2-oxovaleric acid (alpha-ketoisocaproic acid).
  // - InChIKey BKAJNAX... matches Sigma.
  // - Missing SMILES.
  a.smiles = "CC(C)CC(=O)C(O)=O"; // Sigma (4-Methyl-2-oxovaleric acid)
  a.synonyms = cleanSynonyms([
    "2-oxoisocaproic acid",
    "alpha-ketoisocaproic acid",
    "4-methyl-2-oxovaleric acid",
    "4-methyl-2-oxopentanoic acid",
    "ketoleucine",
    ...(a.synonyms || []),
  ]);
  setIfMissing(a, "casPrimary", a.cas);
  setIfMissing(a, "casRelated", null);
  setIfMissing(a, "notes", []);
  a.notes = Array.from(new Set([
    ...(a.notes || []),
    "Structural fields (SMILES/InChIKey) aligned to Sigma listing for 4-methyl-2-oxovaleric acid (CAS 816-66-0)."
  ]));
  return a;
});

patch("2oxoisovaleric", (a) => {
  // Audit findings:
  // - This is alpha-ketoisovaleric acid = 3-methyl-2-oxobutanoic acid (valine keto-acid).
  // - CAS 759-05-7 and InChIKey QHKABHOO... are consistent.
  // - Missing SMILES.
  a.smiles = "CC(C)C(=O)C(O)=O"; // HMDB alpha-ketoisovaleric acid
  a.synonyms = cleanSynonyms([
    "2-oxoisovaleric acid",
    "alpha-ketoisovaleric acid",
    "3-methyl-2-oxobutanoic acid",
    "2-ketoisovaleric acid",
    "ketovaline",
    ...(a.synonyms || []),
  ]);
  setIfMissing(a, "casPrimary", a.cas);
  setIfMissing(a, "casRelated", null);
  setIfMissing(a, "notes", []);
  a.notes = Array.from(new Set([
    ...(a.notes || []),
    "SMILES aligned to HMDB entry for alpha-ketoisovaleric acid (3-methyl-2-oxobutanoic acid)."
  ]));
  return a;
});

fs.writeFileSync(ANALYTES_JSON, JSON.stringify(analytes, null, 2) + "\n");
console.log(`Patched: ${ANALYTES_JSON}`);
