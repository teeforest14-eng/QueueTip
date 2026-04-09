export type ResolveTriageLane = "monitor" | "review" | "legal";
export type ResolveUrgency = "low" | "moderate" | "high" | "critical";

export type OfficialResourceLink = { label: string; url: string };

export type ResolveIssueSeed = {
  categorySlug: string;
  slug: string;
  title: string;
  summary: string;
  urgencyLevel: ResolveUrgency;
  triageLane: ResolveTriageLane;
  formsAffected: string[];
  lawyerRecommended: boolean;
  whyPeopleWorry: string;
  typicalMeaning: string;
  whatUsuallyNext: string;
  whatToPrepare: string;
  whenToWait: string;
  whenToEscalate: string;
  likelyCauses: string[];
  evidenceSignals: string[];
  nextSteps: string[];
  officialResourceLinks: OfficialResourceLink[];
  relatedSlugs: string[];
};

export const RESOLVE_CATEGORIES: Array<{
  slug: string;
  name: string;
  sortOrder: number;
}> = [
  {
    slug: "delays-and-silence",
    name: "Delays and silence",
    sortOrder: 0,
  },
  {
    slug: "notices-and-mismatch",
    name: "Notices and mismatch problems",
    sortOrder: 1,
  },
  {
    slug: "filing-and-evidence",
    name: "Filing and evidence concerns",
    sortOrder: 2,
  },
  {
    slug: "status-and-admissibility",
    name: "Status and admissibility concerns",
    sortOrder: 3,
  },
  {
    slug: "court-enforcement-legal",
    name: "Court, enforcement, and urgent legal review",
    sortOrder: 4,
  },
];

export const RESOLVE_LINKS = {
  caseStatus: {
    label: "USCIS Case Status Online",
    url: "https://egov.uscis.gov/",
  },
  processingTimes: {
    label: "USCIS processing times",
    url: "https://egov.uscis.gov/processing-times/",
  },
  eRequest: {
    label: "USCIS e-Request",
    url: "https://egov.uscis.gov/e-request",
  },
  policyManual: {
    label: "USCIS Policy Manual",
    url: "https://www.uscis.gov/policy-manual",
  },
  unlawfulPresence: {
    label: "USCIS — Unlawful presence and inadmissibility",
    url: "https://www.uscis.gov/laws-and-policy/other-resources/unlawful-presence-and-inadmissibility",
  },
  inadmissibilityVol9: {
    label: "USCIS Policy Manual — Inadmissibility (overview)",
    url: "https://www.uscis.gov/policy-manual/volume-8-part-b",
  },
  criminalGrounds: {
    label: "USCIS Policy Manual — Criminal and related grounds",
    url: "https://www.uscis.gov/policy-manual/volume-9-part-e",
  },
  eoir: {
    label: "DOJ EOIR — Immigration court online resources",
    url: "https://www.justice.gov/eoir/immigration-court-online-resource",
  },
  findLegal: {
    label: "USCIS — Finding legal advice",
    url: "https://www.uscis.gov/avoid-scams/find-legal-services",
  },
  forms: {
    label: "USCIS forms",
    url: "https://www.uscis.gov/forms",
  },
} as const;

export function resolveLinks(
  ...keys: (keyof typeof RESOLVE_LINKS)[]
): OfficialResourceLink[] {
  return keys.map((k) => ({ ...RESOLVE_LINKS[k] }));
}
