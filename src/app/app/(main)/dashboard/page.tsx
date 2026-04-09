import Link from "next/link";
import { auth } from "@/auth";
import { DashboardHero } from "@/components/app/dashboard/dashboard-hero";
import { DashboardNextSteps } from "@/components/app/dashboard/dashboard-next-steps";
import { DashboardSection } from "@/components/app/dashboard/dashboard-section";
import {
  PrimaryCaseEmpty,
  PrimaryCaseSnapshot,
} from "@/components/app/dashboard/primary-case-snapshot";
import { FormMixChart } from "@/components/app/form-mix-chart";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { PremiumUpsellCard } from "@/components/premium-gate";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";
import {
  buildDashboardOrientation,
  waitVsActCopy,
} from "@/lib/dashboard-orientation";
import { buildRecommendationsForUser } from "@/lib/services/recommendation-service";
import { interpretStatusLabel } from "@/lib/services/interpretation-service";
import { getPlanForUser } from "@/lib/plan";

export const dynamic = "force-dynamic";

const USCIS_LIVE = process.env.USCIS_CASE_STATUS_MODE === "live";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  let profile;
  let onb;
  let groups;
  let alerts;
  let recs;
  let plan;
  let primaryCase;
  let interpretation: Awaited<ReturnType<typeof interpretStatusLabel>> | undefined;

  try {
    [profile, onb, groups, alerts, recs, plan] = await Promise.all([
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

    primaryCase = await prisma.case.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { caseGroup: true },
    });

    interpretation = primaryCase?.currentStatusLabel?.trim()
      ? await interpretStatusLabel(primaryCase.currentStatusLabel)
      : undefined;
  } catch (e) {
    console.error("[QueueTip] /app/dashboard data load failed:", e);
    throw e;
  }

  const greeting = profile?.firstName?.trim()
    ? `Good to see you, ${profile.firstName.trim()}`
    : "Welcome to your workspace";

  const orientation = buildDashboardOrientation(onb, groups);

  const guidanceSummary =
    interpretation?.typicalMeaning ??
    interpretation?.summary ??
    "After your first sync, a labeled interpretation appears here to help you read the status line calmly. It is not a substitute for USCIS or legal advice.";

  const waitLine = waitVsActCopy(interpretation?.waitVsAct);

  const formMix: Record<string, number> = {};
  for (const g of groups) {
    for (const c of g.cases) {
      formMix[c.formType] = (formMix[c.formType] ?? 0) + 1;
    }
  }

  const topRecs = recs.slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      <DashboardHero
        greeting={greeting}
        orientation={orientation}
        plan={plan}
      />

      {primaryCase ? (
        <PrimaryCaseSnapshot
          formType={primaryCase.formType}
          receiptNumber={primaryCase.receiptNumber}
          statusLabel={primaryCase.currentStatusLabel}
          lastSyncedAt={primaryCase.lastSyncedAt}
          groupLabel={primaryCase.caseGroup.label}
          caseId={primaryCase.id}
          guidanceSummary={guidanceSummary}
          waitVsActLabel={waitLine}
          uscisLive={USCIS_LIVE}
        />
      ) : (
        <PrimaryCaseEmpty />
      )}

      <DashboardSection
        eyebrow="Guidance"
        title="Suggested next steps"
        description="Concrete actions, ordered by what usually matters first. None of this replaces checking USCIS directly when you need certainty."
      >
        <DashboardNextSteps items={topRecs} />
      </DashboardSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardSection
          className="lg:col-span-2"
          eyebrow="Workspace"
          title="Your pathways"
          description="Jump into the area that matches what you are working on. Each area keeps official sources and QueueTip guidance visually separate."
        >
          <div className="flex flex-wrap gap-2">
            <Link href="/app/prepare" className={appPrimaryCtaClass}>
              Prepare
            </Link>
            <Link
              href="/app/track"
              className="rounded-xl border border-qt-soft-gray bg-white px-4 py-2.5 text-sm font-semibold text-qt-text shadow-sm hover:bg-qt-mist"
            >
              Track
            </Link>
            <Link
              href="/app/resolve"
              className="rounded-xl border border-qt-soft-gray bg-white px-4 py-2.5 text-sm font-semibold text-qt-text shadow-sm hover:bg-qt-mist"
            >
              Resolve
            </Link>
            <Link
              href="/app/explore"
              className="rounded-xl border border-qt-soft-gray bg-white px-4 py-2.5 text-sm font-semibold text-qt-text shadow-sm hover:bg-qt-mist"
            >
              Explore
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-qt-soft-gray/80 pt-5">
            <span className="text-xs text-qt-text-muted">Onboarding:</span>
            {onb?.routedPath ? (
              <Badge tone="support">{onb.routedPath}</Badge>
            ) : (
              <span className="text-xs text-qt-text-secondary">Not set</span>
            )}
            <span className="text-xs text-qt-text-muted">
              {onb?.completed
                ? "· Complete"
                : onb?.skipped
                  ? "· Skipped (you can revisit)"
                  : "· Incomplete"}
            </span>
            <Link
              href="/app/onboarding"
              className="ml-auto text-xs font-semibold text-qt-slate underline underline-offset-2"
            >
              Review onboarding
            </Link>
          </div>
        </DashboardSection>

        <DashboardSection
          eyebrow="Portfolio"
          title="Case summary"
          description="A quick view of form mix and groups. Open any group for receipts, sync history, and labeled interpretations."
        >
          {groups.length === 0 ? (
            <p className="text-sm leading-relaxed text-qt-text-secondary">
              Receipts you add will be listed here by group.{" "}
              <Link
                href="/app/track/add-case"
                className="font-semibold text-qt-slate underline underline-offset-2"
              >
                Add a receipt
              </Link>{" "}
              to begin.
            </p>
          ) : (
            <>
              <FormMixChart counts={formMix} />
              <ul className="mt-5 space-y-3 text-sm">
                {groups.map((g) => (
                  <li
                    key={g.id}
                    className="rounded-xl border border-qt-soft-gray bg-qt-mist/25 p-4 transition-colors hover:bg-qt-mist/40"
                  >
                    <p className="font-semibold text-qt-text">
                      {g.label ?? "Case group"}
                    </p>
                    <p className="mt-0.5 text-xs text-qt-text-secondary">
                      {g.cases.length} linked form
                      {g.cases.length === 1 ? "" : "s"}
                    </p>
                    <Link
                      href={`/app/track/${g.cases[0]?.id ?? g.id}`}
                      className="mt-3 inline-flex text-sm font-semibold text-qt-slate underline decoration-qt-slate/30 underline-offset-4"
                    >
                      Open group →
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DashboardSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection
          eyebrow="Updates"
          title="Alerts"
          description="In-app notices about changes we detect or reminders you opt into. Email delivery is optional and can be wired later."
        >
          {alerts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-qt-stone-200 bg-qt-mist/20 px-5 py-8 text-center">
              <p className="text-sm font-medium text-qt-text">
                No alerts at the moment
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-qt-text-secondary">
                When we record status movement or you enable reminder
                categories, entries will appear here so you do not have to hunt
                through every screen.
              </p>
              <Link
                href="/app/settings"
                className="mt-5 inline-flex text-sm font-semibold text-qt-slate underline underline-offset-4"
              >
                Notification settings
              </Link>
            </div>
          ) : (
            <ul className="space-y-4 text-sm">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-qt-soft-gray pb-4 last:border-0 last:pb-0"
                >
                  <p className="font-semibold text-qt-text">{a.title}</p>
                  <p className="mt-1 text-qt-text-secondary">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/app/alerts"
            className="mt-5 inline-flex text-sm font-semibold text-qt-slate underline decoration-qt-slate/30 underline-offset-4"
          >
            View all alerts
          </Link>
        </DashboardSection>

        <DashboardSection
          eyebrow="Authority"
          title="Official USCIS tools"
          description="QueueTip links to the same public tools USCIS operates. Use them to confirm anything time-sensitive or legally material."
        >
          <p className="text-sm leading-relaxed text-qt-text-secondary">
            Case Status Online, posted processing ranges, e-Request, form
            downloads, and related resources—opened from one calm hub so you
            spend less time searching.
          </p>
          <Link
            href="/app/tools"
            className={`mt-5 inline-flex ${appPrimaryCtaClass}`}
          >
            Open tools hub
          </Link>
        </DashboardSection>
      </div>

      <DashboardSection
        eyebrow="Support"
        title="Help directory"
        description="When you need accredited or licensed help, filter by geography, language, and case type. Listings are illustrative in V1—verify credentials independently."
      >
        <p className="text-sm leading-relaxed text-qt-text-secondary">
          QueueTip does not endorse individual providers. This directory is a
          structured starting point for finding the right kind of professional
          when your situation warrants it.
        </p>
        <Link
          href="/app/help-directory"
          className="mt-5 inline-flex text-sm font-semibold text-qt-slate underline decoration-qt-slate/30 underline-offset-4"
        >
          Browse directory →
        </Link>
      </DashboardSection>

      {plan === "FREE" ? <PremiumUpsellCard /> : null}
    </div>
  );
}
