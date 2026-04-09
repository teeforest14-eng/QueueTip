import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsPageClient } from "@/components/app/settings/settings-page-client";
import { isEmailDeliveryConfigured } from "@/lib/settings-server-flags";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  const [user, profile, prefs, onb, accounts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, email: true },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.notificationPreference.findUnique({ where: { userId } }),
    prisma.onboardingAnswer.findUnique({ where: { userId } }),
    prisma.account.findMany({
      where: { userId },
      select: { provider: true, type: true },
    }),
  ]);

  if (!user) return null;

  const hasOAuth = accounts.some(
    (a) =>
      a.type === "oauth" ||
      (a.provider !== "credentials" && a.provider !== "email"),
  );
  const oauthProviders = [...new Set(accounts.map((a) => a.provider))];

  const onboardingDto = onb
    ? {
        journeyCategory: onb.journeyCategory,
        familyCaseType: onb.familyCaseType ?? "",
        alreadyFiled: onb.alreadyFiled,
        formsInvolved: [...onb.formsInvolved],
        hasReceipt: onb.hasReceipt,
        currentConcern: onb.currentConcern ?? "",
        routedPath: onb.routedPath,
        completed: onb.completed,
        skipped: onb.skipped,
      }
    : null;

  return (
    <SettingsPageClient
      email={user.email}
      createdAtIso={user.createdAt.toISOString()}
      hasOAuth={hasOAuth}
      oauthProviders={oauthProviders}
      emailDeliveryConfigured={isEmailDeliveryConfigured()}
      profile={{
        displayName: profile?.displayName ?? "",
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        preferredLanguage: profile?.preferredLanguage ?? "en",
        countryRegion: profile?.countryRegion ?? "",
        needsReminders: profile?.needsReminders ?? true,
        interestedLocalHelp: profile?.interestedLocalHelp ?? false,
      }}
      notifPrefs={{
        emailEnabled: prefs?.emailEnabled ?? true,
        inAppEnabled: prefs?.inAppEnabled ?? true,
        pushEnabled: prefs?.pushEnabled ?? false,
        statusChanges: prefs?.statusChanges ?? true,
        delayThresholds: prefs?.delayThresholds ?? true,
      }}
      onboarding={onboardingDto}
    />
  );
}
