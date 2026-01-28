import Link from "next/link";
import Image from "next/image";
import AuthNav from "@/components/auth/AuthNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Prime State Health"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-semibold">
              <span className="text-brand-700">Prime</span> State Health
            </span>
            <span className="block text-xs text-ink-500">At-home brain check-ins</span>
          </span>
        </Link>
        <AuthNav />
      </div>
    </header>
  );
}
