import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { normalizePmid, pubmedUrl } from "@/lib/pubmed";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

type PublicationEntry = { pmid?: string; note?: string };

interface PublicationsLinksProps {
  pmids?: string[];
  entries?: PublicationEntry[];
  status?: "computed" | "insufficient" | "insufficient_data";
}

export function PublicationsLinks({ pmids = [], entries = [] }: PublicationsLinksProps) {
  const sourceEntries: PublicationEntry[] =
    entries.length > 0 ? entries : pmids.map((pmid) => ({ pmid }));
  const normalizedEntries: PublicationEntry[] = sourceEntries.map((entry) => ({
    pmid: entry.pmid ? normalizePmid(entry.pmid) ?? undefined : undefined,
    note: entry.note,
  }));
  const filteredEntries = normalizedEntries.filter((entry) => Boolean(entry.pmid || entry.note));
  const pmidEntries = filteredEntries.filter(
    (entry): entry is PublicationEntry & { pmid: string } => Boolean(entry.pmid),
  );
  const noteEntries = filteredEntries.filter((entry) => entry.note && !entry.pmid);
  const [summaries, setSummaries] = useState<Record<string, {
    title?: string;
    source?: string;
    pubdate?: string;
    authors?: Array<{ name: string }>;
    volume?: string;
    issue?: string;
    pages?: string;
    elocationid?: string;
  }>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const formatAmaCitation = (pmid: string, summary?: {
    title?: string;
    source?: string;
    pubdate?: string;
    authors?: Array<{ name: string }>;
    volume?: string;
    issue?: string;
    pages?: string;
    elocationid?: string;
  }) => {
    if (!summary) return `PMID: ${pmid}`;
    const authors = summary.authors ?? [];
    const authorNames = authors.map((author) => author.name).slice(0, 3);
    const authorText = authorNames.length > 0 ? authorNames.join(", ") + (authors.length > 3 ? ", et al." : "") : "Unknown authors";
    const year = summary.pubdate?.split(" ")[0] ?? summary.pubdate ?? "";
    const volume = summary.volume ? summary.volume : "";
    const issue = summary.issue ? `(${summary.issue})` : "";
    const pages = summary.pages ? `:${summary.pages}` : "";
    const journal = summary.source ?? "Journal";
    const doiMatch = summary.elocationid?.match(/doi:\\s*([^\\s]+)/i);
    const doi = doiMatch ? doiMatch[1].replace(/\.$/, "") : "";
    const doiText = doi ? ` doi:${doi}.` : "";
    const yearText = year ? `${year};` : "";
    return `${authorText}. ${summary.title ?? "Untitled"}. ${journal}. ${yearText}${volume}${issue}${pages}.${doiText} PMID: ${pmid}.`;
  };

  const fetchSummary = useCallback(async (pmid: string) => {
    if (summaries[pmid] || loading[pmid]) return;
    setLoading((prev) => ({ ...prev, [pmid]: true }));
    try {
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`,
      );
      if (!response.ok) throw new Error("PubMed lookup failed");
      const data = (await response.json()) as {
        result?: Record<string, {
          title?: string;
          source?: string;
          pubdate?: string;
          authors?: Array<{ name: string }>;
          volume?: string;
          issue?: string;
          pages?: string;
          elocationid?: string;
        }>;
      };
      const entry = data?.result?.[pmid];
      setSummaries((prev) => ({ ...prev, [pmid]: entry ?? {} }));
    } catch {
      setSummaries((prev) => ({ ...prev, [pmid]: {} }));
    } finally {
      setLoading((prev) => ({ ...prev, [pmid]: false }));
    }
  }, [loading, summaries]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Publications</p>
      {normalizedEntries.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {pmidEntries.map(({ pmid, note }) => (
            <div key={pmid} className="flex flex-col items-start gap-1.5">
              <HoverCard onOpenChange={(open) => open && fetchSummary(pmid)}>
                <HoverCardTrigger asChild>
                  <a
                    href={pubmedUrl(pmid)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
                      "underline-offset-4 hover:underline",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                  >
                    PMID: {pmid}
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 text-sm">
                  {loading[pmid] && <p className="text-xs text-muted-foreground">Loading PubMed summary...</p>}
                  {!loading[pmid] && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        {summaries[pmid]?.title ?? "PubMed summary unavailable"}
                      </p>
                      {note ? (
                        <p className="text-xs text-muted-foreground">Why it matters: {note}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Why we cite this: This citation supports the pathway biology and interpretation context.
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatAmaCitation(pmid, summaries[pmid])}
                      </p>
                      <a
                        href={pubmedUrl(pmid)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline"
                      >
                        View on PubMed
                      </a>
                    </div>
                  )}
                </HoverCardContent>
              </HoverCard>
              {note ? (
                <span className="text-xs text-muted-foreground">{note}</span>
              ) : (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs font-semibold text-slate-500 underline-offset-4 hover:underline">
                        Why we cite this
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs text-slate-100">
                      This citation provides background context for the pathway.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
          {noteEntries.map((entry, index) => (
            <span key={`note-${index}`} className="text-xs text-muted-foreground">
              {entry.note}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No curated citations yet.</p>
      )}
    </div>
  );
}
