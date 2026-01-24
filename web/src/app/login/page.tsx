import { Suspense } from "react";
import LoginForm from "@/components/site/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
            Log in
          </p>
          <h1 className="text-4xl font-semibold text-white">Welcome back</h1>
          <p className="text-lg text-slate-200">
            We&apos;ll email you a secure link to access your account.
          </p>
          <p className="text-sm text-slate-300">No password required.</p>
        </div>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
      <div className="h-3 w-20 rounded-full bg-white/10" />
      <div className="mt-5 h-6 w-48 rounded-full bg-white/10" />
      <div className="mt-3 h-4 w-64 rounded-full bg-white/10" />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="h-12 flex-1 rounded-2xl bg-white/10" />
        <div className="h-12 w-full rounded-2xl bg-white/10 sm:w-36" />
      </div>
      <div className="mt-4 h-4 w-44 rounded-full bg-white/10" />
    </div>
  );
}
