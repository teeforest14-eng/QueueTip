import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { ContentLabel } from "@/components/content-label";
import { ChecklistToggle } from "./checklist-toggle";

export const dynamic = "force-dynamic";

export default async function PrepareGuidePage({
  params,
}: {
  params: Promise<{ guideId: string }>;
}) {
  const { guideId } = await params;
  const session = await auth();
  const guide = await prisma.guide.findFirst({
    where: { slug: guideId, status: "PUBLISHED" },
    include: {
      requiredForms: { orderBy: { sortOrder: "asc" } },
      checklistItems: { orderBy: { sortOrder: "asc" } },
      mistakes: { orderBy: { sortOrder: "asc" } },
      rfeTriggers: { orderBy: { sortOrder: "asc" } },
      guideResources: { include: { resource: true } },
    },
  });
  if (!guide) notFound();

  const progress = session?.user?.id
    ? await prisma.userChecklistProgress.findMany({
        where: {
          userId: session.user.id,
          checklistItem: { guideId: guide.id },
        },
      })
    : [];

  const progressMap = new Map(progress.map((p) => [p.checklistItemId, p]));

  return (
    <div className="space-y-8">
      <Link
        href="/app/prepare"
        className="text-sm font-medium text-qt-slate hover:underline"
      >
        ← All guides
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">{guide.title}</h1>
        <p className="mt-2 text-sm text-qt-text-secondary">{guide.summary}</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          <ContentLabel kind="typical" />
        </div>
        <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap text-qt-text-secondary">
          {guide.overview}
        </div>
      </Card>

      <Card>
        <CardTitle>Required forms</CardTitle>
        <ul className="mt-4 space-y-3">
          {guide.requiredForms.map((f) => (
            <li
              key={f.id}
              className="rounded-lg border border-qt-soft-gray bg-qt-mist/30 p-3 text-sm"
            >
              <p className="font-medium text-qt-text">
                {f.formCode} — {f.title}
              </p>
              {f.notes ? (
                <p className="mt-1 text-qt-text-secondary">{f.notes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Supporting documents checklist</CardTitle>
        <p className="mt-2 text-sm text-qt-text-secondary">
          Mark items as you gather them. This stays on your account for return
          visits.
        </p>
        <ul className="mt-4 space-y-3">
          {guide.checklistItems.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-qt-soft-gray bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-qt-text">{item.label}</p>
                  {item.whyMatters ? (
                    <p className="mt-1 text-sm text-qt-text-secondary">
                      <span className="font-medium text-qt-text">
                        Why this matters:{" "}
                      </span>
                      {item.whyMatters}
                    </p>
                  ) : null}
                </div>
                <ChecklistToggle
                  checklistItemId={item.id}
                  initialCompleted={
                    progressMap.get(item.id)?.completed ?? false
                  }
                  initialSavedLater={
                    progressMap.get(item.id)?.savedLater ?? false
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Common mistakes</CardTitle>
        <ul className="mt-4 space-y-3 text-sm">
          {guide.mistakes.map((m) => (
            <li key={m.id} className="rounded-lg bg-qt-primary-soft/40 p-3">
              <p className="font-medium text-qt-text">{m.title}</p>
              <p className="mt-1 text-qt-text-secondary">{m.description}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>RFE trigger patterns</CardTitle>
        <p className="mt-2 text-sm text-qt-text-secondary">
          Patterns are educational, not predictions. USCIS may issue RFEs for
          many reasons.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {guide.rfeTriggers.map((r) => (
            <li key={r.id} className="border-l-4 border-qt-support pl-3">
              <p className="font-medium text-qt-text">{r.title}</p>
              <p className="mt-1 text-qt-text-secondary">{r.pattern}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Official links</CardTitle>
        <ContentLabel kind="official" />
        <ul className="mt-4 space-y-2 text-sm">
          {guide.guideResources.map((gr) => (
            <li key={gr.resourceId}>
              <a
                href={gr.resource.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-qt-slate underline"
              >
                {gr.resource.name}
              </a>
              <p className="text-qt-text-secondary">{gr.resource.description}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
