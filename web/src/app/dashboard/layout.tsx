import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Check if user has accepted terms
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { acceptedTermsAt: true },
  });

  if (!user?.acceptedTermsAt) {
    redirect("/terms/accept?callbackUrl=/dashboard");
  }

  return <>{children}</>;
}
