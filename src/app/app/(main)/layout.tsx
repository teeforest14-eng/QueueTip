import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppTopNav } from "@/components/app/app-top-nav";
import { DashboardLoadError } from "@/components/app/dashboard/dashboard-load-error";
import { ensureOnboardingRow } from "@/lib/onboarding-flow";

export default async function MainAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  let onb;
  try {
    onb = await ensureOnboardingRow(session.user.id);
  } catch (e) {
    console.error("[QueueTip] (main) layout ensureOnboardingRow failed:", e);
    const message =
      e instanceof Error
        ? e.message
        : typeof e === "object" &&
            e !== null &&
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : String(e);
    return (
      <>
        <AppTopNav email={session.user.email} />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <DashboardLoadError message={message} />
        </div>
      </>
    );
  }

  if (!onb.completed && !onb.skipped) {
    redirect("/app/onboarding");
  }

  return (
    <>
      <AppTopNav email={session.user.email} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
