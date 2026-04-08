import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const tools = await prisma.officialToolEntry.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-qt-text">Official tools</h1>
      <p className="text-sm text-qt-text-secondary">
        URLs and copy are seeded for V1. Extend with full CRUD when you wire a
        richer CMS.
      </p>
      <div className="space-y-4">
        {tools.map((t) => (
          <Card key={t.id}>
            <CardTitle>{t.name}</CardTitle>
            <p className="text-xs text-qt-text-muted">{t.slug}</p>
            <p className="mt-2 text-sm text-qt-text-secondary">{t.url}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
