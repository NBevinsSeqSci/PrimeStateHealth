import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-ink-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-ink-900">Prime State Health</p>
          <p>Know where you stand. Track your trend.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink-600">
          <Link href="/terms" className="transition hover:text-brand-600">
            Terms
          </Link>
          <Link href="/privacy" className="transition hover:text-brand-600">
            Privacy
          </Link>
          <Link href="/contact" className="transition hover:text-brand-600">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
