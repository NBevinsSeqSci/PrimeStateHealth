"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CognitiveTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingDemographics, setIsCheckingDemographics] = useState(true);

  useEffect(() => {
    const checkDemographics = async () => {
      // If not authenticated, allow access (guest users can take tests)
      if (status === "unauthenticated") {
        setIsCheckingDemographics(false);
        return;
      }

      // If still loading, wait
      if (status === "loading") {
        return;
      }

      // If authenticated, check if demographics are completed
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch("/api/user/profile");
          const data = await response.json();

          if (!data.demographicsCompleted) {
            // Redirect to demographics page if not completed
            router.push("/onboarding/demographics");
            return;
          }

          setIsCheckingDemographics(false);
        } catch (error) {
          console.error("Error checking demographics:", error);
          setIsCheckingDemographics(false);
        }
      }
    };

    checkDemographics();
  }, [session, status, router, pathname]);

  if (status === "loading" || isCheckingDemographics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
