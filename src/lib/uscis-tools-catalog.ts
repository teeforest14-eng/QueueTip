/** Canonical USCIS tool entries for the in-app Official Tools navigator. Always verify URLs on uscis.gov. */

export const TOOL_CATEGORIES = [
  { id: "case_tracking", label: "Case tracking" },
  { id: "timing_wait", label: "Timing & wait context" },
  { id: "follow_up_service", label: "Follow-up & service requests" },
  { id: "account_record", label: "Account & record updates" },
  { id: "forms_filing", label: "Forms & filing prep" },
  { id: "medical_appointments", label: "Medical & appointments" },
  { id: "office_contact", label: "Office & contact" },
  { id: "learning_exploration", label: "Learning & exploration" },
] as const;

export type ToolCategoryId = (typeof TOOL_CATEGORIES)[number]["id"];

export const TOOL_STAGES = [
  { id: "researching", label: "Just researching" },
  { id: "preparing", label: "Preparing to file" },
  { id: "filed", label: "Already filed" },
  { id: "waiting", label: "Waiting / in queue" },
  { id: "biometrics", label: "Biometrics stage" },
  { id: "interview", label: "Interview stage" },
  { id: "decision", label: "Decision / card" },
  { id: "issue_followup", label: "Issue or follow-up" },
] as const;

export type ToolStageId = (typeof TOOL_STAGES)[number]["id"];

export type UscisToolEntry = {
  id: string;
  name: string;
  summary: string;
  url: string;
  category: ToolCategoryId;
  stages: ToolStageId[];
  /** Extra tokens for search (tasks, synonyms). */
  keywords: string[];
  featured?: boolean;
  urgentFollowUp?: boolean;
  needBefore: string[];
  bestFor: string;
  whenToUse: string;
  whyMatters: string;
  /** Where QueueTip relates (informational routing only). */
  learnHref?: string;
};

export const USCIS_TOOLS: UscisToolEntry[] = [
  {
    id: "case-status-online",
    name: "USCIS Case Status Online",
    summary:
      "Enter a receipt number to see the latest status USCIS has posted for that case.",
    url: "https://egov.uscis.gov/",
    category: "case_tracking",
    stages: ["filed", "waiting", "biometrics", "interview", "decision", "issue_followup"],
    keywords: [
      "check status",
      "receipt",
      "status",
      "egov",
      "where is my case",
    ],
    featured: true,
    needBefore: [
      "Receipt number (three letters + ten digits)",
      "Form type, if you are cross-checking processing times next",
    ],
    bestFor: "Seeing what USCIS has published about your case today—not predictions.",
    whenToUse:
      "After filing, after biometrics, before and after interviews, and whenever you need the official posted line.",
    whyMatters:
      "QueueTip and other apps may summarize history, but this is the live public status source USCIS maintains.",
    learnHref: "/app/track",
  },
  {
    id: "case-status-help",
    name: "How to check your case status (USCIS)",
    summary:
      "Official USCIS guidance on using Case Status Online and understanding what you see.",
    url: "https://www.uscis.gov/tools/checking-your-case-status-online",
    category: "learning_exploration",
    stages: ["researching", "filed", "waiting"],
    keywords: ["help", "instructions", "case status", "how to"],
    needBefore: ["Receipt number (for hands-on practice)"],
    bestFor: "First-time users who want USCIS’s own explanation of the status tool.",
    whenToUse: "Before relying on any third-party summary of what a status string means.",
    whyMatters:
      "Reduces confusion between “posted status,” processing estimates, and legal outcomes.",
    learnHref: "/app/help-directory",
  },
  {
    id: "myuscis",
    name: "myUSCIS (online account)",
    summary:
      "Create or sign in to a USCIS online account to manage certain filings, updates, and secure messages where USCIS supports them.",
    url: "https://my.uscis.gov/",
    category: "account_record",
    stages: ["researching", "preparing", "filed", "waiting", "issue_followup"],
    keywords: [
      "account",
      "login",
      "online account",
      "profile",
      "messages",
      "paperless",
    ],
    featured: true,
    needBefore: [
      "Email access for verification",
      "Receipt numbers or online access codes if you are linking paper-filed cases",
    ],
    bestFor: "Ongoing case management when USCIS offers the feature for your form type.",
    whenToUse:
      "When USCIS directs you to an account action, or when you want eligible online workflows in one place.",
    whyMatters:
      "Many newer address updates, uploads, and notices flow through account systems—not informal channels.",
    learnHref: "/app/track",
  },
  {
    id: "myuscis-login-hub",
    name: "USCIS account sign-in options",
    summary:
      "Official entry points for signing in to USCIS online services (including myUSCIS and related flows).",
    url: "https://egov.uscis.gov/en/myuscis/select-login-method",
    category: "account_record",
    stages: ["researching", "filed", "waiting"],
    keywords: ["sign in", "login", "myuscis", "access"],
    needBefore: ["Which account type you created (if unsure, use official recovery links on the page)"],
    bestFor: "Finding the correct login path when bookmarks or old links break.",
    whenToUse: "When you cannot reach your case online after a site update.",
    whyMatters: "Avoids mistaking a marketing site for the authenticated government flow.",
    learnHref: "/app/help-directory",
  },
  {
    id: "processing-times",
    name: "USCIS processing times",
    summary:
      "Select form, category, and office to view posted processing time ranges—estimates, not guarantees.",
    url: "https://egov.uscis.gov/processing-times/",
    category: "timing_wait",
    stages: ["filed", "waiting", "biometrics", "interview", "decision"],
    keywords: [
      "processing time",
      "how long",
      "wait",
      "timeline",
      "service center",
      "field office",
    ],
    featured: true,
    needBefore: [
      "Form number",
      "Form category (as listed on your receipt or the tool)",
      "Field office or service center identifier when the tool asks for it",
    ],
    bestFor: "Comparing your wait to published ranges for similar filings at your office.",
    whenToUse:
      "After you know where your case is pending and which form category applies—not before you have those facts straight.",
    whyMatters:
      "USCIS explicitly frames these as estimates; they help set expectations, not promise adjudication dates.",
    learnHref: "/app/track",
  },
  {
    id: "processing-times-faqs",
    name: "Processing times — FAQs",
    summary:
      "Official answers on how to read processing time pages and what the ranges represent.",
    url: "https://egov.uscis.gov/processing-times/processing-times-faqs",
    category: "timing_wait",
    stages: ["researching", "filed", "waiting"],
    keywords: ["faq", "explain", "processing", "percentile", "meaning"],
    needBefore: [],
    bestFor: "Understanding why your case can be “inside” or “outside” posted ranges.",
    whenToUse: "Before assuming a delay equals an error or a denial.",
    whyMatters: "Prevents costly misunderstandings between estimates and case status text.",
    learnHref: "/app/help-directory",
  },
  {
    id: "processing-times-more-info",
    name: "Processing times — more information",
    summary:
      "Additional USCIS context on using processing time data with your receipt and case details.",
    url: "https://egov.uscis.gov/processing-times/more-information",
    category: "timing_wait",
    stages: ["researching", "filed", "waiting"],
    keywords: ["more info", "help", "processing times", "receipt"],
    needBefore: ["Receipt notice details when matching to office/category"],
    bestFor: "Cross-checking that you selected the correct office and category in the tool.",
    whenToUse: "When the processing times page asks for fields you do not recognize on your notice.",
    whyMatters: "Wrong office/category selections produce misleading comparisons.",
    learnHref: "/app/track",
  },
  {
    id: "erequest",
    name: "USCIS e-Request",
    summary:
      "Official self-service portal for certain case inquiries, missing notices or cards, document issues, and some appointment-related requests when USCIS offers that path.",
    url: "https://egov.uscis.gov/e-request",
    category: "follow_up_service",
    stages: ["filed", "waiting", "biometrics", "interview", "decision", "issue_followup"],
    keywords: [
      "e-request",
      "missing notice",
      "missing card",
      "never arrived",
      "inquiry",
      "service request",
      "accommodation",
    ],
    featured: true,
    urgentFollowUp: true,
    needBefore: [
      "Receipt number (usually)",
      "Mailing address on file",
      "Details from your last notice, if any",
    ],
    bestFor: "Structured follow-up when USCIS lists your situation as eligible in e-Request—not for legal strategy.",
    whenToUse:
      "After you have checked Case Status, confirmed USPS delivery issues if relevant, and gathered notice details.",
    whyMatters:
      "It is an official channel; it does not replace counsel for complex or contested issues.",
    learnHref: "/app/resolve",
  },
  {
    id: "change-address-hub",
    name: "How to change your address (USCIS)",
    summary:
      "Official overview of legal address-notification requirements, online account updates, and exceptions for certain case types.",
    url: "https://www.uscis.gov/addresschange",
    category: "account_record",
    stages: ["researching", "preparing", "filed", "waiting", "decision"],
    keywords: ["address", "moved", "ar-11", "mail", "update address"],
    featured: true,
    needBefore: [
      "Old and new addresses (USPS-standard format)",
      "Which applications or petitions are pending or recently approved",
    ],
    bestFor: "Understanding the full address-update picture before you click a specific tool.",
    whenToUse: "Soon after you move—USCIS and USPS updates serve different purposes.",
    whyMatters:
      "Not updating with USCIS can mean lost notices and missed deadlines; USPS forwarding does not fix USCIS records.",
    learnHref: "/app/prepare",
  },
  {
    id: "change-address-online",
    name: "Online change of address (AR-11 / E-COA)",
    summary:
      "Electronic address update flows USCIS provides for many filers, including Enterprise Change of Address where available.",
    url: "https://egov.uscis.gov/coa/displayCOAForm.do",
    category: "account_record",
    stages: ["filed", "waiting", "decision"],
    keywords: ["ar-11", "coa", "change address online", "electronic"],
    urgentFollowUp: true,
    needBefore: [
      "Receipt numbers for pending cases (when applicable)",
      "Valid email for confirmations",
    ],
    bestFor: "Submitting an official address change through USCIS systems when you qualify for the online path.",
    whenToUse: "After reading the address-change hub if you have VAWA/T/U, I-751 abuse waiver, or other special procedures.",
    whyMatters: "Keeps adjudication mail aligned with where you actually live.",
    learnHref: "/app/prepare",
  },
  {
    id: "forms-hub",
    name: "USCIS forms",
    summary:
      "Download current form editions, instructions, and edition-date rules before you file.",
    url: "https://www.uscis.gov/forms",
    category: "forms_filing",
    stages: ["researching", "preparing", "filed"],
    keywords: ["forms", "pdf", "download", "i-130", "i-485", "edition"],
    featured: true,
    needBefore: ["Exact form number", "Whether you file online or by mail for that form"],
    bestFor: "Locking the correct edition and instruction set the week you file.",
    whenToUse: "Any time you prepare a package—editions and fees change.",
    whyMatters: "Wrong editions are a common rejection or rejection reason.",
    learnHref: "/app/prepare",
  },
  {
    id: "filing-fees",
    name: "USCIS filing fees",
    summary: "Official fee schedule and payment guidance tied to current forms.",
    url: "https://www.uscis.gov/forms/filing-fees",
    category: "forms_filing",
    stages: ["researching", "preparing"],
    keywords: ["fee", "cost", "payment", "check", "money order"],
    needBefore: ["Each form you will submit", "Whether a fee exemption or waiver might apply (verify on USCIS)"],
    bestFor: "Building an accurate fee sheet before mailing or paying online.",
    whenToUse: "Right before payment—fees update with policy changes.",
    whyMatters: "Incorrect fees delay or reject filings.",
    learnHref: "/app/prepare",
  },
  {
    id: "civil-surgeon",
    name: "Find a civil surgeon",
    summary:
      "Locate a USCIS-designated civil surgeon for the immigration medical examination.",
    url: "https://www.uscis.gov/green-card/green-card-medical-exam/find-a-doctor",
    category: "medical_appointments",
    stages: ["preparing", "filed", "waiting", "interview"],
    keywords: ["medical exam", "i-693", "doctor", "surgeon", "health"],
    featured: true,
    needBefore: ["General location or ZIP", "Vaccination records you may need for the exam"],
    bestFor: "Scheduling a valid exam with an authorized provider—non-designated exams do not count.",
    whenToUse: "When your path requires Form I-693 or updated medical documentation per USCIS rules.",
    whyMatters: "The exam is process-critical for many adjustment cases; timing and sealed envelopes matter.",
    learnHref: "/app/prepare",
  },
  {
    id: "appointment-request",
    name: "USCIS appointment request (account)",
    summary:
      "Account-based flows for certain appointment requests where USCIS directs users to myUSCIS.",
    url: "https://my.uscis.gov/accounts/appointment_request/overview",
    category: "medical_appointments",
    stages: ["filed", "waiting", "interview", "issue_followup"],
    keywords: ["appointment", "schedule", "infopass", "visit", "accommodation"],
    needBefore: ["Active USCIS online account", "Case identifiers USCIS asks for in the flow"],
    bestFor: "Requesting eligible appointment types through the official account path.",
    whenToUse: "When USCIS instructions or notices point you to online appointment tools—not for general questions.",
    whyMatters: "Walk-in expectations vary by office; official channels reduce wasted trips.",
    learnHref: "/app/help-directory",
  },
  {
    id: "office-locator",
    name: "Find a USCIS office",
    summary: "Locate field offices, asylum offices, and related facility information USCIS publishes.",
    url: "https://www.uscis.gov/about-us/find-a-uscis-office",
    category: "office_contact",
    stages: ["researching", "interview", "issue_followup"],
    keywords: ["office", "location", "field office", "near me", "address"],
    featured: true,
    needBefore: ["ZIP code or city", "Whether you need a field office vs. other USCIS facility types"],
    bestFor: "Official addresses, hours context, and public-facing office facts.",
    whenToUse: "Before travel—confirm current guidance; many services require appointments.",
    whyMatters: "Policies on in-person services change; always read the live office page.",
    learnHref: "/app/help-directory",
  },
  {
    id: "emma-contact",
    name: "Emma & USCIS Contact Center",
    summary:
      "Virtual assistant and contact-center entry for general information, phone numbers, and official help routing.",
    url: "https://www.uscis.gov/contactcenter",
    category: "office_contact",
    stages: ["researching", "filed", "waiting", "issue_followup"],
    keywords: ["emma", "chat", "phone", "800", "call uscis", "contact"],
    needBefore: ["Receipt number (often helpful for phone trees)", "Pen and paper for reference numbers"],
    bestFor: "Finding the right official number or FAQ when self-service tools are unclear.",
    whenToUse: "After you have tried Case Status and the relevant USCIS web page for your topic.",
    whyMatters: "Official contact paths reduce reliance on unofficial intermediaries.",
    learnHref: "/app/help-directory",
  },
  {
    id: "document-delivery",
    name: "Track delivery of notices & secure documents",
    summary:
      "USCIS guidance on tracking mailed notices and secure identity documents when those services apply.",
    url: "https://www.uscis.gov/forms/track-delivery-of-card-or-document",
    category: "follow_up_service",
    stages: ["decision", "issue_followup", "waiting"],
    keywords: ["tracking", "mail", "card", "green card", "delivery", "usps"],
    urgentFollowUp: true,
    needBefore: ["USPS tracking or USCIS tracking identifiers when provided", "Mailing address on file"],
    bestFor: "Understanding where a production or mail step stands for certain documents.",
    whenToUse: "After USCIS indicates a card or secure document was sent.",
    whyMatters: "Misdelivered cards are high-impact; official tracking reduces guesswork.",
    learnHref: "/app/track",
  },
  {
    id: "uscis-tools-index",
    name: "USCIS tools directory",
    summary: "Master index of USCIS online tools and calculators maintained by USCIS.",
    url: "https://www.uscis.gov/tools",
    category: "learning_exploration",
    stages: ["researching"],
    keywords: ["tools", "directory", "all tools", "calculator"],
    needBefore: [],
    bestFor: "Discovering lesser-known official utilities beyond the few most common bookmarks.",
    whenToUse: "Early in research when you are not sure which tool fits your task.",
    whyMatters: "Starting from USCIS reduces the risk of third-party clones.",
    learnHref: "/app/explore",
  },
  {
    id: "citizenship-resource-center",
    name: "Citizenship resource center",
    summary:
      "Official learning materials for naturalization eligibility, study materials, and related civic integration resources.",
    url: "https://www.uscis.gov/citizenship-resource-center",
    category: "learning_exploration",
    stages: ["researching", "preparing"],
    keywords: ["citizenship", "n-400", "naturalization", "test", "study"],
    needBefore: [],
    bestFor: "Structured, government-authored orientation before you commit to a naturalization timeline.",
    whenToUse: "When your destination status includes U.S. citizenship through naturalization.",
    whyMatters: "Eligibility and filing requirements are detail-heavy; USCIS-authored summaries anchor vocabulary.",
    learnHref: "/app/explore",
  },
  {
    id: "green-card-processes",
    name: "Green card processes & procedures (USCIS)",
    summary:
      "High-level official map of green card routes, processes, and links into category-specific guidance.",
    url: "https://www.uscis.gov/green-card/green-card-processes-and-procedures",
    category: "learning_exploration",
    stages: ["researching"],
    keywords: [
      "green card",
      "permanent residence",
      "aos",
      "adjustment",
      "consular",
    ],
    needBefore: [],
    bestFor: "Orienting to how adjustment of status and consular processing differ before you pick tools.",
    whenToUse: "When you are unsure whether your next step is domestic or abroad.",
    whyMatters: "Choosing the wrong process narrative leads to wrong forms and wrong offices.",
    learnHref: "/app/explore",
  },
];

export function categoryLabel(id: ToolCategoryId): string {
  return TOOL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function haystackForTool(t: UscisToolEntry): string {
  return [
    t.name,
    t.summary,
    t.bestFor,
    t.whenToUse,
    t.whyMatters,
    ...t.keywords,
    categoryLabel(t.category),
    ...t.stages,
  ]
    .join(" ")
    .toLowerCase();
}

export type ToolDecisionRow = { need: string; toolId: string };

export const TOOL_DECISION_ROWS: ToolDecisionRow[] = [
  { need: "I want to know my latest posted status", toolId: "case-status-online" },
  { need: "I want to see whether my case is outside normal timing", toolId: "processing-times" },
  { need: "My notice never arrived", toolId: "erequest" },
  { need: "My card never arrived", toolId: "erequest" },
  { need: "I moved and need USCIS to have my current address", toolId: "change-address-hub" },
  { need: "I need the current form edition and instructions", toolId: "forms-hub" },
  { need: "I need a civil surgeon for the medical exam", toolId: "civil-surgeon" },
  { need: "I need an account to manage online interactions", toolId: "myuscis" },
  { need: "I need office information or appointment context", toolId: "office-locator" },
  { need: "I need to submit a structured case inquiry or document issue", toolId: "erequest" },
  { need: "I want USPS or USCIS mail tracking for a sent document", toolId: "document-delivery" },
];

export type ToolFlowStrip = { title: string; description: string; toolIds: string[] };

export const TOOL_FLOW_STRIPS: ToolFlowStrip[] = [
  {
    title: "Status → timing → follow-up",
    description:
      "Check posted status, compare to processing ranges, then use e-Request only if USCIS’s criteria fit.",
    toolIds: ["case-status-online", "processing-times", "erequest"],
  },
  {
    title: "Forms → fees → Prepare",
    description:
      "Confirm edition and instructions, verify fees, then build your package in QueueTip Prepare with the same facts.",
    toolIds: ["forms-hub", "filing-fees"],
  },
  {
    title: "Address → status",
    description:
      "Update USCIS first for pending cases, then confirm Case Status still reflects your situation after major milestones.",
    toolIds: ["change-address-hub", "case-status-online"],
  },
];

export const TOOL_PREP_STRIP_ITEMS: string[] = [
  "Receipt number (three letters + ten digits) when the tool asks for it",
  "Form number and category as shown on your notice or the processing-times picker",
  "Field office or service center identifier when comparing to posted ranges",
  "Mailing and physical addresses in USPS-standard format",
  "Last notice type, date, and any Request for Evidence (RFE) deadlines",
];

export function getToolById(id: string): UscisToolEntry | undefined {
  return USCIS_TOOLS.find((t) => t.id === id);
}
