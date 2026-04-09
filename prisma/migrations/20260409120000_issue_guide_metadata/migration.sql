-- IssueGuide: Resolve premium metadata (card filters, detail template, legal routing)
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "urgencyLevel" TEXT NOT NULL DEFAULT 'moderate';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "triageLane" TEXT NOT NULL DEFAULT 'review';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "formsAffectedJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "lawyerRecommended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "officialResourceLinksJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "relatedSlugsJson" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "IssueGuide" ADD COLUMN IF NOT EXISTS "whyPeopleWorry" TEXT NOT NULL DEFAULT '';
