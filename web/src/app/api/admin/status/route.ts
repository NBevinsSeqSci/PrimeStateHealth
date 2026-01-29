import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isAdmin = isAdminEmail(session?.user?.email);
  return NextResponse.json({ isAdmin });
}
