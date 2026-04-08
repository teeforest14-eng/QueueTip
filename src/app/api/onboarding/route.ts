import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingJourneyState } from "@prisma/client";
import { defaultPathForOnboarding } from "@/lib/services/recommendation-service";

const journeyZ = z.nativeEnum(OnboardingJourneyState).optional();

const patchSchema = z.object({
  lastStep: z.number().int().min(0).optional(),
  skipped: z.boolean().optional(),
  completed: z.boolean().optional(),
  journeyCategory: journeyZ,
  familyCaseType: z.string().max(200).optional().nullable(),
  alreadyFiled: z.boolean().optional().nullable(),
  formsInvolved: z.array(z.string()).optional(),
  hasReceipt: z.boolean().optional().nullable(),
  currentConcern: z.string().max(2000).optional().nullable(),
  preferredLanguage: z.string().max(20).optional(),
  countryRegion: z.string().max(120).optional().nullable(),
  needsReminders: z.boolean().optional(),
  interestedLocalHelp: z.boolean().optional(),
  answersJson: z.record(z.string(), z.unknown()).optional(),
});

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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const userId = session.user.id;
  let onb = await prisma.onboardingAnswer.findUnique({ where: { userId } });
  if (!onb) {
    onb = await prisma.onboardingAnswer.create({
      data: { userId, formsInvolved: [] },
    });
  }

  const data = parsed.data;
  let routedPath = onb.routedPath;

  if (data.completed) {
    const merged = {
      journeyCategory: data.journeyCategory ?? onb.journeyCategory,
      alreadyFiled: data.alreadyFiled ?? onb.alreadyFiled,
    };
    routedPath = defaultPathForOnboarding(merged);
  }

  const updated = await prisma.onboardingAnswer.update({
    where: { userId },
    data: {
      lastStep: data.lastStep ?? undefined,
      skipped: data.skipped ?? undefined,
      completed: data.completed ?? undefined,
      journeyCategory: data.journeyCategory ?? undefined,
      familyCaseType:
        data.familyCaseType === undefined ? undefined : data.familyCaseType,
      alreadyFiled:
        data.alreadyFiled === undefined ? undefined : data.alreadyFiled,
      formsInvolved: data.formsInvolved ?? undefined,
      hasReceipt: data.hasReceipt === undefined ? undefined : data.hasReceipt,
      currentConcern:
        data.currentConcern === undefined ? undefined : data.currentConcern,
      ...(data.completed ? { routedPath } : {}),
      answersJson:
        data.answersJson !== undefined
          ? (data.answersJson as Prisma.InputJsonValue)
          : undefined,
    },
  });

  if (
    data.preferredLanguage !== undefined ||
    data.countryRegion !== undefined ||
    data.needsReminders !== undefined ||
    data.interestedLocalHelp !== undefined
  ) {
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        preferredLanguage: data.preferredLanguage ?? "en",
        countryRegion: data.countryRegion ?? null,
        needsReminders: data.needsReminders ?? true,
        interestedLocalHelp: data.interestedLocalHelp ?? false,
      },
      update: {
        preferredLanguage: data.preferredLanguage ?? undefined,
        countryRegion:
          data.countryRegion === undefined ? undefined : data.countryRegion,
        needsReminders: data.needsReminders ?? undefined,
        interestedLocalHelp: data.interestedLocalHelp ?? undefined,
      },
    });
  }

  return NextResponse.json({ ok: true, onboarding: updated });
}
