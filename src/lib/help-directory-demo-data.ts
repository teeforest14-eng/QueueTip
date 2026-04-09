/**
 * Design/demo placeholder listings for the Help Directory.
 * Not vetted, not referrals — replace with real partner data before production.
 */

export const HELP_PROVIDER_TYPES = [
  "Attorney",
  "Accredited representative",
  "Nonprofit",
  "Community organization",
] as const;

export type HelpProviderType = (typeof HELP_PROVIDER_TYPES)[number];

export const HELP_CASE_TYPE_FILTERS = [
  "Family-based",
  "Employment-based",
  "Student / F-1",
  "J-1",
  "K-1 / fiancé(e)",
  "Naturalization",
  "Removal / court",
  "Asylum",
  "Humanitarian",
  "Waivers",
  "Adjustment of status",
  "Consular processing",
  "Work authorization",
  "Travel document",
  "Investor",
] as const;

export type HelpCaseTypeFilter = (typeof HELP_CASE_TYPE_FILTERS)[number];

export const HELP_LANGUAGE_FILTERS = [
  "English",
  "Spanish",
  "French",
  "Mandarin",
  "Arabic",
  "Portuguese",
  "Korean",
  "Vietnamese",
  "Hindi",
  "Tagalog",
  "Russian",
  "Haitian Creole",
  "Urdu",
  "Farsi",
] as const;

export type ConsultationMode = "remote" | "in_person" | "both";

export type HelpDirectoryListing = {
  id: string;
  slug: string;
  name: string;
  isSample: true;
  providerType: HelpProviderType;
  state: string;
  serviceRegion: string;
  languages: string[];
  caseTypes: HelpCaseTypeFilter[];
  consultationMode: ConsultationMode;
  shortDescription: string;
  longDescription: string;
  /** Intentionally empty for demo — do not invent contact channels. */
  website: null;
  phone: null;
  email: null;
  vettedStatus: "sample";
};

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

const ALL_CASE_TYPES: HelpCaseTypeFilter[] = [...HELP_CASE_TYPE_FILTERS];

const NAME_BUILDERS = [
  (s: string) => `Sample Immigration Counsel — ${s}`,
  (s: string) => `Example Immigration Law Group — ${s}`,
  (s: string) => `Placeholder Immigration Legal Support — ${s}`,
] as const;

const SHORT_TEMPLATES = [
  (s: string) =>
    `Sample listing for layout demonstration. Represents a future attorney profile serving clients across ${s} in a broad range of immigration matters.`,
  (s: string) =>
    `Placeholder profile for design and filtering. This sample entry is not a vetted referral and should be replaced with real partner data before launch. Demonstrates statewide coverage in ${s}.`,
  (s: string) =>
    `Demo-only directory card illustrating how QueueTip may present outside counsel options in ${s}. Not an endorsement; not contactable in this build.`,
  (s: string) =>
    `Design fixture for a statewide immigration practice placeholder in ${s}. Supports filter testing across languages and matter types without implying credentials.`,
] as const;

const LONG_INTROS = [
  "This entry exists solely to exercise the directory UI: cards, filters, profile layout, and disclaimers.",
  "QueueTip uses this fictional row to validate spacing, typography, and mobile behavior before partner onboarding.",
  "No bar admission, success rates, or specialties are asserted—only structural metadata for product development.",
  "When vetted partners are onboarded, this slug will be repurposed or removed by administrators.",
] as const;

function stateSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, "-");
}

function languagesForIndex(i: number): string[] {
  const pools: string[][] = [
    ["English", "Spanish"],
    ["English", "Spanish", "Portuguese"],
    ["English", "Mandarin", "Cantonese"],
    ["English", "Arabic", "French"],
    ["English", "Korean", "Spanish"],
    ["English", "Vietnamese", "French"],
    ["English", "Hindi", "Spanish"],
    ["English", "Tagalog", "Spanish"],
    ["English", "Russian", "Spanish"],
    ["English", "Spanish", "Haitian Creole"],
    ["English", "Urdu", "Hindi"],
    ["English", "Farsi", "Arabic"],
    ["English", "French", "Spanish"],
    ["English", "Portuguese", "Spanish"],
  ];
  return pools[i % pools.length]!;
}

function consultationForIndex(i: number): ConsultationMode {
  const cycle: ConsultationMode[] = ["both", "remote", "in_person", "both", "remote"];
  return cycle[i % cycle.length]!;
}

function buildListings(): HelpDirectoryListing[] {
  return US_STATES.map((state, i) => {
    const slug = `sample-counsel-${stateSlug(state)}`;
    const name = NAME_BUILDERS[i % NAME_BUILDERS.length](state);
    const shortDescription = SHORT_TEMPLATES[i % SHORT_TEMPLATES.length](state);
    const longDescription = `${LONG_INTROS[i % LONG_INTROS.length]} ${shortDescription}`;
    return {
      id: slug,
      slug,
      name,
      isSample: true,
      providerType: "Attorney",
      state,
      serviceRegion: "Statewide",
      languages: languagesForIndex(i),
      caseTypes: ALL_CASE_TYPES,
      consultationMode: consultationForIndex(i),
      shortDescription,
      longDescription,
      website: null,
      phone: null,
      email: null,
      vettedStatus: "sample",
    };
  });
}

export const HELP_DIRECTORY_LISTINGS: HelpDirectoryListing[] = buildListings();

export function getHelpListingBySlug(slug: string): HelpDirectoryListing | undefined {
  return HELP_DIRECTORY_LISTINGS.find((l) => l.slug === slug);
}

export function helpDirectoryStats() {
  const lang = new Set<string>();
  for (const l of HELP_DIRECTORY_LISTINGS) {
    for (const x of l.languages) lang.add(x);
  }
  const remoteCapable = HELP_DIRECTORY_LISTINGS.filter(
    (l) => l.consultationMode === "remote" || l.consultationMode === "both",
  ).length;
  return {
    statesRepresented: HELP_DIRECTORY_LISTINGS.length,
    languagesSupported: lang.size,
    matterTypesCovered: HELP_CASE_TYPE_FILTERS.length,
    remoteSupportListings: remoteCapable,
  };
}

/** Featured “when help matters” — maps to case type filter values. */
export const HELP_HIGH_STAKES_CHIPS: {
  label: string;
  caseType: HelpCaseTypeFilter;
  blurb: string;
}[] = [
  {
    label: "Removal / court",
    caseType: "Removal / court",
    blurb: "Court dates, pleadings, and relief often need licensed counsel.",
  },
  {
    label: "Criminal history",
    caseType: "Waivers",
    blurb: "Admissibility and waiver strategy are highly fact-specific.",
  },
  {
    label: "Prior denials",
    caseType: "Adjustment of status",
    blurb: "Re-filing or appeals require careful review of the record.",
  },
  {
    label: "Fraud / misrepresentation",
    caseType: "Waivers",
    blurb: "Allegations in this space carry serious consequences.",
  },
  {
    label: "Unlawful presence / overstay",
    caseType: "Adjustment of status",
    blurb: "Bars and exceptions are easy to misunderstand without counsel.",
  },
  {
    label: "Waiver issues",
    caseType: "Waivers",
    blurb: "I-601, I-601A, and related matters need individualized analysis.",
  },
];

export function listingMatchesConsultationFilter(
  mode: ConsultationMode,
  filter: "any" | "remote" | "in_person" | "both",
): boolean {
  if (filter === "any") return true;
  if (filter === "both") return mode === "both";
  if (filter === "remote") return mode === "remote" || mode === "both";
  return mode === "in_person" || mode === "both";
}
