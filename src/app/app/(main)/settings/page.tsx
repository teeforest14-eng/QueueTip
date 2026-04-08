import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  const [profile, prefs, onb] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.notificationPreference.findUnique({ where: { userId } }),
    prisma.onboardingAnswer.findUnique({ where: { userId } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Settings</h1>
        <p className="mt-2 text-sm text-qt-text-secondary">
          Profile, notification categories, and onboarding snapshot (read-only
          summary).
        </p>
      </div>
      <Card>
        <CardTitle>Onboarding snapshot</CardTitle>
        <dl className="mt-4 grid gap-2 text-sm text-qt-text-secondary">
          <div>
            <dt className="font-medium text-qt-text">Journey</dt>
            <dd>{onb?.journeyCategory ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-qt-text">Routed path</dt>
            <dd>{onb?.routedPath ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-qt-text">Forms</dt>
            <dd>{onb?.formsInvolved?.join(", ") || "—"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-qt-text-muted">
          To change answers, revisit onboarding (future inline editor) or
          contact support in production.
        </p>
      </Card>
      <SettingsForm
        email={session.user.email ?? ""}
        profile={{
          firstName: profile?.firstName ?? "",
          lastName: profile?.lastName ?? "",
          preferredLanguage: profile?.preferredLanguage ?? "en",
          countryRegion: profile?.countryRegion ?? "",
          needsReminders: profile?.needsReminders ?? true,
          interestedLocalHelp: profile?.interestedLocalHelp ?? false,
        }}
        prefs={{
          emailEnabled: prefs?.emailEnabled ?? true,
          inAppEnabled: prefs?.inAppEnabled ?? true,
          statusChanges: prefs?.statusChanges ?? true,
          delayThresholds: prefs?.delayThresholds ?? true,
          reminders: prefs?.reminders ?? true,
          milestones: prefs?.milestones ?? true,
        }}
      />
    </div>
  );
}
