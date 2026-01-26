import { LinkButton } from "@/components/ui/link-button";

type Props = {
  variant?: "default" | "compact";
  title?: string;
  subtitle?: string;
};

export default function SignupEnticement({
  variant = "default",
  title = "Want to track your trend?",
  subtitle = "Create a free account to save results, see your history, and get simple comparisons over time.",
}: Props) {
  return (
    <div
      className={[
        "mt-6 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm",
        "sm:p-5",
        variant === "compact" ? "bg-ink-50" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900">{title}</p>
          <p className="mt-1 text-sm text-ink-600">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <LinkButton href="/signup" variant="primary" size="lg" className="w-full sm:w-auto">
            Create free account
          </LinkButton>
          <LinkButton href="/login" variant="ghost" size="lg" className="w-full sm:w-auto">
            Log in
          </LinkButton>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-ink-600 sm:grid-cols-3">
        <div className="rounded-xl bg-ink-50 p-3 ring-1 ring-inset ring-ink-200">
          <p className="font-semibold text-ink-900">Trendline</p>
          <p className="mt-1">See month-to-month change at a glance.</p>
        </div>
        <div className="rounded-xl bg-ink-50 p-3 ring-1 ring-inset ring-ink-200">
          <p className="font-semibold text-ink-900">Comparisons</p>
          <p className="mt-1">Compare today vs your baseline and recent average.</p>
        </div>
        <div className="rounded-xl bg-ink-50 p-3 ring-1 ring-inset ring-ink-200">
          <p className="font-semibold text-ink-900">All tests</p>
          <p className="mt-1">Keep executive, memory, and reaction scores together.</p>
        </div>
      </div>
    </div>
  );
}
