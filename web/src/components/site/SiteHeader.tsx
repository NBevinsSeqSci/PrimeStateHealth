import Link from "next/link";

const navItems = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/try", label: "Free Tests" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-white"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
            PSH
          </span>
          Prime State Health
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-emerald-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-200 transition hover:text-emerald-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300 hover:text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
