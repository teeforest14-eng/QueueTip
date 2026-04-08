import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [guides, issues, tools, help, faqs] = await Promise.all([
    prisma.guide.count(),
    prisma.issueGuide.count(),
    prisma.officialToolEntry.count(),
    prisma.helpDirectoryEntry.count(),
    prisma.faqEntry.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-qt-text">Admin overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardTitle>Guides</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{guides}</p>
        </Card>
        <Card>
          <CardTitle>Issue templates</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{issues}</p>
        </Card>
        <Card>
          <CardTitle>Official tools</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{tools}</p>
        </Card>
        <Card>
          <CardTitle>Help entries</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{help}</p>
        </Card>
        <Card>
          <CardTitle>FAQ entries</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{faqs}</p>
        </Card>
      </div>
    </div>
  );
}
