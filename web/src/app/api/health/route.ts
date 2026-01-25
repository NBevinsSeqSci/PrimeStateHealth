import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    ok: true,
    timestamp: new Date().toISOString(),
  });
}
