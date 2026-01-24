// Analyte → publication references for the analyte detail drawer.
// Keys are lowercase for case-insensitive lookups.

export type AnalytePublication = { pmid?: string; note?: string };

export const analytePublications: Record<string, AnalytePublication[]> = {
  // 3-hydroxyisovaleric acid reference interval context (serum organic acids LC-MS/MS)
  "3-hydroxyisovaleric": [{ pmid: "34943431" }],
  // Decanoylcarnitine / acylcarnitine profiling references
  // ACMG Technical Standard (acylcarnitine analysis): PMID 33071282
  // Acylcarnitine profile analysis overview: PMID 18281923
  // Clinically validated LC-MS/MS quantification in human plasma: PMID 34954532
  decanoylcarnitine: [{ pmid: "33071282" }, { pmid: "18281923" }, { pmid: "34954532" }],
  // Indole-3-aldehyde / indole-3-carboxaldehyde (IALD) plasma ranges
  // Anesi et al., Metabolites 2019: PMID 31683910
  // Clinical context: PMID 29248242
  "indole-3-aldehyde": [{ pmid: "31683910" }, { pmid: "29248242" }],
  "indole-3-carboxaldehyde": [{ pmid: "31683910" }, { pmid: "29248242" }],
  // Trimethylamine (TMA) -- plasma levels and measurement context
  // CKD vs control paper includes control plasma TMA around ~0.3 umol/L: PMID 31683880
  // LC-MS/MS method context for TMA/TMAO: PMID 34258650
  trimethylamine: [{ pmid: "31683880" }, { pmid: "34258650" }],
  // Glycocholic (glycocholic acid; GCA)
  // Quantification method (stable isotope dilution UPLC-ESI-MS/MS): PMID 29202363
  // Candidate reference measurement procedure for GCA: PMID 39046504
  glycocholic: [{ pmid: "29202363" }, { pmid: "39046504" }],
  "glycocholic acid": [{ pmid: "29202363" }, { pmid: "39046504" }],
  // Xanthosine
  // HMDB normal blood concentration entries reference: PMID 12675874 and PMID 16139832
  xanthosine: [{ pmid: "12675874" }, { pmid: "16139832" }],
  "2hydroxybutyric": [{ pmid: "20526369" }, { pmid: "34940595" }],
  "2-hydroxybutyric": [{ pmid: "20526369" }, { pmid: "34940595" }],
  // Beta-hydroxybutyrate (BHB)
  "3hydroxybutyric": [
    { pmid: "10634967" },
    { note: "Mayo Clinic Labs: beta-hydroxybutyrate reference values and fasting interpretation." },
  ],
  "3-hydroxybutyric": [
    { pmid: "10634967" },
    { note: "Mayo Clinic Labs: beta-hydroxybutyrate reference values and fasting interpretation." },
  ],
  "beta-hydroxybutyrate": [
    { pmid: "10634967" },
    { note: "Mayo Clinic Labs: beta-hydroxybutyrate reference values and fasting interpretation." },
  ],
  // Acetoacetate (AcAc) -- ketone panel methods and stability notes
  acetoacetic: [{ pmid: "38375486" }, { pmid: "7386330" }, { pmid: "11918279" }, { pmid: "33592770" }],
  "acetoacetic acid": [{ pmid: "38375486" }, { pmid: "7386330" }, { pmid: "11918279" }, { pmid: "33592770" }],
  acetoacetate: [{ pmid: "38375486" }, { pmid: "7386330" }, { pmid: "11918279" }, { pmid: "33592770" }],
  // Butyrate / propionate SCFA ranges (HMDB concentration detail summaries)
  butyrate: [{ note: "HMDB0000039 concentration summary (adult blood/plasma SCFA context)." }],
  propionate: [{ note: "HMDB0000237 concentration summary (adult venous plasma)." }],
  // Kynurenine -- plasma concentrations in healthy controls + LC-MS/MS measurement context
  // Healthy control plasma kynurenine values reported: PMID 26769378
  // LC-MS/MS method covering kynurenine metabolites: PMID 27524289
  kynurenine: [{ pmid: "26769378" }, { pmid: "27524289" }],
  // Glutathione redox (plasma handling-sensitive)
  "glutathione(reduced)": [{ pmid: "30445289" }, { pmid: "10719244" }],
  "glutathione(oxidized)": [{ pmid: "30445289" }, { pmid: "15512798" }, { pmid: "10719244" }],
  // NAD+ matrix context
  nad: [{ note: "Yang 2022 whole-blood NAD+; Azouaoui 2023 plasma vs whole-blood meta-analysis." }],
  "nad+": [{ note: "Yang 2022 whole-blood NAD+; Azouaoui 2023 plasma vs whole-blood meta-analysis." }],
};

if (process.env.NODE_ENV !== "production") {
  Object.entries(analytePublications).forEach(([analyte, publications]) => {
    publications.forEach((publication) => {
      if (publication.pmid && !/^\d{8}$/.test(publication.pmid)) {
        console.warn(
          `[analytePublications] PMID for ${analyte} is not 8 digits: ${publication.pmid}`,
        );
      }
    });
  });
}

export function getAnalytePublications(analyteName: string): AnalytePublication[] {
  const key = (analyteName ?? "").toLowerCase().trim();
  return analytePublications[key] ?? [];
}

export function getAnalytePmids(analyteName: string): string[] {
  return getAnalytePublications(analyteName)
    .map((entry) => entry.pmid)
    .filter((pmid): pmid is string => Boolean(pmid));
}
