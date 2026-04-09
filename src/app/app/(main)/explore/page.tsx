import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Explore</h1>
        <p className="mt-2 max-w-2xl text-sm text-qt-text-secondary">
          If you are not ready for a full workflow, start here. Explore explains
          what QueueTip does and how family-based pieces fit together—without
          pushing you into a path you are not ready for.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle>Immigration basics (V1 scope)</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Family-based cases often involve a petition (like I-130) and, for
            many people in the U.S., adjustment of status (I-485). Work
            authorization (I-765) and travel documents (I-131) sometimes tag
            along when eligible. Your facts determine your path.
          </p>
        </Card>
        <Card>
          <CardTitle>What QueueTip is for</CardTitle>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-qt-text-secondary">
            <li>Organizing documents and tasks</li>
            <li>Tracking receipts in one calm view</li>
            <li>Understanding status language cautiously</li>
            <li>Finding official tools quickly</li>
          </ul>
        </Card>
      </div>
      <Card>
        <CardTitle>Convert into a focused path</CardTitle>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/prepare" className={appPrimaryCtaClass}>
            Start Prepare
          </Link>
          <Link
            href="/app/track/add-case"
            className="rounded-lg border border-qt-soft-gray bg-white px-4 py-2 text-sm font-medium hover:bg-qt-mist"
          >
            Start Track
          </Link>
          <Link
            href="/app/resolve"
            className="rounded-lg border border-qt-soft-gray bg-white px-4 py-2 text-sm font-medium hover:bg-qt-mist"
          >
            Start Resolve
          </Link>
        </div>
      </Card>
    </div>
  );
}
