import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { ensureOnboardingRow } from "@/lib/onboarding-flow";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const onb = await ensureOnboardingRow(session.user.id);
  if (onb.completed || onb.skipped) {
    redirect("/app/dashboard");
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-qt-text">
        Let’s personalize QueueTip
      </h1>
      <p className="mt-2 text-sm text-qt-text-secondary">
        You can skip and return anytime—answers are saved to your profile.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-qt-text-secondary">Loading…</p>}>
          <OnboardingWizard initialStep={onb.lastStep} />
        </Suspense>
      </div>
    </div>
  );
}
