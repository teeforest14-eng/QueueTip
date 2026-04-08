import { auth } from "@/auth";
import { getPlanForUser } from "@/lib/plan";
import { Card, CardTitle } from "@/components/ui/card";
import { UpgradeButton } from "./upgrade-button";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const plan = await getPlanForUser(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Billing</h1>
        <p className="mt-2 text-sm text-qt-text-secondary">
          V1 uses a placeholder upgrade path. Connect Stripe (or similar) before
          charging real users.
        </p>
      </div>
      <Card>
        <CardTitle>Current plan</CardTitle>
        <p className="mt-3 text-lg font-medium text-qt-text">{plan}</p>
        {plan === "FREE" ? (
          <div className="mt-6">
            <UpgradeButton />
          </div>
        ) : (
          <p className="mt-4 text-sm text-qt-text-secondary">
            Premium is active on this account (demo toggle).
          </p>
        )}
      </Card>
    </div>
  );
}
