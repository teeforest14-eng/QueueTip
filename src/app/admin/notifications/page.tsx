import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const templates = await prisma.notificationTemplate.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-qt-text">
        Notification templates
      </h1>
      <div className="space-y-4">
        {templates.map((t) => (
          <Card key={t.id}>
            <CardTitle>{t.key}</CardTitle>
            <p className="mt-2 text-sm font-medium text-qt-text">
              {t.titleTemplate}
            </p>
            <p className="mt-2 text-sm text-qt-text-secondary">{t.bodyTemplate}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
