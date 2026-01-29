import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const users = await prisma.user.findMany({
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
      _count: {
        select: { tests: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}
