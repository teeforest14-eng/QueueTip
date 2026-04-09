import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public sanity check: DB reachable. Open GET /api/health in the browser when server logs are empty. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "up" });
  } catch {
    return NextResponse.json(
      { ok: false, database: "error" },
      { status: 503 },
    );
  }
}
