/**
 * Explore path guidance — informational only, USCIS-anchored.
 * Not legal advice; does not determine eligibility.
 */

export type ExploreSelectOption = { id: string; label: string };

export const EXPLORE_DESTINATIONS: ExploreSelectOption[] = [
  { id: "family_immediate", label: "Family-based green card — immediate relative" },
  { id: "family_preference", label: "Family-based green card — family preference" },
  { id: "marriage_aos", label: "Marriage-based adjustment of status" },
  { id: "consular_family", label: "Consular processing — family-based (outside U.S.)" },
  { id: "k1_fiance", label: "Fiancé(e) — K-1 path" },
  { id: "f1_student", label: "Student — F-1" },
  { id: "change_to_f1", label: "Change of status to F-1 (or M)" },
  { id: "j1_exchange", label: "Exchange visitor — J-1" },
  { id: "h1b", label: "Employment — H-1B specialty occupation" },
  { id: "eb_green_card", label: "Employment-based green card (e.g. EB-2 / PERM path)" },
  { id: "eb5_investor", label: "Investor — EB-5" },
  { id: "cos_general", label: "Change of nonimmigrant status (general)" },
  { id: "aos_general", label: "Adjustment of status (general — inside U.S.)" },
  { id: "consular_general", label: "Consular processing (general — outside U.S.)" },
];

export const EXPLORE_STATUSES: ExploreSelectOption[] = [
  { id: "not_selected", label: "Not sure / still mapping my situation" },
  { id: "visitor", label: "Visitor — B-1 / B-2 (or similar nonimmigrant)" },
  { id: "f1", label: "F-1 student" },
  { id: "j1", label: "J-1 exchange visitor" },
  { id: "h1b", label: "H-1B" },
  { id: "k1", label: "K-1 fiancé(e)" },
  { id: "pending_aos", label: "Pending adjustment of status (I-485 filed)" },
  { id: "pending_cos", label: "Pending extension or change of status" },
  { id: "out_of_status", label: "Out of status / status concern" },
  { id: "outside_no_status", label: "Outside the U.S. — no U.S. status" },
  { id: "usc_petitioner", label: "U.S. citizen — petitioner / sponsor context" },
  { id: "lpr_petitioner", label: "Green card holder — petitioner context" },
  { id: "employer_context", label: "Employer / sponsor organization context" },
  { id: "investor_context", label: "Investor / capital placement context" },
];

export const EXPLORE_LOCATIONS: ExploreSelectOption[] = [
  { id: "inside", label: "Inside the United States" },
  { id: "outside", label: "Outside the United States" },
];

export const EXPLORE_STAGES: ExploreSelectOption[] = [
  { id: "researching", label: "Just researching" },
  { id: "preparing", label: "Preparing to file" },
  { id: "filed", label: "Already filed" },
  { id: "receipt", label: "Waiting for receipt notice" },
  { id: "biometrics", label: "Waiting for biometrics" },
  { id: "interview", label: "Waiting for interview" },
  { id: "decision", label: "Waiting for decision" },
  { id: "need_ead", label: "Need work authorization" },
  { id: "need_travel", label: "Need travel document / parole context" },
  { id: "need_cos", label: "Need to change or extend status" },
  { id: "problem", label: "Need to respond to a problem (RFE, NOID, denial, etc.)" },
];

export type ExploreInput = {
  destination: string;
  status: string;
  location: string;
  stage: string;
};

export type ExploreGuidance = {
  headline: string;
  pathInvolves: string;
  verifyFirst: string[];
  likelyNextSteps: string[];
  formsOftenInvolved: string[];
  insideVsAbroad: string;
  officialLinks: { label: string; url: string }[];
  typicalFlow: string[];
  decisionPoints: string[];
  waitingPoints: string[];
  nextChecks: string[];
  gatherInfo: string[];
  queueTipNext: { label: string; href: string }[];
  legalHelpImportant: boolean;
  legalHelpNote?: string;
};

export const USCIS_HUB_LINKS: { label: string; url: string; blurb: string }[] = [
  {
    label: "Family of U.S. citizens",
    url: "https://www.uscis.gov/family/family-of-us-citizens",
    blurb: "Official overview of petitions and pathways for relatives of U.S. citizens.",
  },
  {
    label: "Green card processes and procedures",
    url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures",
    blurb: "Adjustment of status, consular processing, and how pieces fit together.",
  },
  {
    label: "Adjustment of status",
    url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/adjustment-of-status",
    blurb: "Applying for permanent residence while inside the United States.",
  },
  {
    label: "Consular processing",
    url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/consular-processing",
    blurb: "Immigrant visa processing through the Department of State when abroad.",
  },
  {
    label: "Change of nonimmigrant status",
    url: "https://www.uscis.gov/visit-united-states/change-my-nonimmigrant-status",
    blurb: "When you seek a different nonimmigrant category from inside the U.S.",
  },
  {
    label: "K-1 fiancé(e) visas",
    url: "https://www.uscis.gov/family/family-of-us-citizens/visas-for-fiancees-of-us-citizens",
    blurb: "I-129F and the path to marriage within 90 days of entry as stated by USCIS.",
  },
  {
    label: "Changing to F or M student status",
    url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment/changing-to-a-nonimmigrant-f-or-m-student-status",
    blurb: "USCIS materials on moving into F or M student status.",
  },
  {
    label: "Students and exchange visitors (hub)",
    url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors",
    blurb: "F, M, and J topics where USCIS adjudicates or guides filings.",
  },
  {
    label: "H-1B specialty occupations",
    url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
    blurb: "Employer-sponsored specialty worker classification.",
  },
  {
    label: "Employment-based permanent workers",
    url: "https://www.uscis.gov/working-in-the-united-states/permanent-workers",
    blurb: "EB categories including EB-2 where applicable.",
  },
  {
    label: "EB-5 Immigrant Investor Program",
    url: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program",
    blurb: "Official investor-based permanent residence pathway.",
  },
  {
    label: "Immediate relatives of U.S. citizens",
    url: "https://www.uscis.gov/green-card/green-card-eligibility/green-card-for-immediate-relatives-of-us-citizen",
    blurb: "Eligibility framing for certain close relatives of citizens.",
  },
  {
    label: "Find legal services (USCIS)",
    url: "https://www.uscis.gov/avoid-scams/find-legal-services",
    blurb: "How to identify authorized immigration legal help.",
  },
];

const L = {
  aos: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/adjustment-of-status",
  consular:
    "https://www.uscis.gov/green-card/green-card-processes-and-procedures/consular-processing",
  cos: "https://www.uscis.gov/visit-united-states/change-my-nonimmigrant-status",
  family: "https://www.uscis.gov/family/family-of-us-citizens",
  immediate:
    "https://www.uscis.gov/green-card/green-card-eligibility/green-card-for-immediate-relatives-of-us-citizen",
  preference:
    "https://www.uscis.gov/green-card/green-card-eligibility/green-card-for-family-members-of-permanent-resident",
  k1: "https://www.uscis.gov/family/family-of-us-citizens/visas-for-fiancees-of-us-citizens",
  f1change:
    "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment/changing-to-a-nonimmigrant-f-or-m-student-status",
  students: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors",
  h1b: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
  eb: "https://www.uscis.gov/working-in-the-united-states/permanent-workers",
  eb5: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program",
  forms: "https://www.uscis.gov/forms",
  caseStatus: "https://egov.uscis.gov/",
  processing: "https://egov.uscis.gov/processing-times/",
};

function legalTrigger(input: ExploreInput): { flag: boolean; note?: string } {
  if (input.status === "out_of_status") {
    return {
      flag: true,
      note: "Status gaps, unlawful presence, and cure options are legally dense. An attorney or DOJ-accredited representative should assess your facts before you file or travel.",
    };
  }
  if (input.stage === "problem") {
    return {
      flag: true,
      note: "RFEs, NOIDs, denials, and court notices have strict deadlines and consequences. Qualified help is often appropriate even when you otherwise self-file.",
    };
  }
  if (
    input.status === "j1" &&
    ["family_immediate", "marriage_aos", "eb_green_card", "h1b"].includes(
      input.destination,
    )
  ) {
    return {
      flag: true,
      note: "J-1 categories may involve exchange rules, home-residency, or waivers. USCIS and Department of State roles differ by case—get individualized legal advice before assuming a path.",
    };
  }
  if (input.destination === "eb5_investor" || input.status === "investor_context") {
    return {
      flag: true,
      note: "EB-5 involves investment, project, and admissibility issues that are not suitable for self-diagnosis from general guidance.",
    };
  }
  return { flag: false };
}

function stageAddendum(stage: string): {
  nextChecks: string[];
  waiting: string[];
  qt: { label: string; href: string }[];
} {
  const qt = (labels: [string, string][]) =>
    labels.map(([label, href]) => ({ label, href }));
  switch (stage) {
    case "researching":
      return {
        nextChecks: [
          "Identify your current nonimmigrant or immigrant category from your most recent I-94 and notices.",
          "Download the current USCIS form edition for any form you might file—edition date matters.",
        ],
        waiting: ["Research is normal; avoid paying for unverifiable “guaranteed” outcomes."],
        qt: qt([
          ["Open Prepare for a structured checklist", "/app/prepare"],
          ["Browse official tools", "/app/tools"],
        ]),
      };
    case "preparing":
      return {
        nextChecks: [
          "Confirm passport validity, civil documents, and translation rules in USCIS instructions.",
          "List every U.S. entry and status change you have had.",
        ],
        waiting: [
          "Preparation often takes longer than expected—build a dated evidence folder before mailing.",
        ],
        qt: qt([
          ["Use Prepare", "/app/prepare"],
          ["Resolve — if something already went wrong", "/app/resolve"],
        ]),
      };
    case "filed":
    case "receipt":
      return {
        nextChecks: [
          "Save receipt numbers; check USCIS Case Status for each form separately.",
          "Confirm USCIS has your current mailing address.",
        ],
        waiting: [
          "Receipt notices and case creation can lag mailing or online display.",
        ],
        qt: qt([["Track receipts in one workspace", "/app/track"]]),
      };
    case "biometrics":
      return {
        nextChecks: [
          "Bring required ID to the ASC; keep a copy of the appointment notice.",
        ],
        waiting: [
          "After biometrics, many cases enter a quiet internal review period.",
        ],
        qt: qt([["Track", "/app/track"]]),
      };
    case "interview":
      return {
        nextChecks: [
          "Review your entire filed packet for consistency before the interview.",
        ],
        waiting: ["Interview scheduling varies widely by office and category."],
        qt: qt([
          ["Track", "/app/track"],
          ["Resolve — interview surprises", "/app/resolve"],
        ]),
      };
    case "decision":
      return {
        nextChecks: [
          "Read any decision notice in full before taking next steps.",
        ],
        waiting: ["Decisions can be favorable, a request for more evidence, or denial—each has different timing."],
        qt: qt([
          ["Resolve — denials and next steps", "/app/resolve"],
          ["Help Directory", "/app/help-directory"],
        ]),
      };
    case "need_ead":
      return {
        nextChecks: [
          "Confirm whether I-765 is appropriate for your category and current edition.",
          "Compare wait to posted I-765 processing times.",
        ],
        waiting: ["Expedite criteria are narrow—verify on USCIS before assuming eligibility."],
        qt: qt([["Track I-765 with other forms", "/app/track"]]),
      };
    case "need_travel":
      return {
        nextChecks: [
          "If you have a pending adjustment, understand advance parole rules before international travel.",
        ],
        waiting: ["Travel while a petition is pending can carry serious risk without proper authorization."],
        qt: qt([["Track", "/app/track"], ["Resolve", "/app/resolve"]]),
      };
    case "need_cos":
      return {
        nextChecks: [
          "Read USCIS change-of-status instructions for your target category.",
          "Maintain lawful status until a decision when possible—gaps change options.",
        ],
        waiting: ["USCIS processing times for changes of status are estimates only."],
        qt: qt([["Prepare", "/app/prepare"], ["Resolve", "/app/resolve"]]),
      };
    case "problem":
      return {
        nextChecks: [
          "Calendar any deadline from a notice the day you receive it.",
          "Gather proof of what you already submitted.",
        ],
        waiting: [],
        qt: qt([
          ["Resolve issue library", "/app/resolve"],
          ["Help Directory", "/app/help-directory"],
        ]),
      };
    default:
      return { nextChecks: [], waiting: [], qt: qt([["Prepare", "/app/prepare"]]) };
  }
}

function statusAddendum(status: string): string[] {
  const out: string[] = [];
  if (status === "visitor") {
    out.push(
      "B visitors must not work without authorization; intent at entry and subsequent filings must align with visa rules.",
    );
  }
  if (status === "pending_aos") {
    out.push(
      "Pending adjustment may interact with travel, work authorization, and any underlying nonimmigrant status—verify each notice.",
    );
  }
  if (status === "usc_petitioner" || status === "lpr_petitioner") {
    out.push(
      "Petitioners file forms and support evidence; beneficiaries may consular process or adjust depending on facts and visa bulletin.",
    );
  }
  if (status === "employer_context") {
    out.push(
      "Employer filings (e.g. I-129, PERM-related steps) have separate timelines from beneficiary adjustment or visa issuance.",
    );
  }
  return out;
}

type DestCore = {
  pathInvolves: string;
  forms: string[];
  links: { label: string; url: string }[];
  typical: string[];
  decisions: string[];
};

const DEST: Record<string, DestCore> = {
  family_immediate: {
    pathInvolves:
      "A U.S. citizen typically files a family petition for an immediate relative; the beneficiary may adjust inside the U.S. if eligible or process through an immigrant visa abroad.",
    forms: ["I-130 (petition)", "I-485 (if adjusting)", "DS-260 / IV steps (if consular)", "I-864 (support, when required)"],
    links: [
      { label: "Immediate relatives", url: L.immediate },
      { label: "Family of U.S. citizens", url: L.family },
      { label: "Adjustment of status", url: L.aos },
      { label: "Consular processing", url: L.consular },
    ],
    typical: [
      "Petition filed → USCIS adjudication → either AOS package or NVC / consular steps.",
      "Medical exam and civil documents are collected per instructions for the path you use.",
    ],
    decisions: [
      "Eligible to adjust in the U.S. vs must consular process depends on lawful inspection, status, and visa bulletin (if applicable).",
    ],
  },
  family_preference: {
    pathInvolves:
      "Family preference categories have numerical limits; a visa must be available (visa bulletin) before the final green card step, whether AOS or consular.",
    forms: ["I-130", "I-485 or DS-260 path", "I-864 when required"],
    links: [
      { label: "Family preference overview", url: L.preference },
      { label: "Visa bulletin (DOS)", url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
      { label: "Adjustment of status", url: L.aos },
      { label: "Consular processing", url: L.consular },
    ],
    typical: [
      "I-130 approval → wait for priority date to be current → file I-485 or start IV steps.",
    ],
    decisions: [
      "Cross-chargeability and derivatives can change timing—verify with official charts and counsel if unsure.",
    ],
  },
  marriage_aos: {
    pathInvolves:
      "Marriage-based adjustment usually combines a family petition (or concurrent filing strategy when permitted) with I-485 for those who qualify to adjust inside the U.S.",
    forms: ["I-130", "I-485", "I-765 / I-131 when eligible", "I-864", "I-693 medical"],
    links: [
      { label: "Adjustment of status", url: L.aos },
      { label: "Family of U.S. citizens", url: L.family },
      { label: "USCIS forms", url: L.forms },
    ],
    typical: [
      "Filing → receipts → biometrics → possible interview → decision.",
      "Bona fide marriage evidence is reviewed in context of the category.",
    ],
    decisions: [
      "Whether you can adjust vs must consular process depends on manner of admission, maintenance of status, and other inadmissibility questions.",
    ],
  },
  consular_family: {
    pathInvolves:
      "When the beneficiary is abroad, the immigrant visa path generally runs through USCIS petition approval, National Visa Center, and a U.S. embassy or consulate.",
    forms: ["I-130", "DS-260", "Civil documents per checklist", "I-864 Affidavit of Support (when required)"],
    links: [
      { label: "Consular processing", url: L.consular },
      { label: "Family of U.S. citizens", url: L.family },
    ],
    typical: [
      "Petition → approval → fee bills and document upload → interview scheduling → visa issuance → U.S. entry as permanent resident.",
    ],
    decisions: [
      "Public charge and inadmissibility reviews can add steps; follow consulate-specific instructions.",
    ],
  },
  k1_fiance: {
    pathInvolves:
      "USCIS describes the K-1 as beginning with Form I-129F; after entry, the couple must intend to marry within 90 days, then follow marriage-based filing rules for the next stage.",
    forms: ["I-129F", "Then marriage-based filings after entry per instructions"],
    links: [
      { label: "Fiancé(e) visas — USCIS", url: L.k1 },
      { label: "Family of U.S. citizens", url: L.family },
    ],
    typical: [
      "Petition → consular processing for K-1 → U.S. entry → marriage within 90 days → adjustment or other path as instructed.",
    ],
    decisions: [
      "K-1 holders should plan the marriage-based next step promptly and follow current edition instructions.",
    ],
  },
  f1_student: {
    pathInvolves:
      "F-1 status is school-driven: an approved school issues Form I-20; USCIS or a consulate handles the classification or visa foil; employment is limited to authorized categories (CPT/OPT rules apply).",
    forms: ["I-20", "I-539 (certain changes/extensions)", "I-765 for OPT when eligible"],
    links: [
      { label: "Students and exchange visitors", url: L.students },
      { label: "Change to F or M status", url: L.f1change },
    ],
    typical: ["Admission → maintain full course of study → extensions or changes via official processes."],
    decisions: [
      "Moving from F-1 to a green-card path often involves a new basis (family, employment, etc.)—timelines overlap.",
    ],
  },
  change_to_f1: {
    pathInvolves:
      "Changing to F or M status from inside the U.S. requires meeting USCIS rules for change of nonimmigrant status, including maintaining eligibility until a decision.",
    forms: ["I-539 (as applicable)", "I-20 from school"],
    links: [
      { label: "Changing to F or M student status", url: L.f1change },
      { label: "Change of status overview", url: L.cos },
    ],
    typical: [
      "Obtain I-20 → file change request if eligible → await adjudication before acting as a student.",
    ],
    decisions: [
      "Gap between prior status expiration and approval can be legally serious—do not assume bridge rules without advice.",
    ],
  },
  j1_exchange: {
    pathInvolves:
      "J-1 is program-specific; some participants need waivers or face home-residency requirements before certain green-card or work moves.",
    forms: ["DS-2019 program documents", "I-539 or visa foil as applicable", "Waiver forms only if applicable"],
    links: [
      { label: "Students and exchange visitors", url: L.students },
    ],
    typical: ["Sponsor program rules govern work and travel; USCIS may adjudicate some related filings."],
    decisions: [
      "Whether you can move to H-1B, family, or EB paths depends on program category and waivers—legal review is common.",
    ],
  },
  h1b: {
    pathInvolves:
      "H-1B ties you to an employer petitioner; status extensions, changes of employer, and cap rules are governed by regulations and USCIS policy.",
    forms: ["I-129", "Labor Condition Application (DOL) in the H-1B context"],
    links: [{ label: "H-1B — USCIS", url: L.h1b }],
    typical: ["Selection / approval → entry or change of status → extensions → possible path to permanent employment-based sponsorship."],
    decisions: [
      "Job changes, benching, and layoffs can affect status immediately—employer and worker should plan with counsel.",
    ],
  },
  eb_green_card: {
    pathInvolves:
      "Employment-based permanent residence usually involves a PERM labor certification for many EB-2/EB-3 cases (unless exempt), an I-140 petition, then AOS or consular immigrant visa steps.",
    forms: ["ETA-9089 (when PERM applies)", "I-140", "I-485 or DS-260", "I-765 / I-131 when eligible in AOS"],
    links: [
      { label: "Permanent workers — USCIS", url: L.eb },
      { label: "Adjustment of status", url: L.aos },
    ],
    typical: ["Recruitment / PERM (if required) → I-140 → visa availability → AOS or IV."],
    decisions: [
      "Priority date and category determine when the final green card step can occur.",
    ],
  },
  eb5_investor: {
    pathInvolves:
      "EB-5 is USCIS’s immigrant investor program: investment, job creation, and admissibility requirements are all heavily regulated.",
    forms: ["I-526E / legacy forms per USCIS current edition", "Later AOS or IV steps"],
    links: [{ label: "EB-5 program", url: L.eb5 }],
    typical: ["Project due diligence → petition → conditional residence → later removal of conditions per rules."],
    decisions: [
      "Securities, immigration, and source-of-funds issues intersect—investor counsel is the norm.",
    ],
  },
  cos_general: {
    pathInvolves:
      "Changing or extending nonimmigrant status generally requires a timely filed petition or application before status lapses when possible, per USCIS instructions.",
    forms: ["I-129 or I-539 depending on category", "Category-specific supplements"],
    links: [{ label: "Change my nonimmigrant status", url: L.cos }],
    typical: ["Confirm eligibility → file before expiration if rules require → await decision."],
    decisions: [
      "Unauthorized work or overstays change what options remain—do not self-clear without legal advice if unsure.",
    ],
  },
  aos_general: {
    pathInvolves:
      "Adjustment of status is how many people already in the U.S. apply for a green card when they have an approved immigrant petition (or concurrent filing when allowed) and a visa number if required.",
    forms: ["I-485", "I-864 when required", "I-693", "I-765 / I-131 when eligible"],
    links: [{ label: "Adjustment of status", url: L.aos }],
    typical: ["Filing package → receipts → biometrics → possible interview → decision."],
    decisions: [
      "Eligibility for AOS (including inspection and maintenance of status) is fact-specific.",
    ],
  },
  consular_general: {
    pathInvolves:
      "Consular processing is the immigrant visa path for many beneficiaries outside the U.S., coordinated with DOS after USCIS petition steps.",
    forms: ["Petition (e.g. I-130 / I-140)", "DS-260", "Civil documents per NVC/consulate"],
    links: [{ label: "Consular processing", url: L.consular }],
    typical: ["USCIS petition → NVC → interview → visa → U.S. entry as LPR."],
    decisions: ["Inadmissibility waivers, if any, have their own adjudication tracks."],
  },
};

const DEFAULT_DEST = DEST.family_immediate;

export function getExploreGuidance(input: ExploreInput): ExploreGuidance {
  const core = DEST[input.destination] ?? DEFAULT_DEST;
  const legal = legalTrigger(input);
  const st = stageAddendum(input.stage);
  const stat = statusAddendum(input.status);

  const insideVs =
    input.location === "inside"
      ? "You indicated you are inside the United States. Adjustment of status and many change-of-status filings are USCIS-adjudicated steps when you qualify—verify inspection, maintenance of status, and any visa bulletin rules before filing."
      : "You indicated you are outside the United States. Consular processing through the Department of State is often central after petition approval; some categories still begin with USCIS petitions filed by a U.S. petitioner or employer.";

  const verifyFirst = [
    "Your last I-94 record (class and admit-until date) if you have U.S. entries.",
    "Current USCIS form editions and fee amounts on uscis.gov.",
    "Whether a visa number is required for your category (visa bulletin) when applying for a green card.",
    ...stat,
  ];

  const likelyNext = [
    ...core.typical.slice(0, 2),
    ...st.nextChecks.slice(0, 3),
  ];

  const headline =
    EXPLORE_DESTINATIONS.find((d) => d.id === input.destination)?.label ??
    "Your selected path";

  const qt = [
    ...st.qt,
    { label: "Official tools directory", href: "/app/tools" },
    { label: "Help Directory", href: "/app/help-directory" },
  ];

  const uniqQt = qt.filter(
    (x, i, a) => a.findIndex((y) => y.href === x.href) === i,
  );

  return {
    headline,
    pathInvolves: core.pathInvolves,
    verifyFirst,
    likelyNextSteps: likelyNext,
    formsOftenInvolved: core.forms,
    insideVsAbroad: insideVs,
    officialLinks: [
      ...core.links,
      { label: "USCIS Case Status", url: L.caseStatus },
      { label: "Processing times", url: L.processing },
    ],
    typicalFlow: core.typical,
    decisionPoints: core.decisions,
    waitingPoints: st.waiting,
    nextChecks: st.nextChecks,
    gatherInfo: [
      "Receipt numbers, passport, prior petitions, and any RFE or court notices.",
      "A one-page timeline of entries, status changes, and filings.",
    ],
    queueTipNext: uniqQt.slice(0, 6),
    legalHelpImportant: legal.flag,
    legalHelpNote: legal.note,
  };
}

export type ExploreCategoryCard = {
  id: string;
  title: string;
  explanation: string;
  whoFor: string;
  locationRelevance: string;
  commonStages: string[];
  destinationId: string;
};

export const EXPLORE_CATEGORY_CARDS: ExploreCategoryCard[] = [
  {
    id: "family_immediate",
    title: "Immediate relatives",
    explanation:
      "Spouses, unmarried children under 21 of U.S. citizens, and parents of adult U.S. citizens fit in this lane when eligibility matches USCIS definitions.",
    whoFor: "U.S. citizens petitioning the closest family members.",
    locationRelevance:
      "Beneficiaries may adjust inside the U.S. if eligible, or immigrant visa process abroad.",
    commonStages: ["I-130", "I-485 or IV", "Medical & interview"],
    destinationId: "family_immediate",
  },
  {
    id: "family_pref",
    title: "Family preference",
    explanation:
      "Other family relationships fall under preference categories with annual limits—visa bulletin timing matters.",
    whoFor: "Citizens and permanent residents petitioning relatives in preference categories.",
    locationRelevance: "Final step timing differs for AOS vs consular based on bulletin.",
    commonStages: ["I-130", "Wait for visa number", "I-485 or IV"],
    destinationId: "family_preference",
  },
  {
    id: "marriage",
    title: "Marriage-based adjustment",
    explanation:
      "Spouses who qualify may adjust status in the U.S. with a structured petition and I-485 package when permitted.",
    whoFor: "Couples with a qualifying marriage and lawful path to adjust.",
    locationRelevance: "Primarily inside the U.S. for AOS; others may use consular.",
    commonStages: ["Joint filing strategy", "Biometrics", "Interview"],
    destinationId: "marriage_aos",
  },
  {
    id: "k1",
    title: "K-1 fiancé(e)",
    explanation:
      "USCIS frames the K-1 as starting with I-129F, then marriage within 90 days of entry as a condition of the pathway.",
    whoFor: "U.S. citizens engaged to a foreign-citizen partner abroad.",
    locationRelevance: "Entry on K-1, then U.S.-based marriage and follow-on filings.",
    commonStages: ["I-129F", "Consular visa", "Marriage", "Next-stage filings"],
    destinationId: "k1_fiance",
  },
  {
    id: "f1",
    title: "F-1 students",
    explanation:
      "Study in the U.S. with school compliance; limited work categories (CPT/OPT) with strict rules.",
    whoFor: "Students admitted to SEVP schools.",
    locationRelevance: "Status inside the U.S.; visas obtained at consulates abroad.",
    commonStages: ["I-20", "Maintenance of status", "OPT or change of category"],
    destinationId: "f1_student",
  },
  {
    id: "j1",
    title: "J-1 exchange",
    explanation:
      "Program sponsors define many obligations; some J-1 categories interact with waivers and future paths.",
    whoFor: "Exchange visitors in DOS-designated programs.",
    locationRelevance: "Mix of sponsor, USCIS, and consular roles depending on action.",
    commonStages: ["DS-2019", "Program compliance", "Future status planning"],
    destinationId: "j1_exchange",
  },
  {
    id: "h1b",
    title: "H-1B employment",
    explanation:
      "Employer-sponsored specialty occupation work with defined portability and extension rules.",
    whoFor: "Professionals with employer petitioners in qualifying roles.",
    locationRelevance: "Primarily U.S. work presence; visa stamping abroad when needed.",
    commonStages: ["LCA", "I-129", "Extensions", "Possible EB path"],
    destinationId: "h1b",
  },
  {
    id: "eb",
    title: "Employment-based green card",
    explanation:
      "PERM (when required), I-140, then AOS or immigrant visa when a number is available.",
    whoFor: "Workers sponsored for EB-2, EB-3, or related categories.",
    locationRelevance: "AOS inside the U.S. vs IV abroad once eligible.",
    commonStages: ["PERM", "I-140", "Priority date wait", "I-485 / IV"],
    destinationId: "eb_green_card",
  },
  {
    id: "eb5",
    title: "EB-5 investor",
    explanation:
      "USCIS’s official investor program with regulatory investment thresholds and job-creation tests.",
    whoFor: "Investors meeting current program rules.",
    locationRelevance: "Petition in U.S. system; may include consular steps for beneficiaries.",
    commonStages: ["Project diligence", "Petition", "Conditional residence", "Removal of conditions"],
    destinationId: "eb5_investor",
  },
  {
    id: "aos",
    title: "Adjustment of status (cross-cutting)",
    explanation:
      "The inside-the-U.S. green card application process when you meet eligibility rules for your category.",
    whoFor: "Anyone eligible to use I-485 instead of solely consular processing.",
    locationRelevance: "Must be in the U.S. following the rules for adjustment.",
    commonStages: ["Filing", "Biometrics", "Interview (if scheduled)", "Decision"],
    destinationId: "aos_general",
  },
  {
    id: "cp",
    title: "Consular processing (cross-cutting)",
    explanation:
      "Immigrant visa route after petition approval for many beneficiaries abroad.",
    whoFor: "People who will finish their immigrant visa outside the United States.",
    locationRelevance: "Embassy or consulate stage after USCIS and NVC steps.",
    commonStages: ["NVC fees", "DS-260", "Medical", "Interview"],
    destinationId: "consular_general",
  },
  {
    id: "cos",
    title: "Change of status",
    explanation:
      "Move from one nonimmigrant category to another from inside the U.S. when USCIS allows.",
    whoFor: "People maintaining eligibility and filing before status lapses when required.",
    locationRelevance: "U.S. filings with USCIS (and sometimes DOS for visas).",
    commonStages: ["Eligibility check", "I-129 or I-539", "Decision"],
    destinationId: "cos_general",
  },
];
