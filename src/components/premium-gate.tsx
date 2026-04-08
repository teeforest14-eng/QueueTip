import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PremiumUpsellCard() {
  return (
    <Card className="border-qt-primary-soft bg-gradient-to-br from-qt-primary-soft/40 to-qt-bg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="soft">Premium</Badge>
          <CardTitle className="mt-2">Go deeper when you are ready</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Richer compare views, saved workflows, and expanded alerts—without
            locking the basics that build trust.
          </p>
        </div>
        <Link href="/app/billing">
          <Button variant="slate" className="whitespace-nowrap">
            View plans
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function PremiumLockInline() {
  return (
    <p className="text-sm text-qt-text-muted">
      This detail is a{" "}
      <Link href="/app/billing" className="font-medium text-qt-slate underline">
        Premium
      </Link>{" "}
      view. Estimates stay range-based; we never promise outcomes.
    </p>
  );
}
