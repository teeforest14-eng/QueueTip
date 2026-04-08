import { prisma } from "@/lib/prisma";

export async function evaluateDelayForCase(caseId: string): Promise<void> {
  const c = await prisma.case.findUnique({
    where: { id: caseId },
    include: { snapshots: { orderBy: { capturedAt: "desc" }, take: 2 } },
  });
  if (!c) return;

  const threshold = await prisma.delayThresholdConfig.findUnique({
    where: { key: "no_meaningful_update" },
  });
  const days = threshold?.daysWithoutUpdate ?? 90;

  const last = c.snapshots[0];
  if (!last) return;
  const ageDays =
    (Date.now() - last.capturedAt.getTime()) / (1000 * 60 * 60 * 24);
  const stale = ageDays >= days;
  await prisma.case.update({
    where: { id: caseId },
    data: { isStale: stale },
  });

  if (stale) {
    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId: c.userId },
    });
    if (prefs?.delayThresholds && prefs.inAppEnabled) {
      await prisma.alert.create({
        data: {
          userId: c.userId,
          type: "delay_threshold",
          title: "Long gap since last recorded update",
          body: `For receipt ${c.receiptNumber}, we have not recorded a new snapshot in about ${Math.floor(ageDays)} days. Compare with official processing times and consider eligible inquiries—not a prediction about your case.`,
        },
      });
      await prisma.notificationLog.create({
        data: {
          userId: c.userId,
          channel: "in_app",
          category: "delay_threshold",
          title: "Delay heuristic triggered",
          body: `Case ${c.receiptNumber}: ${Math.floor(ageDays)} days since last snapshot.`,
        },
      });
    }
  }
}
