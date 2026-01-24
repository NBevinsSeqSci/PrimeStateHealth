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
            We'll email you a secure link to access your account.
          </p>
          <p className="text-sm text-slate-300">No password required.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
