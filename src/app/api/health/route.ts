import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public sanity check: DB reachable. Open GET /api/health in the browser when server logs are empty. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "up" });
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: unknown }).code)
        : undefined;
    const message =
      e instanceof Error ? e.message : e ? String(e) : "unknown";
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        prismaCode: code,
        message,
      },
      { status: 503 },
    );
  }
}
