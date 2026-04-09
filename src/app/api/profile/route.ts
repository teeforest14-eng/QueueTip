import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const saveSchema = z.object({
  displayName: z.string().max(120).default(""),
  firstName: z.string().max(120).default(""),
  lastName: z.string().max(120).default(""),
  preferredLanguage: z.string().min(1).max(32),
  countryRegion: z.string().max(120).default(""),
  needsReminders: z.boolean(),
  interestedLocalHelp: z.boolean(),
});

function trimToNull(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const v = parsed.data;
  const userId = session.user.id;

  const row = {
    displayName: trimToNull(v.displayName),
    firstName: trimToNull(v.firstName),
    lastName: trimToNull(v.lastName),
    preferredLanguage: v.preferredLanguage.trim() || "en",
    countryRegion: trimToNull(v.countryRegion),
    needsReminders: v.needsReminders,
    interestedLocalHelp: v.interestedLocalHelp,
  };

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...row },
    update: row,
  });

  return NextResponse.json(profile);
}
