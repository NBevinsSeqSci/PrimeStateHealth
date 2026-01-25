import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";

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
              className="psh-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href="/signup" variant="primary" size="sm">
            Get started
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
