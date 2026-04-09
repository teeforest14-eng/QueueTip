-- Idempotent: safe to run multiple times (e.g. Render SQL shell or `npm run db:ensure-schema`).
-- Fixes missing columns when deploy shipped before `prisma migrate deploy`.

-- Track / Case
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "fieldOffice" TEXT;
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "serviceCenter" TEXT;
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "priorityDate" TIMESTAMP(3);

-- Resolve / IssueGuide
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "urgencyLevel" TEXT NOT NULL DEFAULT 'moderate';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "triageLane" TEXT NOT NULL DEFAULT 'review';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "formsAffectedJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "lawyerRecommended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "officialResourceLinksJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "relatedSlugsJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "whyPeopleWorry" TEXT NOT NULL DEFAULT '';
