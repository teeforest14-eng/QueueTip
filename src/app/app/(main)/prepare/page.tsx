import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Avoid "I-485 …" in the title plus an I-485 badge (duplicate + cramped read). */
function guideDisplayTitle(fullTitle: string, formType: string) {
  const t = fullTitle.trim();
  const ft = formType.trim();
  if (!ft || !t) return t;
  if (t.toUpperCase().startsWith(ft.toUpperCase())) {
    let rest = t.slice(ft.length).trim();
    rest = rest.replace(/^[—–\-:,\s]+/, "").trim();
    return rest.length > 0 ? rest : t;
  }
  return t;
}

export default async function PreparePage() {
  const guides = await prisma.guide.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pb-2">
      <header className="max-w-2xl border-b border-neutral-900/10 pb-10">
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-neutral-900 md:text-[2rem]">
          Prepare
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-neutral-600">
          Family-based V1 coverage for I-130, I-485, I-765, and I-131. Each
          guide lists forms, documents, mistakes, and RFE triggers with plain
          English guardrails.
        </p>
      </header>

      <ul className="mt-8 list-none space-y-8 p-0 md:mt-8 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8 md:space-y-0">
        {guides.map((g) => {
          const heading = guideDisplayTitle(g.title, g.formType);
          return (
            <li key={g.id} className="min-w-0">
              <article className="flex flex-col rounded-xl border border-neutral-200/50 bg-white px-6 py-7 shadow-[0_1px_2px_rgba(17,17,17,0.04),0_10px_28px_-12px_rgba(17,17,17,0.07)] md:px-7 md:py-8">
                <div className="w-full">
                  <h3 className="m-0 max-w-full p-0 text-[1.1875rem] font-semibold leading-[1.45] tracking-[-0.02em] text-neutral-900">
                    <span className="qt-prepare-guide-title-text">{heading}</span>
                    <span className="qt-prepare-guide-badge-wrap">
                      <span className="inline-flex items-center rounded-full border border-qt-soft-gray/90 bg-qt-primary-soft/55 px-2.5 py-0.5 text-[11px] font-medium tabular-nums tracking-wide text-neutral-700">
                        {g.formType}
                      </span>
                    </span>
                  </h3>
                </div>

                <p className="mt-2 text-[15px] font-normal leading-[1.65] text-neutral-600">
                  {g.summary.slice(0, 220)}
                  {g.summary.length > 220 ? "…" : ""}
                </p>

                <Link
                  href={`/app/prepare/${g.slug}`}
                  className="group mt-[14px] inline-flex w-fit items-center gap-2 text-[15px] font-medium text-qt-primary underline-offset-[6px] visited:text-qt-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qt-primary transition-colors duration-200 hover:text-qt-primary-hover hover:underline hover:decoration-qt-primary/55"
                >
                  <span>Open guide</span>
                  <span
                    className="translate-y-px text-qt-primary/90 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-qt-primary-hover"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
