const fs = require("fs");
const path = require("path");

const analytesPath = path.resolve(__dirname, "../client/src/data/analytes.json");
const raw = fs.readFileSync(analytesPath, "utf8");
const data = JSON.parse(raw);

const updates = new Map([
  ["2hydroxy2methylbutyric", {
    displayName: "2-hydroxy-2-methylbutyric acid",
    cas: "3739-30-8",
    pubchemCid: 95433,
    inchiKey: "MBIQENSCDNJOIY-UHFFFAOYSA-N",
    formula: "C5H10O3",
    molecularWeight: 118.13,
    smiles: "CCC(C)(O)C(O)=O",
  }],
  ["4hydroxyphenylacetic", {
    displayName: "4-hydroxyphenylacetic acid",
    cas: "156-38-7",
    pubchemCid: 127,
    inchiKey: "XQXPVVBIMDBYFF-UHFFFAOYSA-N",
    formula: "C8H8O3",
    molecularWeight: 152.15,
    smiles: "C1=CC(=CC=C1CC(=O)O)O",
  }],
  ["4hydroxyphenyllactic", {
    displayName: "4-hydroxyphenyllactic acid (DL)",
    cas: "306-23-0",
    pubchemCid: 9378,
    inchiKey: "JVGVDSSUAVXRDY-UHFFFAOYSA-N",
    formula: "C9H10O4",
    molecularWeight: 182.18,
    smiles: "OC(CC1=CC=C(O)C=C1)C(O)=O",
  }],
  ["4hydroxyphenylpyruvic", {
    displayName: "4-hydroxyphenylpyruvic acid",
    cas: "156-39-8",
    pubchemCid: 979,
    inchiKey: "KKADPXVIOXHVKN-UHFFFAOYSA-N",
    formula: "C9H8O4",
    molecularWeight: 180.16,
    smiles: "O=C(C(C1=CC=C(O)C=C1)=O)C(O)=O",
  }],
  ["cinnamoylglycinetrans", {
    displayName: "trans-cinnamoylglycine",
    cas: "16534-24-0",
    pubchemCid: 709625,
    inchiKey: "YAADMLFKJYYLSV-ONEGZZNKSA-N",
    formula: "C11H11NO3",
    molecularWeight: 205.21,
    smiles: "O=C(O)CNC(=O)\\C=C\\c1ccccc1",
  }],
  ["lauroylcholine", {
    displayName: "lauroylcholine (chloride)",
    cas: "25234-60-0",
    pubchemCid: 91343,
    inchiKey: "BBJUKTBDSGQHSH-WFMPWKQPSA-M",
    formula: "C17H36ClNO2",
    molecularWeight: 321.93,
    smiles: "CCCCCCCCCCCC(=O)OCC[N+](C)(C)C.[Cl-]",
  }],
  ["myristoylcholine", {
    displayName: "myristoylcholine (chloride)",
    cas: "4277-89-8",
    pubchemCid: 77963,
    inchiKey: "CNJMYRYCYNAIOF-UHFFFAOYSA-M",
    formula: "C19H40ClNO2",
    molecularWeight: 349.98,
    smiles: "CCCCCCCCCCCCCC(=O)OCC[N+](C)(C)C.[Cl-]",
  }],
  ["trimethyllysine", {
    displayName: "N6-trimethyllysine",
    cas: "19253-88-4",
    pubchemCid: 440120,
    inchiKey: "MXNRLFUSFKVQSK-QMMMGPOBSA-N",
    formula: "C9H20N2O2",
    molecularWeight: 188.27,
    smiles: "C[N+](C)(C)CCCC[C@H](N)C(=O)O",
  }],
  ["butyrate", {
    pubchemCid: 264,
    smiles: "CCCC(=O)O",
  }],
  ["propionate", {
    pubchemCid: 1032,
    smiles: "CCC(=O)O",
  }],
  ["nad", {
    displayName: "NAD+ (oxidized)",
    pubchemCid: 15938971,
    inchiKey: "BAWFJGJZGIEFAR-WIWLTUSXNA-N",
    smiles:
      "NC(=O)C1=CC=C[N+](=C1)[C@@H]1O[C@H](COP([O-])(=O)OP(O)(=O)OC[C@H]2O[C@H]([C@H](O)[C@@H]2O)N2C=NC3=C(N)N=CN=C23)[C@@H](O)[C@H]1O",
  }],
]);

const MONOISOTOPIC_MASS = {
  C: 12.0,
  H: 1.00782503223,
  N: 14.00307400443,
  O: 15.99491461957,
  P: 30.97376199842,
  S: 31.9720711744,
  Cl: 34.968852682,
  Na: 22.989769282,
  K: 38.9637064864,
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const computeMonoisotopicMass = (formula) => {
  if (!formula || typeof formula !== "string") return null;
  const pattern = /([A-Z][a-z]?)(\d*)/g;
  let match;
  let total = 0;
  while ((match = pattern.exec(formula))) {
    const element = match[1];
    const count = match[2] ? Number(match[2]) : 1;
    const mass = MONOISOTOPIC_MASS[element];
    if (!mass || !Number.isFinite(count)) return null;
    total += mass * count;
  }
  if (!Number.isFinite(total) || total === 0) return null;
  return Math.round(total * 1e6) / 1e6;
};

if (!Array.isArray(data)) {
  throw new Error("Expected analytes.json to be an array.");
}

const byId = new Map(data.map((entry) => [entry.id, entry]));

updates.forEach((update, id) => {
  const target = byId.get(id);
  if (!target) {
    throw new Error(`Missing analyte id: ${id}`);
  }
  Object.entries(update).forEach(([key, value]) => {
    target[key] = value;
  });
});

data.forEach((entry) => {
  if (!entry.structureImagePath || String(entry.structureImagePath).trim() === "") {
    entry.structureImagePath = `/structures/${slugify(entry.id)}.png`;
  }
  if (entry.casPrimary == null) {
    entry.casPrimary = entry.cas ?? null;
  }
  if (entry.casRelated == null) {
    entry.casRelated = [];
  }
  if (!Array.isArray(entry.casRelated)) {
    entry.casRelated = [];
  }
  if (entry.monoisotopicMass == null && entry.formula) {
    const mass = computeMonoisotopicMass(entry.formula);
    if (mass != null) {
      entry.monoisotopicMass = mass;
    }
  }
});

fs.writeFileSync(analytesPath, `${JSON.stringify(data, null, 2)}\n`);
console.log("analytes.json patched");
