import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Coming soon
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Prime State Community
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Connect with others tracking their cognitive health. Share experiments, celebrate progress, and stay accountable with monthly check-ins.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {isLoggedIn ? (
            <>
              <h2 className="text-lg font-semibold text-slate-900">You&apos;re on the list</h2>
              <p className="mt-2 text-sm text-slate-600">
                We&apos;ll notify you when the community launches. In the meantime, keep tracking your cognitive health.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900">Join the waitlist</h2>
              <p className="mt-2 text-sm text-slate-600">
                Create a free account to get early access when the community launches.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Create free account
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
                >
                  Learn more
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-slate-900">Community features:</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Share your &ldquo;one-change&rdquo; experiments and results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Monthly accountability check-ins and challenges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Discussion forums for sleep, stress, nutrition, and focus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>Learn from others&rsquo; successful strategies</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
