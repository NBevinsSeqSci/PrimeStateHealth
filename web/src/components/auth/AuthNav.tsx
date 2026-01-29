"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LinkButton } from "@/components/ui/link-button";

export default function AuthNav() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsAdmin(false);
      return;
    }
    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, [status]);

  // Show loading skeleton to avoid layout flash
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-9 w-16 animate-pulse rounded-md bg-slate-100" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-100" />
      </div>
    );
  }

  // Logged out: marketing links + auth CTAs
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-6 text-sm text-ink-600 md:flex">
          <Link href="/how-it-works" className="psh-link">
            How it works
          </Link>
          <Link href="/try" className="psh-link">
            Try free check-in
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href="/signup" variant="primary" size="sm">
            Create free account
          </LinkButton>
        </div>
      </div>
    );
  }

  // Logged in: dashboard link + account pill
  const displayName =
    session.user?.name?.split(" ")[0] ||
    session.user?.email?.split("@")[0] ||
    "Account";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        Dashboard
      </Link>

      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Admin
        </Link>
      )}

      {/* Account pill */}
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <span className="text-sm font-medium text-slate-700">{displayName}</span>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-300 hover:text-slate-900"
          aria-label="Sign out of your account"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
