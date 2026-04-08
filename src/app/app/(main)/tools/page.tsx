import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { ContentLabel } from "@/components/content-label";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const tools = await prisma.officialToolEntry.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Official tools</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          These are government or official resources. QueueTip summarizes how
          they help; always verify on the live site.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center gap-2">
              <ContentLabel kind="official" />
            </div>
            <CardTitle className="mt-3">{t.name}</CardTitle>
            <p className="mt-2 text-sm text-qt-text-secondary">{t.description}</p>
            <p className="mt-3 text-sm">
              <span className="font-medium text-qt-text">Why use it: </span>
              <span className="text-qt-text-secondary">{t.whyUse}</span>
            </p>
            <p className="mt-2 text-sm">
              <span className="font-medium text-qt-text">When to use it: </span>
              <span className="text-qt-text-secondary">{t.whenToUse}</span>
            </p>
            <a
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-lg bg-qt-slate px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            >
              Open official site
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
