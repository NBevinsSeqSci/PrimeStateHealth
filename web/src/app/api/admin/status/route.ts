import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);
  return NextResponse.json({ isAdmin });
}
