import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { HelpDirectoryFilters } from "./help-filters";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HelpDirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const region =
    typeof sp.region === "string" ? sp.region.toLowerCase() : undefined;
  const language =
    typeof sp.language === "string" ? sp.language.toLowerCase() : undefined;
  const caseType =
    typeof sp.caseType === "string" ? sp.caseType.toUpperCase() : undefined;

  const entries = await prisma.helpDirectoryEntry.findMany({
    where: { published: true },
    include: { languages: true, caseTypes: true, regions: true },
    orderBy: { name: "asc" },
  });

  const filtered = entries.filter((e) => {
    if (region && !e.regions.some((r) => r.region.toLowerCase().includes(region)))
      return false;
    if (
      language &&
      !e.languages.some((l) => l.language.toLowerCase().includes(language))
    )
      return false;
    if (
      caseType &&
      !e.caseTypes.some((c) => c.caseType.toUpperCase().includes(caseType))
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Help directory</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          Trusted external support (lawyers, accredited representatives,
          nonprofits, local orgs). V1 uses illustrative entries—replace with
          vetted data before production.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-qt-text-secondary">Loading filters…</p>}>
        <HelpDirectoryFilters />
      </Suspense>
      {filtered.length === 0 ? (
        <Card>
          <CardTitle>No matches</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Broaden filters or seek referrals from your community. QueueTip does
            not endorse specific providers in V1.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((e) => (
            <Card key={e.id}>
              <CardTitle>{e.name}</CardTitle>
              <p className="mt-1 text-xs uppercase tracking-wide text-qt-text-muted">
                {e.type}
              </p>
              <p className="mt-3 text-sm text-qt-text-secondary">
                {e.serviceArea}
              </p>
              <p className="mt-2 text-sm text-qt-text-secondary">
                <span className="font-medium text-qt-text">Languages: </span>
                {e.languages.map((l) => l.language).join(", ")}
              </p>
              <p className="mt-1 text-sm text-qt-text-secondary">
                <span className="font-medium text-qt-text">Case types: </span>
                {e.caseTypes.map((c) => c.caseType).join(", ")}
              </p>
              <p className="mt-1 text-sm text-qt-text-secondary">
                <span className="font-medium text-qt-text">Regions: </span>
                {e.regions.map((r) => r.region).join(", ")}
              </p>
              {e.website ? (
                <a
                  href={e.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-qt-slate underline"
                >
                  Website
                </a>
              ) : null}
              {e.phone ? (
                <p className="mt-2 text-sm text-qt-text-secondary">
                  Phone: {e.phone}
                </p>
              ) : null}
              {e.email ? (
                <p className="mt-2 text-sm text-qt-text-secondary">
                  Email: {e.email}
                </p>
              ) : null}
              {e.notes ? (
                <p className="mt-3 text-xs text-qt-text-muted">{e.notes}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
