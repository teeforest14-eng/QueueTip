import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { GuideStatusForm } from "./status-form";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-qt-text">Prepare guides</h1>
      <div className="space-y-4">
        {guides.map((g) => (
          <Card key={g.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{g.title}</CardTitle>
                <p className="text-xs text-qt-text-muted">
                  {g.slug} · {g.formType}
                </p>
              </div>
              <GuideStatusForm id={g.id} status={g.status} />
            </div>
            <Link
              href={`/app/prepare/${g.slug}`}
              className="mt-3 inline-block text-sm text-qt-slate underline"
            >
              View in app →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
