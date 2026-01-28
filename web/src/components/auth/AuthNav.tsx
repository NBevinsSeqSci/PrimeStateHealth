"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LinkButton } from "@/components/ui/link-button";

export default function AuthNav() {
  const { data: session, status } = useSession();

  // Show loading state briefly to avoid flash
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-16 animate-pulse rounded-md bg-slate-100" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-100" />
      </div>
    );
  }

  // Logged out state
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex items-center gap-2">
        <LinkButton href="/login" variant="ghost" size="sm">
          Log in
        </LinkButton>
        <LinkButton href="/signup" variant="primary" size="sm">
          Create free account
        </LinkButton>
      </div>
    );
  }

  // Logged in state
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

      {/* Account pill */}
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-1.5">
        {/* Green online indicator */}
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
