import Link from "next/link";

export default function RetestPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-ink-900">Retest</h1>
      <p className="mt-3 text-sm text-ink-500">
        Ready for another check-in? Aim for a similar setting each time.
      </p>
      <Link
        href="/cognitive-test"
        className="mt-6 inline-flex text-sm font-semibold text-brand-600"
      >
        Start check-in
      </Link>
      <Link
        href="/dashboard"
        className="mt-3 inline-flex text-sm font-semibold text-brand-600"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
