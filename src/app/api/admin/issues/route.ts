import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

const patchSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ContentStatus),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  await prisma.issueGuide.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });
  await prisma.contentRevision.create({
    data: {
      entityType: "issue_guide",
      entityId: parsed.data.id,
      dataJson: { status: parsed.data.status },
      createdBy: session.user.email ?? session.user.id,
    },
  });
  return NextResponse.json({ ok: true });
}
