import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push-server";

export async function maybeNotifyStatusChange(
  userId: string,
  payload: { receipt: string; formType: string; status: string },
): Promise<void> {
  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId },
  });
  if (!prefs?.statusChanges) return;

  const title = `Status update: ${payload.formType}`;
  const body = `Receipt ${payload.receipt} now shows: ${payload.status}. Confirm on USCIS Case Status.`;

  if (prefs.inAppEnabled) {
    await prisma.alert.create({
      data: {
        userId,
        type: "status_change",
        title,
        body: `${body} QueueTip uses your synced data—verify on the official tool when decisions matter.`,
      },
    });
  }

  if (prefs.pushEnabled) {
    await sendPushToUser(userId, {
      title,
      body,
      url: "/app/track",
    });
  }

  await prisma.notificationLog.create({
    data: {
      userId,
      channel: prefs.pushEnabled
        ? "push"
        : prefs.inAppEnabled
          ? "in_app"
          : "email",
      category: "status_change",
      title: "Status change recorded",
      body: `${payload.receipt}: ${payload.status}`,
    },
  });
}
