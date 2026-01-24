import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { MetaboliteResult } from "@/lib/pathways/types";
import { buildAnalyteRows } from "@/lib/analytes";
import { ANALYTE_REGISTRY } from "@/lib/analytes/analyteRegistry";
import { AnalyteTable } from "./AnalyteTable";
import { hasMeasuredValue } from "@/lib/analytes/format";
import { findAnalyteMetadata } from "@/lib/analytes/metadata";

type SortOption = "magnitude" | "alpha" | "category";

interface AnalyteSectionProps {
  results?: MetaboliteResult[];
  highlightedAnalyteId?: string;
  onPathwayNavigate?: (pathwayId: string) => void;
  forceExpanded?: boolean;
}

const CATEGORY_OPTIONS: string[] = [
  "All",
  ...Array.from(new Set(ANALYTE_REGISTRY.map((def) => def.category).filter(Boolean))) as string[],
];

export function AnalyteSection({
  results = [],
  highlightedAnalyteId,
  onPathwayNavigate,
  forceExpanded = false,
}: AnalyteSectionProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("magnitude");
  const [onlyMeasured, setOnlyMeasured] = useState(false);
  const [onlyAbnormal, setOnlyAbnormal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [forcePrint, setForcePrint] = useState(false);

  const rows = useMemo(() => buildAnalyteRows(results), [results]);

  const summary = useMemo(() => {
    let measured = 0;
    let abnormal = 0;
    rows.forEach((row) => {
      if (hasMeasuredValue(row.result)) measured += 1;
      if (row.result?.zScore != null && Math.abs(row.result.zScore) >= 1) abnormal += 1;
    });
    return { measured, abnormal, total: rows.length };
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        const measuredRow = hasMeasuredValue(row.result);
        if (onlyMeasured && !measuredRow) return false;
        if (onlyAbnormal && !(row.result && Math.abs(row.result.zScore ?? 0) >= 1)) return false;
        if (categoryFilter !== "All" && row.def.category !== categoryFilter) return false;
        if (!query) return true;
        const metadata = findAnalyteMetadata(row.def.id);
        const searchPool = [
          row.def.display,
          ...(row.def.aliases ?? []),
          row.matchedName,
          row.result?.name,
          ...(metadata?.synonyms ?? []),
        ]
          .filter(Boolean)
          .map((text) => text!.toLowerCase());
        return searchPool.some((text) => text.includes(query));
      })
      .sort((a, b) => {
        if (sort === "alpha") {
          return a.def.display.localeCompare(b.def.display);
        }
        if (sort === "category") {
          const catA = a.def.category ?? "ZZZ";
          const catB = b.def.category ?? "ZZZ";
          if (catA === catB) return a.def.display.localeCompare(b.def.display);
          return catA.localeCompare(catB);
        }
        const az = a.result?.zScore;
        const bz = b.result?.zScore;
        if (az == null && bz == null) return a.def.display.localeCompare(b.def.display);
        if (az == null) return 1;
        if (bz == null) return -1;
        return Math.abs(bz) - Math.abs(az);
      });
  }, [rows, search, sort, onlyMeasured, onlyAbnormal, categoryFilter]);

  const handlePrint = () => {
    setForcePrint(true);
    setTimeout(() => {
      window.print();
      setForcePrint(false);
    }, 150);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 print:hidden lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search analytes or aliases"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64"
          />
          <Select value={sort} onValueChange={(value: SortOption) => setSort(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="magnitude">|z| desc</SelectItem>
              <SelectItem value="alpha">A → Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All categories" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" onClick={handlePrint}>
          Print analytes
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm print:hidden">
        <div className="flex items-center gap-2">
          <Switch id="only-measured" checked={onlyMeasured} onCheckedChange={setOnlyMeasured} />
          <Label htmlFor="only-measured">Only measured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="only-abnormal" checked={onlyAbnormal} onCheckedChange={setOnlyAbnormal} />
          <Label htmlFor="only-abnormal">Only abnormal (|z| ≥ 1)</Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <Badge variant="outline">Total analytes: {summary.total}</Badge>
        <Badge variant="outline">Measured: {summary.measured}</Badge>
        <Badge variant="outline" className="text-rose-700 border-rose-200">
          Abnormal: {summary.abnormal}
        </Badge>
        <Badge variant="outline">Showing: {filtered.length}</Badge>
      </div>

      <AnalyteTable
        rows={filtered}
        highlightedId={highlightedAnalyteId}
        forcePrint={forcePrint}
        forceExpanded={forceExpanded}
        onPathwayNavigate={onPathwayNavigate}
      />
    </section>
  );
}
