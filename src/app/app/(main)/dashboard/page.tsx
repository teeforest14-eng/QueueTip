import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumUpsellCard } from "@/components/premium-gate";
import { buildRecommendationsForUser } from "@/lib/services/recommendation-service";
import { getPlanForUser } from "@/lib/plan";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  const [profile, onb, groups, alerts, recs, plan] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.onboardingAnswer.findUnique({ where: { userId } }),
    prisma.caseGroup.findMany({
      where: { userId },
      include: { cases: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    buildRecommendationsForUser(userId),
    getPlanForUser(userId),
  ]);

  const name =
    profile?.firstName?.trim() ||
    session.user.email?.split("@")[0] ||
    "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">
          Welcome back, {name}
        </h1>
        <p className="mt-2 text-sm text-qt-text-secondary">
          Your dashboard merges onboarding, receipts, and gentle next
          steps—labeled so you always know what is official versus interpretive.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Current path</CardTitle>
            {onb?.routedPath ? (
              <Badge tone="support">{onb.routedPath}</Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-qt-text-secondary">
            {onb?.completed
              ? "Onboarding complete. You can revisit answers anytime in settings."
              : onb?.skipped
                ? "You skipped onboarding—finish when you are ready for better routing."
                : "Complete onboarding to unlock routing."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/prepare"
              className="rounded-lg bg-qt-primary px-3 py-2 text-sm font-medium text-qt-text hover:bg-qt-primary-hover"
            >
              Prepare
            </Link>
            <Link
              href="/app/track"
              className="rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm font-medium hover:bg-qt-mist"
            >
              Track
            </Link>
            <Link
              href="/app/resolve"
              className="rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm font-medium hover:bg-qt-mist"
            >
              Resolve
            </Link>
            <Link
              href="/app/explore"
              className="rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm font-medium hover:bg-qt-mist"
            >
              Explore
            </Link>
          </div>
        </Card>
        <Card>
          <CardTitle>Plan</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            You are on <strong>{plan}</strong>. Premium deepens compare and
            alerts—not basics.
          </p>
          <Link
            href="/app/billing"
            className="mt-4 inline-block text-sm font-medium text-qt-slate underline"
          >
            Manage billing
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Case summary</CardTitle>
          {groups.length === 0 ? (
            <p className="mt-3 text-sm text-qt-text-secondary">
              No receipts yet.{" "}
              <Link href="/app/track/add-case" className="text-qt-slate underline">
                Add a receipt
              </Link>{" "}
              to build a grouped timeline (practice layer in V1).
            </p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {groups.map((g) => (
                <li
                  key={g.id}
                  className="rounded-lg border border-qt-soft-gray bg-qt-mist/40 p-3"
                >
                  <p className="font-medium text-qt-text">
                    {g.label ?? "Case group"}
                  </p>
                  <p className="text-qt-text-secondary">
                    {g.cases.length} linked form
                    {g.cases.length === 1 ? "" : "s"}
                  </p>
                  <Link
                    href={`/app/track/${g.cases[0]?.id ?? g.id}`}
                    className="mt-2 inline-block text-qt-slate underline"
                  >
                    Open group
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Alerts</CardTitle>
          {alerts.length === 0 ? (
            <p className="mt-3 text-sm text-qt-text-secondary">
              No alerts yet. Enable categories in settings; we log in-app events
              in V1 (email when you wire a provider).
            </p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {alerts.map((a) => (
                <li key={a.id} className="border-b border-qt-soft-gray pb-3">
                  <p className="font-medium text-qt-text">{a.title}</p>
                  <p className="text-qt-text-secondary">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/app/alerts"
            className="mt-4 inline-block text-sm font-medium text-qt-slate underline"
          >
            All alerts
          </Link>
        </Card>
      </div>

      <Card>
        <CardTitle>Recommended next steps</CardTitle>
        <ul className="mt-4 space-y-4">
          {recs.map((r) => (
            <li
              key={r.title + r.href}
              className="flex flex-col gap-2 rounded-xl border border-qt-soft-gray bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-qt-text">{r.title}</p>
                <p className="text-sm text-qt-text-secondary">{r.why}</p>
                {r.timing ? (
                  <p className="mt-1 text-xs text-qt-text-muted">{r.timing}</p>
                ) : null}
              </div>
              <Link
                href={r.href}
                className="shrink-0 rounded-lg bg-qt-slate px-3 py-2 text-center text-sm font-medium text-white hover:opacity-95"
              >
                {r.actionLabel}
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle>Official tools</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Jump to USCIS Case Status, processing times, e-Request, and more.
          </p>
          <Link
            href="/app/tools"
            className="mt-4 inline-block text-sm font-medium text-qt-slate underline"
          >
            Open tools hub
          </Link>
        </Card>
        <Card>
          <CardTitle>Help directory</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Filter accredited reps, nonprofits, and attorneys by region and
            language (mock data in V1).
          </p>
          <Link
            href="/app/help-directory"
            className="mt-4 inline-block text-sm font-medium text-qt-slate underline"
          >
            Browse directory
          </Link>
        </Card>
      </div>

      {plan === "FREE" ? <PremiumUpsellCard /> : null}
    </div>
  );
}
