import Link from "next/link";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";

export function DashboardLoadError({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-red-200/90 bg-white p-8 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700/90">
          Workspace data
        </p>
        <h1 className="mt-2 font-display text-xl font-semibold text-qt-text">
          We couldn’t load your dashboard
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
          The app could not read your account data from the database. This is
          almost always a{" "}
          <span className="font-medium text-qt-text">DATABASE_URL</span>,{" "}
          <span className="font-medium text-qt-text">SSL</span>, or{" "}
          <span className="font-medium text-qt-text">migration</span> issue on
          the host that serves this site—not your password.
        </p>
      </div>
      <pre className="max-h-48 overflow-auto rounded-xl bg-neutral-100 p-4 font-mono text-[11px] leading-relaxed text-neutral-800">
        {message}
      </pre>
      <ul className="list-inside list-disc space-y-2 text-sm text-qt-text-secondary">
        <li>
          Run{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
            npx prisma migrate deploy
          </code>{" "}
          using the same{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
            DATABASE_URL
          </code>{" "}
          as production (Render/Netlify env).
        </li>
        <li>
          For managed Postgres, add SSL if required, e.g.{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px]">
            ?sslmode=require
          </code>
          .
        </li>
        <li>
          While signed in, open{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
            /api/debug/app-load
          </code>{" "}
          to see which query fails.
        </li>
      </ul>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/app/tools" className={appPrimaryCtaClass}>
          Open tools hub
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-qt-soft-gray bg-white px-4 py-2.5 text-sm font-semibold text-qt-text shadow-sm"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
