-- Track workspace: optional case metadata (run `prisma migrate deploy` or `prisma db push`).
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "fieldOffice" TEXT;
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "serviceCenter" TEXT;
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "priorityDate" TIMESTAMP(3);
