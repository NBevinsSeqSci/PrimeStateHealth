import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginClinician } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { appConfig } from "@/lib/appConfig";
import { Loader2, Lock } from "lucide-react";

export default function ClinicLogin() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") {
      return "/dashboard";
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      if (next && next.startsWith("/")) {
        return next;
      }
      return "/dashboard";
    } catch {
      return "/dashboard";
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(nextPath);
    }
  }, [isAuthenticated, isLoading, navigate, nextPath]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      if (!appConfig.demoMode) {
        setError("Enter your clinic credentials to continue.");
        return;
      }
      login({
        id: -1,
        email: "bevins@neurovantage.com",
        name: "Bevins Clinic",
        clinicId: "bevins",
      });
      navigate(nextPath);
      return;
    }

    if (!trimmedEmail || !trimmedPassword) {
      setError("Enter both email and password, or leave both blank to preview the Bevins clinic dashboard.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginClinician(trimmedEmail, trimmedPassword);
      const clinician = (result as {
        clinician: { id: number; email: string; name?: string | null; clinicId?: string | null };
      }).clinician;
      login(clinician);
      navigate(nextPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white to-slate-50">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center text-primary gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Clinic dashboard</CardTitle>
              <CardDescription>Sign in to view patient reports and assessments.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Clinic email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@yourclinic.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Access dashboard"
              )}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground text-center">
            <p>
              Need access?{" "}
              <Link href="/clinic-demo" className="text-primary hover:underline">
                Schedule a demo
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
