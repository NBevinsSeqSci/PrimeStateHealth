import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, FileText } from "lucide-react";
import type { PatientReport } from "@shared/schema";

interface PatientReportModalProps {
  report: PatientReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientReportModal({ report, open, onOpenChange }: PatientReportModalProps) {
  if (!report) return null;

  const demographics = report.demographics as any;
  const medicalHistory = report.medicalHistory as any;
  const screenerScores = report.screenerScores as any;
  const cognitiveScores = report.cognitiveScores as any;
  const recommendations = report.recommendations as any[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold text-primary">
                Clinical Report
              </DialogTitle>
              <DialogDescription>
                {demographics.firstName} {demographics.lastName} | Age: {demographics.age}
              </DialogDescription>
            </div>
          </div>
          {/* Display Entered Clinic ID */}
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex gap-2">
            <span className="font-semibold">Source Data Input:</span>
            <span>Clinic ID: {demographics.enteredClinicId || "N/A"}</span>
          </div>
        </DialogHeader>

        <div className="p-4 bg-slate-50 border rounded-lg text-xs text-muted-foreground leading-relaxed">
          <strong>IMPORTANT INFORMATION AND DISCLAIMER:</strong> This Prime State Health Cognitive Assessment Report is provided by the clinic for informational and educational purposes only. It is based on computerized cognitive tasks, health questionnaires, and self-reported history. The results reflect performance at a single point in time and may be influenced by factors such as sleep, mood, pain, medications, motivation, and technical issues. This report Does NOT provide a medical diagnosis or rule out any medical, neurological, or psychiatric condition.
        </div>

        <Tabs defaultValue="summary" className="w-full mt-4">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="summary">Assessment Summary</TabsTrigger>
            <TabsTrigger value="clinician">Clinician Detail</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Assessment Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Based on this assessment, the participant's cognitive profile shows areas of strength in visual memory, while there are some variances noted in processing speed that may be related to sleep or lifestyle factors.
                  The following recommendations are topics to discuss with the healthcare provider.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Key Recommendations</h3>
                <div className="grid grid-cols-1 gap-4">
                  {recommendations.map((rec: any, i: number) => (
                    <Card key={i} className="border bg-slate-50/50 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                          <Activity size={14} className="text-accent" />
                          {rec.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{rec.patientText}</p>
                        {rec.basedOn && (
                          <p className="text-xs text-slate-500 mt-2">
                            <span className="font-semibold text-slate-600">Based on:</span> {rec.basedOn}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clinician">
            <div className="space-y-8">
              {/* Domain Scores Table */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Cognitive Domain Analysis</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Test(s)</TableHead>
                      <TableHead>Raw Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Orientation</TableCell>
                      <TableCell>Global Screen</TableCell>
                      <TableCell>{cognitiveScores.orientation || 0}/6</TableCell>
                      <TableCell><span className="text-green-600 font-bold">Intact</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Processing Speed</TableCell>
                      <TableCell>Symbol Coding</TableCell>
                      <TableCell>{cognitiveScores.symbol || 0} matches</TableCell>
                      <TableCell>
                        {(cognitiveScores.symbol || 0) > 40 ? <span className="text-green-600">Average</span> : <span className="text-yellow-600">Low Average</span>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Episodic Memory (Verbal)</TableCell>
                      <TableCell>List Learning</TableCell>
                      <TableCell>{cognitiveScores.list || 0} words</TableCell>
                      <TableCell>
                        {(cognitiveScores.list || 0) > 20 ? <span className="text-green-600">Strong</span> : <span className="text-yellow-600">Variance</span>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Working Memory</TableCell>
                      <TableCell>Digit Span</TableCell>
                      <TableCell>Max {cognitiveScores.digit_span || 0} digits</TableCell>
                      <TableCell>
                        {(cognitiveScores.digit_span || 0) > 5 ? <span className="text-green-600">Intact</span> : <span className="text-yellow-600">Low</span>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Executive Function</TableCell>
                      <TableCell>Trails B / Stroop</TableCell>
                      <TableCell>{cognitiveScores.trails || 0}s / {cognitiveScores.stroop || 0} score</TableCell>
                      <TableCell>
                        {(cognitiveScores.trails || 0) < 60 ? <span className="text-green-600">Intact</span> : <span className="text-yellow-600">Slowed</span>}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Clinician Notes */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Clinical Guidance & Rule Triggers</h3>
                <div className="space-y-4">
                  {recommendations.map((rec: any, i: number) => (
                    <div key={i} className="p-4 border rounded-lg bg-blue-50/50 border-blue-100">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-blue-900">{rec.title}</h4>
                        <span className="text-xs font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{rec.category}</span>
                      </div>
                      <p className="text-sm text-blue-800 font-medium mb-2">Clinician Note:</p>
                      <p className="text-sm text-blue-900/80">{rec.clinicianNote}</p>
                      {rec.basedOn && (
                        <p className="text-xs text-blue-900/70 mt-1">
                          <span className="font-semibold">Based on:</span> {rec.basedOn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="raw">
             <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2">Medical History</h4>
                  <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-60 border">
                    {JSON.stringify(medicalHistory, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2">Screener Scores</h4>
                  <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-60 border">
                    {JSON.stringify(screenerScores, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2">Cognitive Raw Data</h4>
                  <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-60 border">
                    {JSON.stringify(cognitiveScores, null, 2)}
                  </pre>
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4 border-t pt-4">
          <Button variant="outline" onClick={() => window.print()}>
            Print Report
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
