import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoiRevenueCalculator } from "@/components/RoiRevenueCalculator";
import { CTA_LABELS } from "@/lib/copy";
import {
  ClipboardList,
  Link2,
  LineChart,
  Timer,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type IntegrationCard = {
  title: string;
  bullets: string[];
  icon: LucideIcon;
};

const INTEGRATION_CARDS: IntegrationCard[] = [
  {
    title: "Embed the Screener",
    bullets: [
      "White-labeled link or QR code",
      "3-minute patient flow",
      "Captures consent + contact info",
    ],
    icon: Link2,
  },
  {
    title: "Pre-Visit Intake",
    bullets: [
      "Mood, sleep, and focus screeners",
      "Medication + lifestyle context",
      "Flags higher-risk patterns",
    ],
    icon: ClipboardList,
  },
  {
    title: "Run the Full Test",
    bullets: [
      "10-20 minutes",
      "Self-administered on tablet or computer with on-screen guidance",
      "Browser-based, no hardware",
    ],
    icon: Timer,
  },
  {
    title: "Align With Your Offerings",
    bullets: [
      "Maps to common wellness levers",
      "Hormone, vitamin, sleep, metabolic support",
      "Supports shared decision-making",
    ],
    icon: Workflow,
  },
  {
    title: "Track Progress Over Time",
    bullets: ["Repeatable follow-ups", "Before/after monitoring", "Trend scores alongside labs"],
    icon: LineChart,
  },
  {
    title: "Patient Retention",
    bullets: [
      "Show visible improvement over time",
      "Create clear follow-up cadence",
      "Increase perceived value of care",
    ],
    icon: Users,
  },
];

export default function ClinicIntegration() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <section className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Solutions</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Clinic Integration
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Plug Prime State Health into your intake flow in hours, then use the data to streamline
            visits, improve conversion, and build repeatable cognitive care.
          </p>
        </section>

        <section className="space-y-6 py-12 md:py-16">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Integration at a glance
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            A simple, low-lift workflow that turns subjective complaints into objective data your team
            can act on.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTEGRATION_CARDS.map((card) => (
              <Card key={card.title} className="shadow-sm border-0 bg-white">
                <CardHeader className="p-6 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {card.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
                    {card.bullets.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-primary font-semibold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              Runs in a browser
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              No special hardware
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              White-labeled
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              Fast to deploy
            </Badge>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Revenue Lift Calculator
          </h2>
          <RoiRevenueCalculator />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">Ready to map your workflow?</h3>
            <p className="text-sm text-slate-600">
              We can walk through your intake flow, revenue model, and staffing plan in a short call.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact">
              <Button size="lg">{CTA_LABELS.talkToUs}</Button>
            </Link>
            <Link href="/clinic-demo">
              <Button size="lg" variant="outline">
                {CTA_LABELS.clinicDemo}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
