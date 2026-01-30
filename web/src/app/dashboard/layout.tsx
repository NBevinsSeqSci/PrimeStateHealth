import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

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
