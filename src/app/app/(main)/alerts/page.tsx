import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { AlertRow } from "./alert-row";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const logs = await prisma.notificationLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Alerts</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          In-app notifications for status changes, delay heuristics, and
          reminders. Email delivery activates when you connect a mail provider.
        </p>
      </div>
      <Card>
        <CardTitle>Unread / recent</CardTitle>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-qt-text-secondary">
            No alerts yet. Track a case and run syncs to see practice
            notifications.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {alerts.map((a) => (
              <AlertRow key={a.id} alert={a} />
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <CardTitle>Notification history</CardTitle>
        <ul className="mt-4 space-y-3 text-xs text-qt-text-muted">
          {logs.map((l) => (
            <li key={l.id}>
              {l.createdAt.toLocaleString()} · {l.channel} · {l.category}:{" "}
              {l.title}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
