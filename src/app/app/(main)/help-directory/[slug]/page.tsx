import Link from "next/link";
import { notFound } from "next/navigation";
import { ResolveSurface } from "@/components/app/resolve/resolve-surface";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import {
  HELP_DIRECTORY_LISTINGS,
  getHelpListingBySlug,
} from "@/lib/help-directory-demo-data";

const surface =
  "rounded-[14px] border border-white/80 bg-white/96 shadow-[0_4px_32px_rgba(25,45,95,0.08)]";

export function generateStaticParams() {
  return HELP_DIRECTORY_LISTINGS.map((l) => ({ slug: l.slug }));
}

export default async function HelpDirectoryProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getHelpListingBySlug(slug);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav>
        <Link
          href="/app/help-directory#directory-results"
          className="text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
        >
          ← Back to directory
        </Link>
      </nav>

      <ResolveSurface className={cn(surface, "p-8 sm:p-10")}>
        <div className="flex flex-wrap gap-2">
          <Badge
            tone="soft"
            className="text-[10px] font-bold uppercase tracking-wide"
          >
            Sample listing
          </Badge>
          <Badge tone="outline">{listing.providerType}</Badge>
          <Badge tone="neutral" className="text-[10px] uppercase">
            Not vetted
          </Badge>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {listing.name}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {listing.longDescription}
        </p>
        <p className="mt-4 rounded-lg border border-amber-200/50 bg-amber-50/40 px-4 py-3 text-sm text-neutral-800">
          <span className="font-semibold">Directory note:</span> This profile is
          a non-functional placeholder. It does not represent a real firm,
          verified bar admission, or an endorsement by QueueTip.
        </p>
      </ResolveSurface>

      <ResolveSurface className={cn(surface, "p-8")}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Service profile (structure preview)
        </h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-neutral-500">State</dt>
            <dd className="mt-1 text-neutral-900">{listing.state}</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Service area</dt>
            <dd className="mt-1 text-neutral-900">{listing.serviceRegion}</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Languages</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {listing.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-950 ring-1 ring-sky-100"
                >
                  {lang}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">
              Matter types (demo breadth)
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {listing.caseTypes.map((ct) => (
                <span
                  key={ct}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800"
                >
                  {ct}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Consultation modes</dt>
            <dd className="mt-1 text-neutral-900">
              {listing.consultationMode === "remote" && "Remote"}
              {listing.consultationMode === "in_person" && "In-person"}
              {listing.consultationMode === "both" && "Remote and in-person"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Website</dt>
            <dd className="mt-1 text-neutral-500">— (not populated for demo)</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Phone</dt>
            <dd className="mt-1 text-neutral-500">— (not populated for demo)</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Email</dt>
            <dd className="mt-1 text-neutral-500">— (not populated for demo)</dd>
          </div>
        </dl>
      </ResolveSurface>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/app/help-directory#directory-results"
          className={appPrimaryCtaClassWide + " text-center"}
        >
          Back to directory
        </Link>
        <button
          type="button"
          disabled
          title="Demo listing — not contactable"
          className="cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-center text-sm font-semibold text-neutral-400"
        >
          Contact (demo)
        </button>
      </div>
    </div>
  );
}
