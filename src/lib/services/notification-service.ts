import { prisma } from "@/lib/prisma";

export async function maybeNotifyStatusChange(
  userId: string,
  payload: { receipt: string; formType: string; status: string },
): Promise<void> {
  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId },
  });
  if (!prefs?.statusChanges) return;

  if (prefs.inAppEnabled) {
    await prisma.alert.create({
      data: {
        userId,
        type: "status_change",
        title: `Status update: ${payload.formType}`,
        body: `Receipt ${payload.receipt} now shows: ${payload.status}. Always confirm on USCIS Case Status—this app uses practice data until you connect a live source.`,
      },
    });
  }

  await prisma.notificationLog.create({
    data: {
      userId,
      channel: prefs.inAppEnabled ? "in_app" : "email",
      category: "status_change",
      title: "Status change recorded",
      body: `${payload.receipt}: ${payload.status}`,
    },
  });
}
