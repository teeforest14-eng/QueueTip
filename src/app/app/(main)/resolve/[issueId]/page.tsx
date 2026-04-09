import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";
import { ContentLabel } from "@/components/content-label";
import { ResolveSurface } from "@/components/app/resolve/resolve-surface";
import { ResolveLegalHelpModule } from "@/components/app/resolve/resolve-legal-help-module";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

export const dynamic = "force-dynamic";

type OfficialLink = { label: string; url: string };

export default async function ResolveIssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const guide = await prisma.issueGuide.findFirst({
    where: { slug: issueId, status: ContentStatus.PUBLISHED },
    include: { category: true },
  });
  if (!guide) notFound();

  const causes = guide.likelyCausesJson as string[];
  const evidence = guide.evidenceSignalsJson as string[];
  const steps = guide.nextStepsJson as string[];
  const official = (guide.officialResourceLinksJson as OfficialLink[]) ?? [];
  const relatedSlugs = (guide.relatedSlugsJson as string[]) ?? [];
  const related =
    relatedSlugs.length > 0
      ? await prisma.issueGuide.findMany({
          where: {
            slug: { in: relatedSlugs },
            status: ContentStatus.PUBLISHED,
          },
          select: { slug: true, title: true },
        })
      : [];
  const order = new Map(relatedSlugs.map((s, i) => [s, i]));
  related.sort(
    (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99),
  );

  const whyWorry =
    guide.whyPeopleWorry?.trim() ||
    "Applicants often worry when facts feel uncertain or timelines stretch; structured checks reduce guesswork.";

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <Link
        href="/app/resolve"
        className="inline-flex text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
      >
        ← All issues
      </Link>

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-qt-slate">
          {guide.category.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
          {guide.title}
        </h1>
        {guide.summary ? (
          <p className="mt-3 text-base leading-relaxed text-neutral-600">
            {guide.summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize text-neutral-800">
            Urgency: {guide.urgencyLevel}
          </span>
          {(guide.formsAffectedJson as string[])?.length ? (
            <span className="text-xs text-neutral-500">
              Forms: {(guide.formsAffectedJson as string[]).join(", ")}
            </span>
          ) : null}
        </div>
      </header>

      {guide.lawyerRecommended ? <ResolveLegalHelpModule variant="detail" /> : null}

      <ResolveSurface className="p-6 sm:p-8">
        <ContentLabel kind="typical" />
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          Why people worry about this
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {whyWorry}
        </p>
      </ResolveSurface>

      <ResolveSurface className="p-6 sm:p-8">
        <ContentLabel kind="typical" />
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          What this issue usually means
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {guide.typicalMeaning}
        </p>
      </ResolveSurface>

      <ResolveSurface className="p-6 sm:p-8">
        <ContentLabel kind="official" />
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          What to verify first
        </h2>
        <p className="mt-2 text-xs text-neutral-500">
          Factual checks before you assume a worst-case outcome. Not a
          guarantee of what USCIS will do.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
          {evidence.map((c) => (
            <li
              key={c}
              className="flex gap-2 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-qt-slate/70 before:content-['']"
            >
              {c}
            </li>
          ))}
        </ul>
      </ResolveSurface>

      <ResolveSurface className="p-6 sm:p-8">
        <ContentLabel kind="action" />
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          What to do next
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {guide.whatUsuallyNext}
        </p>
        <h3 className="mt-6 text-sm font-semibold text-neutral-900">
          Suggested steps (general)
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-700">
          {steps.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
        <h3 className="mt-6 text-sm font-semibold text-neutral-900">
          What to prepare
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          {guide.whatToPrepare}
        </p>
      </ResolveSurface>

      <div className="grid gap-6 md:grid-cols-2">
        <ResolveSurface className="p-6">
          <ContentLabel kind="wait" />
          <h2 className="mt-3 text-lg font-semibold text-neutral-900">
            When waiting may still be normal
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            {guide.whenToWait}
          </p>
        </ResolveSurface>
        <ResolveSurface className="p-6">
          <ContentLabel kind="escalate" />
          <h2 className="mt-3 text-lg font-semibold text-neutral-900">
            When legal help may be important
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            {guide.whenToEscalate}
          </p>
        </ResolveSurface>
      </div>

      <ResolveSurface className="p-6 sm:p-8">
        <ContentLabel kind="typical" />
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          Common patterns (not certainty)
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-neutral-700">
          {causes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </ResolveSurface>

      {official.length ? (
        <ResolveSurface className="p-6 sm:p-8">
          <ContentLabel kind="official" />
          <h2 className="mt-3 text-lg font-semibold text-neutral-900">
            Official resources
          </h2>
          <ul className="mt-4 space-y-2">
            {official.map((o) => (
              <li key={o.url + o.label}>
                <a
                  href={o.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-qt-slate underline-offset-2 hover:underline"
                >
                  {o.label}
                </a>
              </li>
            ))}
          </ul>
        </ResolveSurface>
      ) : null}

      {related.length ? (
        <ResolveSurface className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-neutral-900">
            Related issues
          </h2>
          <ul className="mt-4 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/app/resolve/${r.slug}`}
                  className="text-sm font-medium text-qt-slate underline-offset-2 hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </ResolveSurface>
      ) : null}

      <ResolveSurface className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            Need personalized guidance?
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Use the Help Directory for accredited professionals—not informal
            advice.
          </p>
        </div>
        <Link
          href="/app/help-directory"
          className={appPrimaryCtaClassWide + " shrink-0 text-center"}
        >
          Help Directory
        </Link>
      </ResolveSurface>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/tools"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        >
          Official tools
        </Link>
        <Link
          href="/app/resolve"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        >
          All issues
        </Link>
      </div>
    </div>
  );
}
