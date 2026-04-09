/**
 * Curated official USCIS / U.S. government immigration updates for the in-app Alerts center.
 * Summaries are informational only; always read the linked official source.
 */

export type AlertSourceType =
  | "uscis"
  | "dhs"
  | "state_dept"
  | "white_house";

export type AlertCategoryId =
  | "policy_change"
  | "filing_forms"
  | "fee_update"
  | "operational_office"
  | "vetting_screening"
  | "tps_country"
  | "work_authorization"
  | "h1b_employment"
  | "travel_entry"
  | "court_enforcement";

export type AlertUrgency = "routine" | "elevated" | "high";

export type ImpactLogic = {
  /** Lowercase country names or regions; "*" = not country-specific. */
  affectedCountries: string[];
  /** User `currentStatus` ids that are especially in scope. */
  affectedStatuses: string[];
  /** User `targetBenefit` ids in scope. */
  affectedCaseTypes: string[];
  insideUSOnly?: boolean;
  outsideUSOnly?: boolean;
  pendingCasesOnly?: boolean;
  futureFilingsOnly?: boolean;
  /** Office hours / closures style — relevance is often situational. */
  operationalOnly?: boolean;
  legalHelpRecommended?: boolean;
};

export type ImmigrationAlert = {
  id: string;
  title: string;
  sourceName: string;
  sourceType: AlertSourceType;
  officialUrl: string;
  publishedDate: string;
  category: AlertCategoryId;
  urgency: AlertUrgency;
  summary: string;
  queueTipSummary: string;
  audienceTags: string[];
  countryTags: string[];
  statusTags: string[];
  caseTypeTags: string[];
  impactLogic: ImpactLogic;
  relatedActions: string[];
  tags: string[];
};

export const ALERT_CATEGORY_LABELS: Record<AlertCategoryId, string> = {
  policy_change: "Policy change",
  filing_forms: "Filing / forms update",
  fee_update: "Fee update",
  operational_office: "Operational / office closure",
  vetting_screening: "Status / vetting / screening",
  tps_country: "TPS / country-specific",
  work_authorization: "Work authorization / employment",
  h1b_employment: "H-1B / employment alert",
  travel_entry: "Travel / entry restriction",
  court_enforcement: "Court / enforcement (official reference)",
};

export const SOURCE_BADGE_LABEL: Record<AlertSourceType, string> = {
  uscis: "Official USCIS",
  dhs: "Official DHS",
  state_dept: "Official State Department",
  white_house: "Official White House",
};

/** Latest first — curated 10 official entry points and releases. */
export const IMMIGRATION_ALERTS: ImmigrationAlert[] = [
  {
    id: "uscis-photo-policy-2025",
    title:
      "New photo policy for immigration documents (Policy Manual update)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl:
      "https://www.uscis.gov/newsroom/alerts/new-photo-policy-helps-prevent-immigration-fraud-through-enhanced-identity-verification",
    publishedDate: "2025-12-12",
    category: "vetting_screening",
    urgency: "high",
    summary:
      "USCIS issued Policy Manual guidance limiting use of photos to those taken within three years of filing and ending acceptance of self-submitted photos for certain secure documents. Stated goal: identity integrity and fraud prevention.",
    queueTipSummary:
      "If you are filing I-485, I-90, N-400, or N-600, confirm whether you will need a new capture at an appointment rather than reusing an older photo. Effective dates and exceptions belong to the official alert and Policy Manual.",
    audienceTags: ["Adjustment applicants", "Naturalization", "Green card renewals"],
    countryTags: ["*"],
    statusTags: ["pending_aos", "other"],
    caseTypeTags: ["marriage_aos", "family_gc", "naturalization", "ead"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["pending_aos", "f1", "h1b", "other"],
      affectedCaseTypes: ["marriage_aos", "family_gc", "naturalization", "travel_doc"],
      futureFilingsOnly: true,
      legalHelpRecommended: false,
    },
    relatedActions: ["Review Policy Manual alert PDF linked on USCIS", "Check biometrics / photo capture instructions for your form"],
    tags: ["forms", "identity", "screening", "student_path"],
  },
  {
    id: "uscis-ead-vetting-2025",
    title: "USCIS updates employment authorization validity and vetting (Policy Manual)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl:
      "https://www.uscis.gov/newsroom/news-releases/uscis-increases-screening-vetting-of-aliens-working-in-us",
    publishedDate: "2025-12-04",
    category: "work_authorization",
    urgency: "high",
    summary:
      "USCIS published Policy Manual changes regarding maximum validity periods for certain Employment Authorization Documents and more frequent vetting for some categories, including references to statutory requirements. Scope depends on category and filing date in the official text.",
    queueTipSummary:
      "If you rely on an EAD (Form I-765), compare your category and filing date to the official release—not headlines. Shorter validity can mean more frequent renewals and filing planning.",
    audienceTags: ["EAD holders", "Pending adjustment", "TPS applicants", "Parole-based work auth"],
    countryTags: ["*"],
    statusTags: ["pending_aos", "tps", "out_of_status", "other"],
    caseTypeTags: ["ead", "marriage_aos", "family_gc", "tps", "h1b"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["pending_aos", "tps", "f1", "j1", "other"],
      affectedCaseTypes: ["ead", "tps", "marriage_aos", "family_gc"],
      pendingCasesOnly: true,
      legalHelpRecommended: true,
    },
    relatedActions: ["Read the full news release and Policy Manual citations", "Confirm your I-765 category code against USCIS tables"],
    tags: ["employment", "vetting", "ead", "student_path"],
  },
  {
    id: "uscis-vetting-center-2025",
    title: "USCIS announces specialized vetting center (operational announcement)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl:
      "https://www.uscis.gov/newsroom/news-releases/us-citizenship-and-immigration-services-establishes-new-center-to-strengthen-immigration-screening",
    publishedDate: "2025-12-05",
    category: "vetting_screening",
    urgency: "elevated",
    summary:
      "USCIS announced establishment of a centralized vetting-focused unit and described broader screening priorities tied to national security goals. Operational details and case impacts evolve on USCIS timelines.",
    queueTipSummary:
      "This is mostly structural and process-oriented. Your practical step is to monitor case status and official notices; do not assume a specific delay pattern without USCIS confirmation.",
    audienceTags: ["All petitioners and applicants"],
    countryTags: ["*"],
    statusTags: ["*"],
    caseTypeTags: ["*"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["*"],
      affectedCaseTypes: ["*"],
      legalHelpRecommended: true,
    },
    relatedActions: ["Follow USCIS newsroom for implementation updates", "Retain copies of filings and RFE responses"],
    tags: ["vetting", "operations", "screening"],
  },
  {
    id: "uscis-electronic-payments-2025",
    title: "Electronic payments for paper-filed USCIS forms",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl:
      "https://www.uscis.gov/newsroom/news-releases/uscis-to-mandate-electronic-payments-for-applications",
    publishedDate: "2025-10-28",
    category: "filing_forms",
    urgency: "elevated",
    summary:
      "USCIS described transition to electronic payment methods (e.g., card via G-1450, ACH via G-1650) for many paper filings, with exemptions documented on Form G-1651 where applicable.",
    queueTipSummary:
      "Before mailing a package, confirm acceptable payment methods for each form on the official form instructions and fee page. Paper checks may be invalid for some filings after stated effective dates.",
    audienceTags: ["Paper filers", "Attorneys and representatives"],
    countryTags: ["*"],
    statusTags: ["*"],
    caseTypeTags: ["*"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["*"],
      affectedCaseTypes: ["*"],
      futureFilingsOnly: true,
    },
    relatedActions: ["Download current G-1450 / G-1650 / G-1651 from USCIS", "Verify fee payment section of your checklist"],
    tags: ["filing", "fees", "operations", "student_path"],
  },
  {
    id: "uscis-newsroom-alerts-hub",
    title: "USCIS Alerts — searchable official updates",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl: "https://www.uscis.gov/newsroom/alerts",
    publishedDate: "2026-04-01",
    category: "policy_change",
    urgency: "routine",
    summary:
      "Primary USCIS index for time-sensitive alerts, policy notices, and operational announcements. Use filters by topic and date when researching a change that may touch your form type.",
    queueTipSummary:
      "Bookmark this hub and compare any third-party summary to the linked USCIS primary document. Dates and effective language matter more than headlines.",
    audienceTags: ["All users"],
    countryTags: ["*"],
    statusTags: ["*"],
    caseTypeTags: ["*"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["*"],
      affectedCaseTypes: ["*"],
    },
    relatedActions: ["Subscribe to USCIS email updates if you want primary notices", "Cross-check Explore and Prepare against the same primary sources"],
    tags: ["hub", "research", "student_path"],
  },
  {
    id: "uscis-filing-fees",
    title: "USCIS filing fees (official schedule)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl: "https://www.uscis.gov/forms/filing-fees",
    publishedDate: "2026-03-20",
    category: "fee_update",
    urgency: "elevated",
    summary:
      "Authoritative fee amounts and payment rules for USCIS forms. Fee rules change with Federal Register processes; always match the edition date you intend to file under.",
    queueTipSummary:
      "Build your fee sheet the week you file. If you mailed an old fee amount, USCIS may reject or return the package per published rules.",
    audienceTags: ["All filers"],
    countryTags: ["*"],
    statusTags: ["*"],
    caseTypeTags: ["*"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["*"],
      affectedCaseTypes: ["*"],
      futureFilingsOnly: true,
    },
    relatedActions: ["Open the fee table for each form in your package", "Confirm fee exemption or waiver rules only on USCIS"],
    tags: ["fees", "forms"],
  },
  {
    id: "dos-visa-bulletin",
    title: "Visa Bulletin (priority dates and availability)",
    sourceName: "U.S. Department of State",
    sourceType: "state_dept",
    officialUrl:
      "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    publishedDate: "2026-04-01",
    category: "policy_change",
    urgency: "routine",
    summary:
      "Monthly State Department publication used with DOS and USCIS guidance to understand immigrant visa availability and certain adjustment filing charts when applicable to your category.",
    queueTipSummary:
      "If you are consular processing or adjusting in a preference category, learn how to read “Final Action Dates” vs “Dates for Filing” from State and USCIS instructions—not from informal charts alone.",
    audienceTags: ["Family preference", "Employment-based", "Consular applicants"],
    countryTags: ["*"],
    statusTags: ["pending_aos", "other"],
    caseTypeTags: ["family_gc", "eb_gc", "consular", "marriage_aos"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["pending_aos", "other"],
      affectedCaseTypes: ["family_gc", "eb_gc", "consular", "marriage_aos"],
      insideUSOnly: false,
    },
    relatedActions: ["Open the current and prior bulletins for trend context", "Confirm which chart USCIS uses for your month on USCIS “Dates for Filing” pages when relevant"],
    tags: ["visa bulletin", "priority date"],
  },
  {
    id: "uscis-tps-overview",
    title: "Temporary Protected Status (USCIS overview)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl: "https://www.uscis.gov/humanitarian/temporary-protected-status",
    publishedDate: "2026-03-15",
    category: "tps_country",
    urgency: "elevated",
    summary:
      "USCIS hub for TPS designations, registrations, and employment authorization tied to specific countries and Federal Register notices. Country eligibility and deadlines change by statute and designation.",
    queueTipSummary:
      "TPS is country- and period-specific. Verify your country’s current designation, registration windows, and EAD auto-extension rules only from Federal Register and USCIS—not generalized news.",
    audienceTags: ["TPS-eligible nationals", "Employers of TPS workers"],
    countryTags: ["*"],
    statusTags: ["tps", "other"],
    caseTypeTags: ["tps", "ead"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["tps", "other"],
      affectedCaseTypes: ["tps", "ead"],
      legalHelpRecommended: true,
    },
    relatedActions: ["Locate your country’s latest Federal Register notice", "Track EAD expiration and renewal rules published by USCIS"],
    tags: ["tps", "humanitarian"],
  },
  {
    id: "uscis-h1b-hub",
    title: "H-1B specialty occupations (USCIS hub)",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl:
      "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
    publishedDate: "2026-03-10",
    category: "h1b_employment",
    urgency: "routine",
    summary:
      "Central USCIS reference for H-1B eligibility concepts, cap processes, and links to registration and petition filing guidance. Cap timelines and selection processes update each fiscal year.",
    queueTipSummary:
      "If you are cap-subject, treat registration dates and selection notices as controlling. Non-cap H-1B paths have different evidence rules—confirm on USCIS pages for your lane.",
    audienceTags: ["Employers", "H-1B workers", "Cap registrants"],
    countryTags: ["*"],
    statusTags: ["h1b", "other"],
    caseTypeTags: ["h1b", "eb_gc"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["h1b", "other"],
      affectedCaseTypes: ["h1b", "eb_gc", "ead"],
    },
    relatedActions: ["Review cap registration instructions for the current FY", "Cross-read DOL LCA requirements where applicable"],
    tags: ["h-1b", "employment"],
  },
  {
    id: "uscis-office-closings",
    title: "USCIS office closings and emergencies",
    sourceName: "U.S. Citizenship and Immigration Services",
    sourceType: "uscis",
    officialUrl: "https://www.uscis.gov/about-us/office-closings",
    publishedDate: "2026-03-28",
    category: "operational_office",
    urgency: "elevated",
    summary:
      "Official USCIS page for weather-related closures, emergencies, and operational disruptions affecting appointments and in-person services. Content changes frequently with events.",
    queueTipSummary:
      "Before traveling to a field office or ASC appointment, check this page the same day. Reschedule only through official USCIS channels referenced in your notice.",
    audienceTags: ["Anyone with appointments", "Infopass / ASC visitors"],
    countryTags: ["*"],
    statusTags: ["*"],
    caseTypeTags: ["*"],
    impactLogic: {
      affectedCountries: ["*"],
      affectedStatuses: ["*"],
      affectedCaseTypes: ["*"],
      insideUSOnly: true,
      operationalOnly: true,
    },
    relatedActions: ["Re-check the page on your appointment date", "Keep receipt and appointment notices accessible offline"],
    tags: ["office_closure", "operational", "emergency"],
  },
];

export const SORTED_ALERTS = [...IMMIGRATION_ALERTS].sort(
  (a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
);

export const FEATURED_ALERTS = SORTED_ALERTS.slice(0, 10);

export type UserAlertProfile = {
  nationality: string;
  location: "inside" | "outside";
  currentStatus: string;
  targetBenefit: string;
  caseStage: string;
  ageRange?: string;
  pendingCase?: boolean;
};

export type ImpactResult = {
  relevance: "high" | "possible" | "low";
  relevanceLabel: string;
  whyMatters: string[];
  verifyFirst: string[];
  nextChecks: string[];
  legalHelpNote?: string;
};

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function wildOrIncludes(haystack: string[], needle: string): boolean {
  if (haystack.includes("*")) return true;
  const n = norm(needle);
  if (!n || n === "unspecified" || n === "none") return haystack.length === 0 || haystack.includes("*");
  return haystack.some((h) => n.includes(norm(h)) || norm(h).includes(n));
}

function tagOverlap(alertVals: string[], userVal: string): boolean {
  if (alertVals.includes("*")) return true;
  if (!userVal || userVal === "none") return false;
  return alertVals.includes(userVal);
}

export function computeImmigrationAlertImpact(
  alert: ImmigrationAlert,
  user: UserAlertProfile,
): ImpactResult {
  const L = alert.impactLogic;
  let score = 0;
  const notes: string[] = [];

  if (!wildOrIncludes(L.affectedCountries, user.nationality)) {
    score -= 4;
    notes.push(
      "This update appears more tightly tied to specific nationalities or regions in official materials—your stated nationality may place it lower on your personal checklist unless the source text says otherwise.",
    );
  } else {
    score += 1;
  }

  if (L.insideUSOnly && user.location === "outside") {
    score -= 3;
    notes.push(
      "The official materials may emphasize people physically present in the United States (e.g., appointments or domestic filing steps).",
    );
  }
  if (L.outsideUSOnly && user.location === "inside") {
    score -= 3;
    notes.push(
      "The official materials may emphasize consular or overseas steps more than domestic processing.",
    );
  }

  if (L.pendingCasesOnly && user.pendingCase === false) {
    score -= 2;
    notes.push(
      "Some provisions apply to pending applications as of a stated date—if you have not yet filed, different rules may apply.",
    );
  }

  if (L.futureFilingsOnly && user.caseStage === "filed") {
    score += 1;
  }
  if (L.futureFilingsOnly && user.caseStage === "preparing") {
    score += 2;
  }

  const stHit = tagOverlap(L.affectedStatuses, user.currentStatus);
  const ctHit = tagOverlap(
    L.affectedCaseTypes as string[],
    user.targetBenefit,
  );
  if (stHit) score += 2;
  if (ctHit) score += 2;
  if (!stHit && !ctHit && L.affectedStatuses[0] !== "*") {
    score -= 1;
  }

  if (alert.urgency === "high") score += 1;
  if (alert.category === "operational_office" && user.location === "inside") {
    score += 1;
  }

  let relevance: ImpactResult["relevance"];
  if (score >= 4) relevance = "high";
  else if (score >= 1) relevance = "possible";
  else relevance = "low";

  const relevanceLabel =
    relevance === "high"
      ? "High relevance — worth reading the official source soon"
      : relevance === "possible"
        ? "Possible relevance — confirm with the official text against your facts"
        : "Low / uncertain relevance — still skim the hub if you are in a related category";

  const whyMatters = [
    ...notes,
    `QueueTip does not predict outcomes. Use your location (${user.location === "inside" ? "inside the U.S." : "outside the U.S."}), status selection, and target benefit only as orientation to read USCIS or DOS primary sources.`,
  ];

  const verifyFirst = [
    "Effective date language in the official notice (immediate vs phased).",
    "Whether the change applies only to certain forms, categories, or receipt date cohorts.",
    "Whether you have a pending case, a future filing, or both—and which the rule discusses.",
    "Any geographic limits (U.S. only, consular only, or specific countries).",
  ];

  const nextChecks = [
    `Open the official link for “${alert.title}” and read the full text.`,
    "Compare your receipt notices, form editions, and fee amounts to the date on the official page.",
    "If the topic touches employment, travel, or screening, consider Resolve or Help Directory for structured next thinking—not a substitute for counsel.",
    ...alert.relatedActions.slice(0, 2),
  ];

  let legalHelpNote: string | undefined;
  if (
    L.legalHelpRecommended ||
    alert.category === "travel_entry" ||
    alert.category === "court_enforcement" ||
    alert.tags.includes("vetting")
  ) {
    legalHelpNote =
      "Topics like vetting changes, work authorization cuts, TPS, or enforcement-related updates can have serious consequences depending on your facts. A qualified immigration attorney or DOJ-accredited representative may be appropriate—QueueTip cannot assess your situation.";
  }

  return {
    relevance,
    relevanceLabel,
    whyMatters,
    verifyFirst,
    nextChecks,
    legalHelpNote,
  };
}

export function alertHaystack(a: ImmigrationAlert): string {
  return [
    a.title,
    a.summary,
    a.queueTipSummary,
    ...a.audienceTags,
    ...a.countryTags,
    ...a.tags,
    ALERT_CATEGORY_LABELS[a.category],
  ]
    .join(" ")
    .toLowerCase();
}

export const AUDIENCE_FILTER_OPTIONS = [
  { id: "all", label: "All audiences" },
  { id: "employment", label: "Employment & work authorization" },
  { id: "family", label: "Family-based & marriage" },
  { id: "student", label: "Students & exchange visitors" },
  { id: "humanitarian", label: "TPS & humanitarian" },
  { id: "naturalization", label: "Naturalization & citizenship" },
  { id: "operational", label: "Field offices & appointments" },
] as const;

export type AudienceFilterId = (typeof AUDIENCE_FILTER_OPTIONS)[number]["id"];

export function alertMatchesAudience(
  alert: ImmigrationAlert,
  id: AudienceFilterId,
): boolean {
  if (id === "all") return true;
  switch (id) {
    case "employment":
      return (
        alert.category === "work_authorization" ||
        alert.category === "h1b_employment" ||
        alert.tags.includes("employment") ||
        alert.tags.includes("ead")
      );
    case "family":
      return (
        alert.caseTypeTags.includes("family_gc") ||
        alert.caseTypeTags.includes("marriage_aos") ||
        alert.audienceTags.some((t) => /family|marriage|preference/i.test(t))
      );
    case "student":
      return (
        alert.tags.includes("student_path") ||
        alert.statusTags.includes("f1") ||
        alert.statusTags.includes("j1")
      );
    case "humanitarian":
      return (
        alert.category === "tps_country" ||
        alert.tags.includes("tps") ||
        alert.tags.includes("humanitarian")
      );
    case "naturalization":
      return (
        alert.caseTypeTags.includes("naturalization") ||
        alert.title.toLowerCase().includes("naturalization")
      );
    case "operational":
      return (
        alert.category === "operational_office" ||
        alert.tags.includes("office_closure") ||
        alert.tags.includes("operational")
      );
    default:
      return true;
  }
}

/** Filter IDs aligned with analyzer `targetBenefit` options. */
export const ALERT_CASE_TYPE_FILTER_IDS = [
  { id: "all", label: "All matter types" },
  { id: "family_gc", label: "Family-based green card" },
  { id: "marriage_aos", label: "Marriage-based adjustment" },
  { id: "ead", label: "Work permit (EAD)" },
  { id: "travel_doc", label: "Travel document" },
  { id: "student", label: "Student status" },
  { id: "h1b", label: "H-1B" },
  { id: "eb_gc", label: "Employment-based green card" },
  { id: "naturalization", label: "Naturalization" },
  { id: "tps", label: "TPS" },
  { id: "consular", label: "Consular processing" },
  { id: "other", label: "Other" },
] as const;

export type AlertCaseTypeFilterId =
  (typeof ALERT_CASE_TYPE_FILTER_IDS)[number]["id"];

export function alertMatchesCaseTypeFilter(
  alert: ImmigrationAlert,
  id: AlertCaseTypeFilterId,
): boolean {
  if (id === "all") return true;
  return (
    alert.caseTypeTags.includes(id) || alert.caseTypeTags.includes("*")
  );
}
