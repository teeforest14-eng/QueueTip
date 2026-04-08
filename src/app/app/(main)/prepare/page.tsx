import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function PreparePage() {
  const guides = await prisma.guide.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Prepare</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          Family-based V1 coverage for I-130, I-485, I-765, and I-131. Each
          guide lists forms, documents, mistakes, and RFE triggers with plain
          English guardrails.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((g) => (
          <Card key={g.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle>{g.title}</CardTitle>
              <Badge tone="neutral">{g.formType}</Badge>
            </div>
            <p className="mt-2 flex-1 text-sm text-qt-text-secondary">
              {g.summary.slice(0, 220)}
              {g.summary.length > 220 ? "…" : ""}
            </p>
            <Link
              href={`/app/prepare/${g.slug}`}
              className="mt-4 text-sm font-medium text-qt-slate underline"
            >
              Open guide →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
