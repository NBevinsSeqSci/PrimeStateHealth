import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTA_LABELS } from "@/lib/copy";

export default function Contact() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-8 md:p-10 shadow-sm border-0 bg-white space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Contact</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Talk to the Prime State Health team
          </h1>
          <p className="text-sm text-muted-foreground">
            Email us and we will respond with scheduling options and integration details.
          </p>
          <a href="mailto:privacy@neurovantage.com">
            <Button size="lg">{CTA_LABELS.emailUs}</Button>
          </a>
        </Card>
      </div>
    </div>
  );
}
