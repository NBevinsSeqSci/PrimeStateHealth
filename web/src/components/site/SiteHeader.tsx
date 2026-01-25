import Link from "next/link";

const navItems = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/try", label: "Free Tests" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-ink-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            PSH
          </span>
          <span className="text-brand-700">Prime</span> State Health
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline transition hover:text-slate-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-ink-700 transition hover:text-brand-600"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:text-brand-600"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
