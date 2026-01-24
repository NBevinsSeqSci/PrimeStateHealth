import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Search,
  Bell,
  Plus,
  MoreHorizontal,
  Brain,
  Loader2,
  Download,
  ExternalLink,
  ClipboardList,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/generated_images/primestatehealth_minimalist_brain_logo_icon_in_teal_and_navy.png";
import { PatientReportModal } from "@/components/dashboard/PatientReportModal";
import type { PatientReport } from "@shared/schema";
import { getClinicReports } from "@/lib/api";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { trackAppEvent } from "@/lib/events";

const VISIT_TYPE_LABELS: Record<string, string> = {
  "full-assessment": "Full assessment",
  "screener-full": "Screener + tasks",
  "screener-partial": "Screener (partial)",
  "screener-questionnaire": "Questionnaire-only",
};

type CategorizedReports = {
  screener: PatientReport[];
  full: PatientReport[];
  other: PatientReport[];
};

export default function Dashboard() {
  const { clinician, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("assessments");
  const [selectedReport, setSelectedReport] = useState<PatientReport | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const clinicId = clinician?.clinicId ?? "bevins";
  const clinicianInitials = useMemo(() => {
    if (clinician?.name) {
      return clinician.name
        .split(" ")
        .filter(Boolean)
        .map((segment) => segment[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    if (clinician?.email) {
      return clinician.email.slice(0, 2).toUpperCase();
    }
    return "CL";
  }, [clinician]);

  const handleLogout = () => {
    void logout();
    navigate("/clinic/login");
  };

  // Fetch clinic reports
  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ["clinic-reports", clinicId],
    queryFn: () => getClinicReports(clinicId),
    enabled: true,
  });

  const reports = useMemo(() => reportsData?.reports ?? [], [reportsData?.reports]);

  const categorizedReports: CategorizedReports = useMemo(() => {
    const buckets: CategorizedReports = { screener: [], full: [], other: [] };
    reports.forEach((report) => {
      const visitType = (report.demographics as any)?.visitType;
      if (visitType === "full-assessment") {
        buckets.full.push(report);
      } else if (
        visitType === "screener-full" ||
        visitType === "screener-partial" ||
        visitType === "screener-questionnaire"
      ) {
        buckets.screener.push(report);
      } else {
        buckets.other.push(report);
      }
    });
    return buckets;
  }, [reports]);

  const formatTimestamp = (dateValue: string | Date | null) => {
    if (!dateValue) return "N/A";
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return String(dateValue);
    }
  };

  const downloadFullReport = useCallback((report: PatientReport) => {
    const demographics = report.demographics as any;
    const screenerScores = report.screenerScores as any;
    const cognitiveScores = report.cognitiveScores as any;
    const recommendations = (report.recommendations as any[]) || [];
    const summary = screenerScores?.summary;
    const lines: string[] = [];
    lines.push("Prime State Health Assessment Summary");
    lines.push(`Report ID: ${report.id}`);
    lines.push(`Participant: ${demographics.firstName ?? ""} ${demographics.lastName ?? ""}`);
    lines.push(`Email/Login: ${demographics.email ?? "N/A"}`);
    lines.push(`Clinic ID: ${report.clinicId}`);
    lines.push(`Visit Type: ${(demographics.visitType as string) ?? "N/A"}`);
    lines.push(`Timestamp: ${formatTimestamp(report.createdAt ?? null)}`);
    if (summary?.assessmentType) lines.push(`Assessment Type: ${summary.assessmentType}`);
    if (summary?.dataQualityNote) lines.push(`Data Quality: ${summary.dataQualityNote}`);
    if (Array.isArray(summary?.highLevelFlags) && summary.highLevelFlags.length > 0) {
      lines.push("High-Level Flags:");
      summary.highLevelFlags.forEach((flag: string) => lines.push(`- ${flag}`));
    }
    lines.push("");
    lines.push("Cognitive Scores:");
    Object.entries(cognitiveScores || {}).forEach(([key, value]) => {
      if (["taskDetails", "taskSummaries", "missingTasks", "normative"].includes(key)) return;
      lines.push(`- ${key}: ${value}`);
    });
    if (Array.isArray(cognitiveScores?.missingTasks) && cognitiveScores.missingTasks.length > 0) {
      lines.push(`Missing Tasks: ${cognitiveScores.missingTasks.join(", ")}`);
    }
    lines.push("");
    lines.push("Recommendations:");
    if (recommendations.length === 0) {
      lines.push("- None provided");
    } else {
      recommendations.forEach((rec) => {
        lines.push(`- ${rec.title} (${rec.category})`);
        lines.push(`  Summary: ${rec.patientText}`);
        if (rec.basedOn) lines.push(`  Based on: ${rec.basedOn}`);
      });
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `primestatehealth-summary-${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    const userName =
      (demographics?.name ??
        demographics?.fullName ??
        [demographics?.firstName, demographics?.lastName].filter(Boolean).join(" ")) ||
      undefined;
    void trackAppEvent({
      type: "REPORT_DOWNLOADED",
      clinicPublicId: report.clinicId ?? undefined,
      reportId: String(report.id),
      userEmail: demographics?.email ?? undefined,
      userName,
      path: window.location.pathname,
      meta: { reportKind: "clinic-summary-txt" },
    });
  }, []);

  const openReportDetail = (report: PatientReport) => {
    window.location.assign(`/dashboard/report/${report.id}`);
  };

  const renderReportSection = (
    title: string,
    description: string,
    data: PatientReport[],
    emptyLabel: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center p-12 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Unable to load reports right now. Please refresh or sign in again.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>{emptyLabel}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Login Email</TableHead>
                <TableHead>Clinic ID</TableHead>
                <TableHead>Assessment Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((report) => {
                const demographics = report.demographics as any;
                const visitType = (demographics.visitType as string) ?? "N/A";
                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>
                          {demographics.firstName} {demographics.lastName}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-muted-foreground/80">ID: #{report.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{demographics.email ?? "—"}</TableCell>
                    <TableCell>{report.clinicId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] tracking-tight">
                        {VISIT_TYPE_LABELS[visitType] ?? visitType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.createdAt ? formatTimestamp(report.createdAt) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReport(report);
                              setIsReportOpen(true);
                            }}
                          >
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Quick Summary
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReportDetail(report)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Full Report
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadFullReport(report)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Summary
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <img
            src={logoImage}
            alt="Prime State Health"
            width={32}
            height={32}
            decoding="async"
            className="h-8 w-8 object-contain brightness-0 invert opacity-90"
          />
          <span className="font-display font-bold text-sidebar-foreground text-lg tracking-tight">Prime State Health</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
            { id: "assessments", icon: Users, label: "Assessments" },
            { id: "reports", icon: FileText, label: "Reports" },
            { id: "settings", icon: Settings, label: "Clinic Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === item.id 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8 rounded-lg border border-white/10">
              <AvatarFallback className="bg-sidebar-accent text-white">
                {clinicianInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {clinician?.name ?? clinician?.email ?? "Clinician"}
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                {clinician?.email ?? "Administrator"}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-primary capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <span className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log out
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-9 bg-slate-50 border-slate-200" />
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell size={20} />
            </Button>
            <Button className="bg-primary text-white gap-2">
              <Plus size={16} /> New Assessment
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Assessment Table */}
          {renderReportSection(
            "Screener Assessments",
            "Questionnaire-first visits captured via the clinic screener.",
            categorizedReports.screener,
            "No screener visits stored yet."
          )}

          {renderReportSection(
            "Full Test Assessments",
            "Comprehensive battery submissions with task-level data.",
            categorizedReports.full,
            "No full assessment visits stored yet."
          )}

          {categorizedReports.other.length > 0 &&
            renderReportSection(
              "Other Assessments",
              "Visits that did not specify a screening mode.",
              categorizedReports.other,
              "No other visits."
            )}
        </div>
        
        <PatientReportModal
          report={selectedReport}
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
        />
      </main>
    </div>
  );
}
