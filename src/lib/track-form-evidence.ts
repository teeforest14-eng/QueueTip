/**
 * Informational evidence guidance by form type — not exhaustive or legal advice.
 * QueueTip does not store or submit documents; this supports planning only.
 */

export type EvidenceGuidanceItem = {
  title: string;
  why: string;
  /** When this item is only relevant in certain situations */
  whenApplies?: string;
};

export type EvidenceGuidanceCategory = {
  id: string;
  label: string;
  items: EvidenceGuidanceItem[];
};

export type EvidenceFormKey = "I-485" | "I-130" | "I-765" | "I-131" | "generic";

export function detectEvidenceFormKey(formType: string): EvidenceFormKey {
  const compact = formType.toUpperCase().replace(/\s+/g, "");
  if (/I-?485/.test(compact) || compact.includes("FORMI-485")) return "I-485";
  if (/I-?130/.test(compact) || compact.includes("FORMI-130")) return "I-130";
  if (/I-?765/.test(compact) || compact.includes("FORMI-765")) return "I-765";
  if (/I-?131/.test(compact) || compact.includes("FORMI-131")) return "I-131";
  return "generic";
}

const I485: EvidenceGuidanceCategory[] = [
  {
    id: "identity",
    label: "Identity & civil status",
    items: [
      {
        title: "Government-issued photo ID",
        why: "Establishes identity for USCIS and is commonly required throughout the process.",
      },
      {
        title: "Birth certificate",
        why: "Proves identity, age, and place of birth; often used to confirm biographic data.",
      },
      {
        title: "Marriage certificate (if married)",
        why: "Supports marital status and may be relevant to derivative benefits or relationship proof.",
        whenApplies: "If you are married or claiming a spouse as a derivative.",
      },
      {
        title: "Divorce or death records (if applicable)",
        why: "Clarifies prior marriages and current marital status.",
        whenApplies: "If you were previously married.",
      },
    ],
  },
  {
    id: "relationship",
    label: "Relationship (family-based)",
    items: [
      {
        title: "Evidence of bona fide relationship",
        why: "For family-based adjustment, USCIS looks for proof the relationship is genuine, not solely for immigration benefits.",
        whenApplies: "Marriage- or family-based I-485 paths.",
      },
      {
        title: "Joint documents (leases, accounts, insurance)",
        why: "Helps show shared life when relationship authenticity is at issue.",
        whenApplies: "Often emphasized in marriage-based cases.",
      },
    ],
  },
  {
    id: "financial",
    label: "Financial support",
    items: [
      {
        title: "Form I-864 / sponsor financial evidence",
        why: "Shows the petitioner (and joint sponsor, if any) can support the intending immigrant at required levels.",
        whenApplies: "When an affidavit of support is required for your category.",
      },
      {
        title: "Tax transcripts or returns (recent years)",
        why: "Typical way sponsors document income and household size.",
        whenApplies: "When submitting or responding to RFEs on public charge or support.",
      },
    ],
  },
  {
    id: "medical",
    label: "Medical",
    items: [
      {
        title: "Form I-693 (immigration medical exam)",
        why: "USCIS requires a completed civil surgeon exam for many adjustment applicants.",
        whenApplies: "Unless your instructions state a narrow exception; follow current form edition and filing rules.",
      },
    ],
  },
  {
    id: "immigration_history",
    label: "Immigration history",
    items: [
      {
        title: "Passport pages and prior visas",
        why: "Documents travel, admissions, and maintenance of status.",
      },
      {
        title: "I-94 arrival record",
        why: "Shows lawful inspection and admission where relevant.",
      },
      {
        title: "Prior USCIS / EOIR notices and decisions",
        why: "Complete history helps avoid inconsistencies and supports eligibility arguments.",
      },
      {
        title: "Employment authorization history (if any)",
        why: "Clarifies periods of authorized work and related filings.",
        whenApplies: "If you have held or applied for EAD.",
      },
    ],
  },
];

const I130: EvidenceGuidanceCategory[] = [
  {
    id: "identity",
    label: "Identity",
    items: [
      {
        title: "Petitioner and beneficiary ID documents",
        why: "USCIS uses these to verify identities on the petition.",
      },
      {
        title: "Birth certificates",
        why: "Establish parent-child or sibling relationships and biographic facts.",
      },
    ],
  },
  {
    id: "relationship",
    label: "Relationship",
    items: [
      {
        title: "Marriage certificate (spouse petitions)",
        why: "Core proof of a legal marriage for spousal I-130 filings.",
        whenApplies: "Spouse beneficiary cases.",
      },
      {
        title: "Evidence of bona fide marriage",
        why: "Beyond the certificate, USCIS often expects documentation of a real marital relationship.",
        whenApplies: "Spouse cases; follow current USCIS guidance on types of evidence.",
      },
      {
        title: "Proof of legal termination of prior marriages",
        why: "Shows any prior marriages ended before the current marriage.",
        whenApplies: "When either party was previously married.",
      },
      {
        title: "Adoption or custody documents",
        why: "Establishes qualifying family ties for adopted children or certain guardianship situations.",
        whenApplies: "When the relationship is based on adoption or custody.",
      },
    ],
  },
  {
    id: "immigration_history",
    label: "Immigration history",
    items: [
      {
        title: "Beneficiary’s passport, visas, and I-94",
        why: "Clarifies status, entries, and any prior immigration proceedings.",
      },
      {
        title: "Prior petitions or approvals",
        why: "Helps USCIS connect this petition to earlier filings if applicable.",
      },
    ],
  },
  {
    id: "financial",
    label: "Financial (when relevant)",
    items: [
      {
        title: "Sponsor financials (later stages)",
        why: "I-130 itself focuses on relationship; financial support often appears at I-864 / adjustment stages.",
        whenApplies: "Planning ahead for consular or adjustment steps.",
      },
    ],
  },
];

const I765: EvidenceGuidanceCategory[] = [
  {
    id: "identity",
    label: "Identity",
    items: [
      {
        title: "Passport-style photos",
        why: "Commonly required for EAD applications per form instructions.",
      },
      {
        title: "Government-issued photo ID",
        why: "Supports identity matching across USCIS systems.",
      },
    ],
  },
  {
    id: "immigration_history",
    label: "Immigration status & history",
    items: [
      {
        title: "Proof of eligibility category",
        why: "I-765 eligibility depends on your underlying status or pending application; evidence ties you to the correct box on the form.",
      },
      {
        title: "I-797 receipt notices (related filings)",
        why: "Shows pending I-485 or other bases that support an eligible EAD category.",
        whenApplies: "When EAD is based on a pending principal application.",
      },
      {
        title: "Prior EAD cards or notices",
        why: "Documents continuity and prior grants if renewing or replacing.",
        whenApplies: "Renewal or replacement requests.",
      },
      {
        title: "I-94 and passport biographic page",
        why: "Common supporting documents for identity and status context.",
      },
    ],
  },
  {
    id: "employment",
    label: "Employment (category-specific)",
    items: [
      {
        title: "Employer letter or offer (certain categories)",
        why: "Some EAD categories require employer-specific documentation.",
        whenApplies: "Only if your eligibility category requires it—verify form instructions.",
      },
    ],
  },
];

const I131: EvidenceGuidanceCategory[] = [
  {
    id: "identity",
    label: "Identity",
    items: [
      {
        title: "Passport and ID",
        why: "Standard identity documentation for travel-document requests.",
      },
      {
        title: "Passport photos",
        why: "Often required per form instructions for advance parole or re-entry documentation.",
      },
    ],
  },
  {
    id: "immigration_history",
    label: "Immigration history & basis",
    items: [
      {
        title: "Proof of pending adjustment or qualifying status",
        why: "Advance parole is typically tied to a specific immigration situation; evidence links you to that basis.",
      },
      {
        title: "Prior advance parole or travel documents",
        why: "Helps show travel history and prior grants if applicable.",
        whenApplies: "If you have traveled on parole before.",
      },
    ],
  },
  {
    id: "other",
    label: "Travel purpose (when instructed)",
    items: [
      {
        title: "Explanation of need to travel",
        why: "USCIS may ask why travel is needed; keep explanations factual and consistent with your case.",
        whenApplies: "If instructions or RFEs request a statement.",
      },
    ],
  },
];

const GENERIC: EvidenceGuidanceCategory[] = [
  {
    id: "identity",
    label: "Identity",
    items: [
      {
        title: "Government-issued photo identification",
        why: "Almost all filings require clear proof of who is applying or petitioning.",
      },
      {
        title: "Birth record or equivalent",
        why: "Common for biographic and relationship proof.",
      },
    ],
  },
  {
    id: "immigration_history",
    label: "Immigration history",
    items: [
      {
        title: "Passport, visas, and I-94",
        why: "Shows entries, status, and compliance history.",
      },
      {
        title: "Prior USCIS notices and decisions",
        why: "Complete picture reduces confusion and supports consistent filings.",
      },
    ],
  },
  {
    id: "financial",
    label: "Financial (if applicable)",
    items: [
      {
        title: "Tax and income documentation",
        why: "Often required for sponsorship, fee waiver, or public-charge-related questions.",
        whenApplies: "When your form category involves support or means-tested criteria.",
      },
    ],
  },
  {
    id: "relationship",
    label: "Relationship & civil documents",
    items: [
      {
        title: "Marriage, birth, or adoption records",
        why: "Establishes family relationships claimed on the form.",
        whenApplies: "Family-based cases.",
      },
    ],
  },
  {
    id: "medical",
    label: "Medical",
    items: [
      {
        title: "Civil surgeon exam (I-693) or vaccination records",
        why: "Medical requirements depend on form type; adjustment often requires I-693.",
        whenApplies: "Primarily adjustment and certain other categories—check official instructions.",
      },
    ],
  },
];

const BY_FORM: Record<EvidenceFormKey, EvidenceGuidanceCategory[]> = {
  "I-485": I485,
  "I-130": I130,
  "I-765": I765,
  "I-131": I131,
  generic: GENERIC,
};

export function getEvidenceGuidanceForForm(formType: string): {
  formKey: EvidenceFormKey;
  categories: EvidenceGuidanceCategory[];
} {
  const formKey = detectEvidenceFormKey(formType);
  return {
    formKey,
    categories: BY_FORM[formKey],
  };
}
