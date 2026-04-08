import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const groups = await prisma.caseGroup.findMany({
    where: { userId: session.user.id },
    include: { cases: { orderBy: { formType: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-qt-text">Track</h1>
          <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
            Group I-130 + I-485 + I-765 + I-131 together, view timelines, and
            refresh a practice sync layer. Always confirm on USCIS Case Status.
          </p>
        </div>
        <Link
          href="/app/track/add-case"
          className="rounded-lg bg-qt-primary px-4 py-2.5 text-center text-sm font-medium text-qt-text hover:bg-qt-primary-hover"
        >
          Add receipt
        </Link>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardTitle>No cases yet</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Add your first receipt to see grouped forms and a timeline. Invalid
            formats are blocked up front so you do not chase typos.
          </p>
          <Link
            href="/app/track/add-case"
            className="mt-4 inline-block text-sm font-medium text-qt-slate underline"
          >
            Add a case →
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <Card key={g.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{g.label ?? "Case group"}</CardTitle>
                <Badge tone="neutral">
                  {g.cases.length} receipt{g.cases.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <ul className="mt-4 divide-y divide-qt-soft-gray text-sm">
                {g.cases.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-mono text-qt-text">{c.receiptNumber}</p>
                      <p className="text-qt-text-secondary">{c.formType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-qt-text">
                        {c.currentStatusLabel ?? "—"}
                      </p>
                      <p className="text-xs text-qt-text-muted">
                        Last sync:{" "}
                        {c.lastSyncedAt
                          ? c.lastSyncedAt.toLocaleString()
                          : "never"}
                      </p>
                    </div>
                    <Link
                      href={`/app/track/${c.id}`}
                      className="text-sm font-medium text-qt-slate underline"
                    >
                      Details
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
