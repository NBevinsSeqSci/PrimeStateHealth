// Analyte → PubMed references for the analyte detail drawer.
// Keys are lowercase for case-insensitive lookups.

export const analytePubMed: Record<string, string[]> = {
  // 3-hydroxyisovaleric acid reference interval context (serum organic acids LC-MS/MS)
  "3-hydroxyisovaleric": ["34943431"],
  // Decanoylcarnitine / acylcarnitine profiling references
  // ACMG Technical Standard (acylcarnitine analysis): PMID 33071282
  // Acylcarnitine profile analysis overview: PMID 18281923
  // Clinically validated LC-MS/MS quantification in human plasma: PMID 34954532
  decanoylcarnitine: ["33071282", "18281923", "34954532"],
  // Indole-3-aldehyde / indole-3-carboxaldehyde (IALD)
  // Anesi et al. provides plasma concentration ranges (µM): PMID 31683910
  // Cason et al. provides clinical association context: PMID 29248242
  "indole-3-aldehyde": ["31683910", "29248242"],
  "indole-3-carboxaldehyde": ["31683910", "29248242"],
  // Trimethylamine (TMA)
  // Controls: median (IQR) 114.5 (67.8–199.4) nmol/mL (= µM): PMID 31373635
  // LC-MS quant method (TMA/TMAO + precursors) in plasma/urine: PMID 34258650
  // Human plasma TMA measured alongside TMAO/choline etc: PMID 26864355
  trimethylamine: ["31373635", "34258650", "26864355"],
  // Glycocholic (glycocholic acid; GCA)
  // Quantification method (stable isotope dilution UPLC-ESI-MS/MS): PMID 29202363
  // Candidate reference measurement procedure for GCA: PMID 39046504
  glycocholic: ["29202363", "39046504"],
  "glycocholic acid": ["29202363", "39046504"],
  // Xanthosine
  // HMDB normal blood concentration entries reference: PMID 12675874 and PMID 16139832
  xanthosine: ["12675874", "16139832"],
  // Acetoacetic (acetoacetate)
  // Ketone body measurement/methodology context: PMID 28425001; PMID 27881484
  acetoacetic: ["28425001", "27881484"],
  "acetoacetic acid": ["28425001", "27881484"],
  // Hippuric (hippurate)
  // Plasma measurement ranges/methods and gut-derived aromatic metabolites context:
  // PMID 31683910; PMID 33556163
  hippuric: ["31683910", "33556163"],
  "hippuric acid": ["31683910", "33556163"],
  // 5-oxoproline (pyroglutamic acid; PGA)
  // Assay + control reference interval paper: PMID 28089749
  // Mechanism/review (acetaminophen & gamma-glutamyl cycle): PMID 24235282
  // Plasma L-5-oxoproline kinetics and glutathione synthesis context: PMID 11788355
  "5-oxoproline": ["28089749", "24235282", "11788355"],
  pyroglutamic: ["28089749", "24235282", "11788355"],
  "pyroglutamic acid": ["28089749", "24235282", "11788355"],
  // SAM (S-adenosylmethionine)
  // SAM/SAH LC-MS/MS quantification in plasma/serum (methods + clinical application)
  sam: ["11734539", "18603242", "24007663"],
  "s-adenosylmethionine": ["11734539", "18603242", "24007663"],
  // Carnitine (free L-carnitine)
  // Acylcarnitine/carnitine profiling overview: PMID 18281923
  // ACMG technical standard for acylcarnitine analysis: PMID 33071282
  // LC-MS/MS quantification of acylcarnitines in human plasma (methods): PMID 34954532
  carnitine: ["18281923", "33071282", "34954532"],
  "l-carnitine": ["18281923", "33071282", "34954532"],
  // Guanidinoacetic (guanidinoacetic acid; GAA)
  // Creatine biosynthesis + clinical biomarker context
  guanidinoacetic: ["17517637", "24682862", "28425001"],
  "guanidinoacetic acid": ["17517637", "24682862", "28425001"],
  // Lauroylcholine (dodecanoylcholine)
  // LC-MS methods measuring choline-related metabolites and TMA/TMAO axis context: PMID 26864355; PMID 34258650
  lauroylcholine: ["26864355", "34258650"],
  dodecanoylcholine: ["26864355", "34258650"],
  // Succinic semialdehyde (4-oxobutanoic acid)
  // SSADH deficiency natural history / biomarker work: PMID 33393837
  // Disease mechanisms review: PMID 20973619
  // Clinical review and emerging therapies: PMID 32093054
  "succinic semialdehyde": ["33393837", "20973619", "32093054"],
  "succinic acid semialdehyde": ["33393837", "20973619", "32093054"],
  "4-oxobutanoic": ["33393837", "20973619", "32093054"],
  "4-oxobutanoic acid": ["33393837", "20973619", "32093054"],
  // Kynurenine (L-kynurenine)
  // Kynurenine pathway / K/T ratio clinical & mechanistic context
  kynurenine: ["34670021", "30372813"],
  "l-kynurenine": ["34670021", "30372813"],
  // Suberic (suberate; octanedioic acid)
  // Context: fatty-acid oxidation / organic acid patterns and acylcarnitine profiling
  suberic: ["18281923", "33071282"],
  suberate: ["18281923", "33071282"],
  octanedioic: ["18281923", "33071282"],
  "octanedioic acid": ["18281923", "33071282"],
  // Anthranilic acid (2-aminobenzoic acid)
  // Kynurenine pathway branch metabolites context
  anthranilic: ["34670021", "30372813"],
  "anthranilic acid": ["34670021", "30372813"],
  "2-aminobenzoic": ["34670021", "30372813"],
  "2-aminobenzoic acid": ["34670021", "30372813"],
  // Azelaic (azelaic acid; nonanedioic acid)
  // Context: fatty-acid oxidation / omega-oxidation backup and dicarboxylic acids
  azelaic: ["18281923", "33071282"],
  "azelaic acid": ["18281923", "33071282"],
  nonanedioic: ["18281923", "33071282"],
  "nonanedioic acid": ["18281923", "33071282"],
  // Homocysteine
  // Risk association and intervention trial context
  homocysteine: ["10614701", "16531613"],
  // Propionylglycine
  // Propionate metabolism disorders (propionic/methylmalonic acidemia) and organic acid patterns
  propionylglycine: ["2342832", "7313494", "35038174"],
  "n-propionylglycine": ["2342832", "7313494", "35038174"],
  "propionyl glycine": ["2342832", "7313494", "35038174"],
  // Benzoic acid (benzoic)
  // HMDB normal blood concentration baseline from Loke et al., J Nutr 2009
  benzoic: ["19812218"],
  "benzoic acid": ["19812218"],
};

export function getAnalytePmids(analyteName: string): string[] {
  const key = (analyteName ?? "").toLowerCase().trim();
  return analytePubMed[key] ?? [];
}
