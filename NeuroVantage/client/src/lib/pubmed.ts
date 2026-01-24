export const normalizePmid = (input: string): string | null => {
  if (!input) return null;
  const cleaned = input.replace(/pmid[:\s]*/i, "").replace(/\s+/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  return cleaned;
};

export const pubmedUrl = (pmid: string): string => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
