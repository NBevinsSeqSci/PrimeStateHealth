import Link from "next/link";
import SignUpForm from "@/components/site/SignUpForm";

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
            Free check-in
          </p>
          <h1 className="text-4xl font-semibold text-white">Get started</h1>
          <p className="text-lg text-slate-200">
            Create your secure link to begin the free check-in.
          </p>
          <p className="text-sm text-slate-300">
            We&apos;ll email you a secure sign-in link. No password needed.
          </p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200"
          >
            Prefer to preview first? See the free check-in →
          </Link>
          <div className="text-xs text-slate-400">
            By continuing, you agree to our Terms and Privacy Policy. Prime
            State is for measurement and trend tracking - not diagnosis or
            treatment.
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
