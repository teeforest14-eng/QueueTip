import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { ContentLabel } from "@/components/content-label";

export const dynamic = "force-dynamic";

export default async function ResolveIssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const guide = await prisma.issueGuide.findFirst({
    where: { slug: issueId, status: "PUBLISHED" },
    include: { category: true },
  });
  if (!guide) notFound();

  const causes = guide.likelyCausesJson as string[];
  const evidence = guide.evidenceSignalsJson as string[];
  const steps = guide.nextStepsJson as string[];

  return (
    <div className="space-y-8">
      <Link
        href="/app/resolve"
        className="text-sm font-medium text-qt-slate hover:underline"
      >
        ← All issues
      </Link>
      <div>
        <p className="text-sm text-qt-text-secondary">{guide.category.name}</p>
        <h1 className="mt-1 text-2xl font-semibold text-qt-text">
          {guide.title}
        </h1>
      </div>

      <Card>
        <ContentLabel kind="typical" />
        <h2 className="mt-3 font-medium text-qt-text">What this usually means</h2>
        <p className="mt-2 text-sm text-qt-text-secondary">
          {guide.typicalMeaning}
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-qt-text">What often comes next</h2>
        <p className="mt-2 text-sm text-qt-text-secondary">
          {guide.whatUsuallyNext}
        </p>
      </Card>

      <Card>
        <ContentLabel kind="action" />
        <h2 className="mt-3 font-medium text-qt-text">What to prepare</h2>
        <p className="mt-2 text-sm text-qt-text-secondary">
          {guide.whatToPrepare}
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <ContentLabel kind="wait" />
          <h2 className="mt-3 font-medium text-qt-text">When to wait</h2>
          <p className="mt-2 text-sm text-qt-text-secondary">
            {guide.whenToWait}
          </p>
        </Card>
        <Card>
          <ContentLabel kind="escalate" />
          <h2 className="mt-3 font-medium text-qt-text">When to escalate</h2>
          <p className="mt-2 text-sm text-qt-text-secondary">
            {guide.whenToEscalate}
          </p>
        </Card>
      </div>

      <Card>
        <CardTitle>Likely causes (patterns, not certainty)</CardTitle>
        <ul className="mt-4 list-inside list-disc text-sm text-qt-text-secondary">
          {causes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Evidence / signals you might notice</CardTitle>
        <ul className="mt-4 list-inside list-disc text-sm text-qt-text-secondary">
          {evidence.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Recommended next steps</CardTitle>
        <ul className="mt-4 list-inside list-decimal space-y-2 text-sm text-qt-text-secondary">
          {steps.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/tools"
          className="rounded-lg bg-qt-slate px-4 py-2 text-sm font-medium text-white hover:opacity-95"
        >
          Official tools
        </Link>
        <Link
          href="/app/help-directory"
          className="rounded-lg border border-qt-soft-gray bg-white px-4 py-2 text-sm font-medium hover:bg-qt-mist"
        >
          Help directory
        </Link>
      </div>
    </div>
  );
}
