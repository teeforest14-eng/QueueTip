import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ResolvePage() {
  const categories = await prisma.issueCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      guides: { where: { status: "PUBLISHED" }, orderBy: { title: "asc" } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Resolve</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          Choose an issue to see plain-English structure: what it usually means,
          what often comes next, what to prepare, when to wait, and when to
          escalate. None of this is a promise about your case.
        </p>
      </div>
      <div className="space-y-8">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardTitle>{cat.name}</CardTitle>
            <ul className="mt-4 space-y-2 text-sm">
              {cat.guides.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/app/resolve/${g.slug}`}
                    className="font-medium text-qt-slate hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
