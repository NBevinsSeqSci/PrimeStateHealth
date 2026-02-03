import Link from "next/link";
import type { ReactNode } from "react";

export default function ReactionTimeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          aria-label="Back to dashboard"
        >
          &larr; Back to dashboard
        </Link>
      </div>
      {children}
    </div>
  );
}
