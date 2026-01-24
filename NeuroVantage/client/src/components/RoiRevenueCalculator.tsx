import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencySmallFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function clampNonNegative(value: number) {
  return Math.max(0, value);
}

function safeNumber(value: string) {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  if (value < 1000) return currencySmallFormatter.format(value);
  return currencyFormatter.format(value);
}

type NumberFieldProps = {
  label: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
};

function NumberField({
  label,
  helper,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {prefix ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        ) : null}
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${prefix ? "pl-6" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
      {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

export function RoiRevenueCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState("50");
  const [leadToVisitRate, setLeadToVisitRate] = useState("40");
  const [conversionLift, setConversionLift] = useState("10");
  const [avgRevenuePerPatient, setAvgRevenuePerPatient] = useState("5000");

  const inputValues = useMemo(() => {
    return {
      leads: clampNonNegative(safeNumber(monthlyLeads)),
      leadToVisitRate: clampPercent(safeNumber(leadToVisitRate)),
      conversionLift: clampPercent(safeNumber(conversionLift)),
      avgRevenue: clampNonNegative(safeNumber(avgRevenuePerPatient)),
    };
  }, [monthlyLeads, leadToVisitRate, conversionLift, avgRevenuePerPatient]);

  const metrics = useMemo(() => {
    const bookedVisits = inputValues.leads * (inputValues.leadToVisitRate / 100);
    const additionalConversions = bookedVisits * (inputValues.conversionLift / 100);
    const visitValueProxy = inputValues.avgRevenue * 0.25;
    const leadGenValue = bookedVisits * visitValueProxy;
    const monthlyLift = additionalConversions * inputValues.avgRevenue;
    const annualLift = monthlyLift * 12;

    return {
      bookedVisits,
      additionalConversions,
      leadGenValue,
      visitValueProxy,
      monthlyLift,
      annualLift,
    };
  }, [inputValues]);

  const resetDefaults = () => {
    setMonthlyLeads("50");
    setLeadToVisitRate("40");
    setConversionLift("10");
    setAvgRevenuePerPatient("5000");
  };

  return (
    <Card className="p-6 md:p-8 shadow-sm border-0 bg-white space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          A quick estimate of lift from lead generation + higher conversion using objective cognitive
          testing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <NumberField
            label="New leads per month from the screener"
            helper="Expected new inquiries/leads driven by the cognitive screener (website + QR)."
            value={monthlyLeads}
            onChange={setMonthlyLeads}
            min={0}
          />
          <NumberField
            label="Lead-to-visit booking rate (%)"
            helper="Percent of leads that schedule a visit."
            value={leadToVisitRate}
            onChange={setLeadToVisitRate}
            suffix="%"
            min={0}
            max={100}
            step={1}
          />
          <NumberField
            label="Visit-to-plan conversion lift (percentage points)"
            helper="Expected increase in conversion after adding objective cognitive testing (e.g., +10%)."
            value={conversionLift}
            onChange={setConversionLift}
            suffix="%"
            min={0}
            max={100}
            step={1}
          />
          <NumberField
            label="Average revenue per converted patient"
            helper="Estimated revenue from the initial plan + first 1-2 follow-ups."
            value={avgRevenuePerPatient}
            onChange={setAvgRevenuePerPatient}
            prefix="$"
            min={0}
          />

          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs text-slate-500 hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <Card className="border border-slate-200 bg-white p-6 shadow-none space-y-3">
            <p className="text-sm font-semibold text-slate-900">Lead Generation Value</p>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Estimated booked visits/month from leads</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {numberFormatter.format(metrics.bookedVisits)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated revenue from new bookings (proxy)</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(metrics.leadGenValue)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Assumes a booked visit is worth ~25% of a converted plan. Adjust in settings if needed.
            </p>
          </Card>

          <Card className="border border-slate-200 bg-slate-50/70 p-6 shadow-none space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">Revenue Lift</p>
              <p className="text-3xl font-semibold text-slate-900">
                {formatCurrency(metrics.monthlyLift)}
              </p>
              <p className="text-xs text-slate-500">Estimated monthly revenue lift</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Additional conversions/month</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {numberFormatter.format(metrics.additionalConversions)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Annualized lift</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(metrics.annualLift)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}
