import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO:
    // 1) Get current user from session
    // 2) Validate payload (zod)
    // 3) Persist to Neon/Prisma
    // 4) Return normalized profile fields
    return NextResponse.json({ ok: true, received: body }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
