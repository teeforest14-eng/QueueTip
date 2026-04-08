import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LANDING_FAQS } from "@/components/marketing/landing-faqs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
};

export default async function FaqPage() {
  let dbFaqs: { question: string; answer: string; id: string }[] = [];
  try {
    const rows = await prisma.faqEntry.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    dbFaqs = rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  } catch {
    dbFaqs = [];
  }

  const display =
    dbFaqs.length > 0
      ? dbFaqs.map((f) => ({ key: f.id, q: f.question, a: f.answer }))
      : LANDING_FAQS.map((f, i) => ({ key: `static-${i}`, q: f.q, a: f.a }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-qt-text sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-base leading-relaxed text-qt-text-secondary">
        Plain-English answers with explicit limits. For case-specific legal
        judgment, consult qualified counsel.
      </p>
      <div className="mt-14 space-y-12">
        {display.map((item) => (
          <article
            key={item.key}
            className="border-b border-qt-soft-gray pb-12 last:border-0"
          >
            <h2 className="text-lg font-semibold text-qt-text">{item.q}</h2>
            <p className="mt-4 text-sm leading-relaxed text-qt-text-secondary whitespace-pre-wrap">
              {item.a}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
