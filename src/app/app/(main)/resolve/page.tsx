import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";
import {
  ResolveWorkspace,
  type ResolveGuideDTO,
} from "@/components/app/resolve/resolve-workspace";

export const dynamic = "force-dynamic";

export default async function ResolvePage() {
  const [guidesRaw, categories] = await Promise.all([
    prisma.issueGuide.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
    }),
    prisma.issueCategory.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const guides: ResolveGuideDTO[] = guidesRaw.map((g) => {
    const links = g.officialResourceLinksJson as unknown;
    const hasOfficialLinks =
      Array.isArray(links) && links.length > 0;
    const lane = g.triageLane as ResolveGuideDTO["triageLane"];
    const trimmed = g.summary?.trim() ?? "";
    const summary = trimmed
      ? trimmed
      : g.typicalMeaning.length > 160
        ? `${g.typicalMeaning.slice(0, 157)}…`
        : g.typicalMeaning;
    return {
      id: g.id,
      slug: g.slug,
      title: g.title,
      summary,
      categorySlug: g.category.slug,
      categoryName: g.category.name,
      urgencyLevel: g.urgencyLevel,
      triageLane:
        lane === "monitor" || lane === "review" || lane === "legal"
          ? lane
          : "review",
      formsAffected: (g.formsAffectedJson as string[]) ?? [],
      lawyerRecommended: g.lawyerRecommended,
      hasOfficialLinks,
    };
  });

  return (
    <ResolveWorkspace
      guides={guides}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
    />
  );
}
