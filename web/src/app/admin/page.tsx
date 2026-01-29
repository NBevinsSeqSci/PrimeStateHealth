"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  preferredName: string | null;
  demographicsCompleted: boolean;
  acceptedTermsAt: string | null;
  _count: { tests: number };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/admin/users")
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("not-authorized");
          throw new Error(`Request failed (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data.users ?? []);
      })
      .catch((err) => {
        setError(err.message === "not-authorized" ? "not-authorized" : err.message);
      })
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200" />
            <div className="mt-8 h-64 rounded-xl bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated" || error === "not-authorized") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
          <p className="text-slate-600">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go home
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              {users.length} account{users.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Tests</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Demographics</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Terms</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const displayName =
                    user.preferredName ||
                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    user.name ||
                    "—";

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{displayName}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {user._count.tests}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.demographicsCompleted ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.acceptedTermsAt ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
