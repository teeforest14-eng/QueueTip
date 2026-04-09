import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PremiumUpsellCard() {
  return (
    <Card className="border-qt-primary-soft/80 bg-gradient-to-br from-qt-primary-soft/35 via-white to-qt-mist/20 shadow-[0_12px_40px_-24px_rgba(17,17,17,0.15)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <Badge tone="soft">Premium</Badge>
          <CardTitle className="mt-1 text-lg">
            Deeper compare and history when your case is active
          </CardTitle>
          <p className="text-sm leading-relaxed text-qt-text-secondary">
            Side-by-side views across grouped receipts, richer snapshot history,
            and more room for alerts—optional. Free accounts keep core tools,
            guides, and honest labeling.
          </p>
        </div>
        <Link href="/app/billing" className="shrink-0">
          <Button variant="slate" className="whitespace-nowrap px-5">
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
