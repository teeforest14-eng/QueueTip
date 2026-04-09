import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppTopNav } from "@/components/app/app-top-nav";
import { redirectIfNeedsOnboarding } from "@/lib/onboarding-flow";

export default async function MainAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  await redirectIfNeedsOnboarding(session.user.id);
  return (
    <>
      <AppTopNav email={session.user.email} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
