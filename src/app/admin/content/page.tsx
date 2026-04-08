import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { FaqCreateForm } from "./faq-create-form";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const faqs = await prisma.faqEntry.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const sections = await prisma.landingPageSection.findMany();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-qt-text">Landing & FAQ</h1>
      <Card>
        <CardTitle>Landing sections</CardTitle>
        <ul className="mt-4 space-y-2 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <span className="font-medium text-qt-text">{s.key}: </span>
              <span className="text-qt-text-secondary">{s.title}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <CardTitle>Add FAQ entry</CardTitle>
        <FaqCreateForm nextSort={faqs.length} />
      </Card>
      <Card>
        <CardTitle>Existing FAQs</CardTitle>
        <ul className="mt-4 space-y-3 text-sm">
          {faqs.map((f) => (
            <li key={f.id} className="border-b border-qt-soft-gray pb-3">
              <p className="font-medium text-qt-text">{f.question}</p>
              <p className="text-qt-text-secondary">{f.answer.slice(0, 160)}…</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
