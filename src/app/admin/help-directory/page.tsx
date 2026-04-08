import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminHelpPage() {
  const entries = await prisma.helpDirectoryEntry.findMany({
    include: { languages: true, caseTypes: true, regions: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-qt-text">Help directory</h1>
      <div className="space-y-4">
        {entries.map((e) => (
          <Card key={e.id}>
            <CardTitle>{e.name}</CardTitle>
            <p className="text-xs text-qt-text-muted">{e.type}</p>
            <p className="mt-2 text-sm text-qt-text-secondary">{e.serviceArea}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
