import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

type AdminUserPageProps = {
  params: { id: string };
};

const formatKind = (kind?: string | null) => {
  if (!kind) return "Check-in";
  return kind
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const session = await auth();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      preferredName: true,
      demographicsCompleted: true,
      acceptedTermsAt: true,
      tests: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          kind: true,
          score: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const displayName =
    user.preferredName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "—";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {displayName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{user.email ?? "—"}</p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Back to admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Tests
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {user.tests.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Demographics
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {user.demographicsCompleted ? "Completed" : "Incomplete"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Terms
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {user.acceptedTermsAt ? "Accepted" : "Not accepted"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Joined
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {user.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700">Test</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Score</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Completed</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {user.tests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatKind(test.kind)}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {test.score}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {test.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/results/${test.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {user.tests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                      No test results yet.
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
