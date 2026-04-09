/**
 * Applies missing DB columns idempotently using DATABASE_URL.
 * Use when production errors with "column does not exist" after a deploy.
 *
 *   DATABASE_URL="postgresql://..." npm run db:ensure-schema
 *
 * Then reload Resolve content (destructive to issues):
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const statements = [
  `ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "fieldOffice" TEXT`,
  `ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "serviceCenter" TEXT`,
  `ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "priorityDate" TIMESTAMP(3)`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "urgencyLevel" TEXT NOT NULL DEFAULT 'moderate'`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "triageLane" TEXT NOT NULL DEFAULT 'review'`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "formsAffectedJson" JSONB NOT NULL DEFAULT '[]'`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "lawyerRecommended" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "officialResourceLinksJson" JSONB NOT NULL DEFAULT '[]'`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "relatedSlugsJson" JSONB NOT NULL DEFAULT '[]'`,
  `ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "whyPeopleWorry" TEXT NOT NULL DEFAULT ''`,
  // Settings / Web Push (matches prisma/migrations/20260409183000_displayname_push_subscription)
  `ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "displayName" TEXT`,
  `ALTER TABLE "NotificationPreference" ADD COLUMN IF NOT EXISTS "pushEnabled" BOOLEAN NOT NULL DEFAULT false`,
  `CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint")`,
  `CREATE INDEX IF NOT EXISTS "PushSubscription_userId_idx" ON "PushSubscription"("userId")`,
  `DO $$ BEGIN
    ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    for (const sql of statements) {
      await prisma.$executeRawUnsafe(sql);
    }
    console.log(
      "Schema ensure: OK (Case, IssueGuide, UserProfile.displayName, NotificationPreference.pushEnabled, PushSubscription).",
    );
    console.log(
      "If Resolve is empty or outdated, run: npm run db:seed  (replaces all issue guides/categories)",
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
