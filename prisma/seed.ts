import { PrismaClient, ContentStatus, Plan } from "@prisma/client";
import bcrypt from "bcryptjs";
import { RESOLVE_ISSUES } from "../src/data/resolve-issues-data";
import { RESOLVE_CATEGORIES } from "../src/data/resolve-issues-types";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@queuetip.dev";
  const adminPass = "Admin123!";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPass, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        role: "ADMIN",
        profile: { create: {} },
        subscription: {
          create: { plan: Plan.PREMIUM, status: "ACTIVE" },
        },
        notifPrefs: { create: {} },
      },
    });
    console.log(`Admin user: ${adminEmail} / ${adminPass}`);
  }

  await prisma.delayThresholdConfig.upsert({
    where: { key: "no_meaningful_update" },
    create: {
      key: "no_meaningful_update",
      daysWithoutUpdate: 90,
      description: "Family-based cases with no status movement",
    },
    update: {},
  });
  await prisma.delayThresholdConfig.upsert({
    where: { key: "ead_work_auth" },
    create: {
      key: "ead_work_auth",
      daysWithoutUpdate: 120,
      description: "I-765 pending beyond typical ranges (configurable)",
    },
    update: {},
  });

  const tools = [
    {
      slug: "uscis-case-status",
      name: "USCIS Case Status Online",
      description:
        "Check the latest posted status for a receipt number using USCIS’s official tool.",
      whyUse:
        "This is the authoritative place USCIS publishes case status updates tied to your receipt.",
      whenToUse:
        "After you file, and anytime you want to confirm what USCIS has posted publicly.",
      url: "https://egov.uscis.gov/",
      sortOrder: 0,
    },
    {
      slug: "processing-times",
      name: "USCIS Processing Times",
      description:
        "View posted processing time ranges by form and field office or service center.",
      whyUse:
        "Helps you compare your wait to published ranges—always an estimate, not a promise.",
      whenToUse:
        "When you want context for how long similar cases have been taking recently.",
      url: "https://egov.uscis.gov/processing-times/",
      sortOrder: 1,
    },
    {
      slug: "e-request",
      name: "USCIS e-Request",
      description:
        "Submit certain case inquiries or service requests through USCIS’s official portal.",
      whyUse:
        "A structured channel for specific issues when USCIS invites that type of inquiry.",
      whenToUse:
        "When you meet USCIS’s stated criteria for an e-Request (not a substitute for legal advice).",
      url: "https://egov.uscis.gov/e-request",
      sortOrder: 2,
    },
    {
      slug: "emma",
      name: "Emma (USCIS Virtual Assistant)",
      description:
        "USCIS’s chat assistant for general information and navigation help.",
      whyUse:
        "Quick pointers to official pages and definitions in plain language.",
      whenToUse:
        "When you need basic definitions or links to official USCIS resources.",
      url: "https://www.uscis.gov/contactcenter",
      sortOrder: 3,
    },
    {
      slug: "civil-surgeon",
      name: "Find a Civil Surgeon",
      description:
        "Locate a USCIS-designated civil surgeon for the immigration medical exam.",
      whyUse:
        "Required for many adjustment-of-status filings; must use a designated provider.",
      whenToUse:
        "Before your I-485 medical exam appointment, or if you need to schedule a follow-up.",
      url: "https://www.uscis.gov/green-card/green-card-medical-exam/find-a-doctor",
      sortOrder: 4,
    },
    {
      slug: "uscis-forms",
      name: "USCIS Forms & Instructions",
      description:
        "Download official forms, fee information, and filing instructions.",
      whyUse:
        "Ensures you are using the current form edition and official guidance.",
      whenToUse:
        "During Prepare and before mailing or e-filing any package.",
      url: "https://www.uscis.gov/forms",
      sortOrder: 5,
    },
  ];
  for (const t of tools) {
    await prisma.officialToolEntry.upsert({
      where: { slug: t.slug },
      create: { ...t, published: true },
      update: { ...t, published: true },
    });
  }

  const sharedResource = await prisma.officialResource.upsert({
    where: { id: "res_uscis_forms" },
    create: {
      id: "res_uscis_forms",
      name: "USCIS forms hub",
      url: "https://www.uscis.gov/forms",
      description: "Official form downloads and instructions.",
      category: "official",
    },
    update: {},
  });

  const guideDefs = [
    {
      slug: "i-130",
      title: "I-130 Petition for Alien Relative",
      formType: "I-130",
      summary:
        "Family-based petition filed by a U.S. citizen or lawful permanent resident for a qualifying relative.",
      overview: `QueueTip explains this process in plain English. This is not legal advice.

**Official fact:** The I-130 establishes the qualifying family relationship for many family-based paths.

**Typical meaning:** Approval does not by itself grant a green card; next steps depend on whether the beneficiary will adjust status in the U.S. or pursue consular processing.

**What to prepare:** Relationship evidence, status documents, and filing fees per the official form instructions.`,
      checklist: [
        {
          label: "Proof of petitioner’s status (citizenship or LPR)",
          whyMatters:
            "USCIS must confirm the petitioner can file this category of petition.",
          category: "Eligibility",
        },
        {
          label: "Proof of qualifying relationship (birth/marriage records, etc.)",
          whyMatters:
            "Insufficient relationship evidence is a common source of RFEs.",
          category: "Relationship",
        },
        {
          label: "G-1145 (optional e-notification)",
          whyMatters: "Helps you receive electronic receipt notices faster.",
          category: "Filing",
        },
      ],
      forms: [
        {
          formCode: "I-130",
          title: "Petition for Alien Relative",
          notes: "Use the edition date USCIS specifies on its website.",
        },
      ],
      mistakes: [
        {
          title: "Wrong edition of the form",
          description:
            "USCIS rejects or returns filings that use outdated form editions. Always download from the official forms page.",
          severity: "high",
        },
        {
          title: "Missing translation for foreign-language documents",
          description:
            "Non-English documents generally need a complete English translation with a certification statement.",
          severity: "medium",
        },
      ],
      rfe: [
        {
          title: "Relationship evidence gaps",
          pattern:
            "Birth certificates, marriage certificates, or proof of termination of prior marriages unclear or missing.",
        },
        {
          title: "Bona fides of marriage (if applicable)",
          pattern:
            "For spousal cases, thin joint life documentation can trigger requests for more evidence.",
        },
      ],
    },
    {
      slug: "i-485",
      title: "I-485 Application to Register Permanent Residence",
      formType: "I-485",
      summary:
        "Adjustment of status application filed by eligible applicants inside the United States.",
      overview: `**Official resource:** Follow USCIS form instructions for filing requirements and fees.

**Typical meaning:** If you are eligible and file a complete package, USCIS will process biometrics, may schedule an interview, and will issue a decision.

**Interpretation boundary:** Case status online is a snapshot; it does not guarantee timing or outcomes.`,
      checklist: [
        {
          label: "I-485 form with correct basis box checked",
          whyMatters:
            "Your eligibility path must match the category you are filing under.",
          category: "Core forms",
        },
        {
          label: "I-864 or I-864EZ (affidavit of support) when required",
          whyMatters:
            "Missing or insufficient financial support evidence is a frequent RFE trigger.",
          category: "Financial",
        },
        {
          label: "Medical exam (I-693) per current policy",
          whyMatters:
            "Medical requirements change; follow USCIS guidance for sealed submission rules.",
          category: "Medical",
        },
        {
          label: "Birth certificate and identity documents",
          whyMatters:
            "Identity and civil documents must be clear, complete, and translated when needed.",
          category: "Identity",
        },
      ],
      forms: [
        { formCode: "I-485", title: "Adjustment of status" },
        { formCode: "I-765", title: "Work authorization (often filed together)", notes: "Optional concurrent filing when eligible." },
        { formCode: "I-131", title: "Travel document (often filed together)", notes: "Optional concurrent filing when eligible." },
      ],
      mistakes: [
        {
          title: "Unsigned forms or wrong fees",
          description:
            "USCIS may reject packages with missing signatures or incorrect payment amounts.",
          severity: "high",
        },
        {
          title: "Travel without advance parole when required",
          description:
            "Certain applicants can jeopardize adjustment if they depart without proper permission.",
          severity: "high",
        },
      ],
      rfe: [
        {
          title: "Affidavit of support deficiencies",
          pattern:
            "Income evidence, tax transcripts, or household size documentation insufficient.",
        },
        {
          title: "Public charge or discretionary concerns (case-specific)",
          pattern:
            "USCIS may request more detail on finances or circumstances—evaluate with qualified help if complex.",
        },
      ],
    },
    {
      slug: "i-765",
      title: "I-765 Application for Employment Authorization",
      formType: "I-765",
      summary:
        "Request employment authorization (EAD) when eligible under a listed category.",
      overview: `**Typical meaning:** Approval produces a card authorizing work for a defined period and category.

**When to wait:** Many categories have published processing ranges that fluctuate; use official processing times for context, not guarantees.`,
      checklist: [
        {
          label: "Correct eligibility category on I-765",
          whyMatters:
            "Wrong category codes cause delays or denials; match your underlying eligibility.",
          category: "Eligibility",
        },
        {
          label: "Passport-style photos meeting USCIS specs",
          whyMatters: "Photo rejections can slow the case.",
          category: "Identity",
        },
        {
          label: "Copy of receipt notices or underlying eligibility proof",
          whyMatters:
            "USCIS ties the EAD request to your pending benefit when applicable.",
          category: "Evidence",
        },
      ],
      forms: [{ formCode: "I-765", title: "Employment Authorization" }],
      mistakes: [
        {
          title: "Missing (c)(9) or other category evidence",
          description:
            "Concurrent filing with I-485 requires the correct category and supporting linkage.",
          severity: "medium",
        },
      ],
      rfe: [
        {
          title: "Identity or photo issues",
          pattern:
            "USCIS requests new photos or clearer identity documentation.",
        },
      ],
    },
    {
      slug: "i-131",
      title: "I-131 Application for Travel Document",
      formType: "I-131",
      summary:
        "Advance parole or other travel authorization for eligible pending applicants.",
      overview: `**Critical guardrail:** Travel while a green card case is pending can carry serious risk without the right document.

**Official fact:** Follow USCIS instructions for your situation; do not rely on informal summaries alone.`,
      checklist: [
        {
          label: "Confirm whether advance parole is appropriate for your case",
          whyMatters:
            "Some applicants should not travel even with a pending I-131—get individualized guidance when unsure.",
          category: "Safety check",
        },
        {
          label: "Complete I-131 with correct travel document type",
          whyMatters:
            "Different boxes correspond to different travel products and eligibility.",
          category: "Form",
        },
      ],
      forms: [{ formCode: "I-131", title: "Travel document / advance parole" }],
      mistakes: [
        {
          title: "Assuming any pending I-131 means safe travel",
          description:
            "Eligibility and risk depend on your specific status and pending applications.",
          severity: "high",
        },
      ],
      rfe: [
        {
          title: "Purpose of travel or itinerary detail",
          pattern:
            "USCIS may ask for more context on planned travel when relevant.",
        },
      ],
    },
  ];

  let order = 0;
  for (const g of guideDefs) {
    const guide = await prisma.guide.upsert({
      where: { slug: g.slug },
      create: {
        slug: g.slug,
        title: g.title,
        summary: g.summary,
        formType: g.formType,
        overview: g.overview,
        sortOrder: order++,
        status: ContentStatus.PUBLISHED,
      },
      update: {
        title: g.title,
        summary: g.summary,
        formType: g.formType,
        overview: g.overview,
        status: ContentStatus.PUBLISHED,
      },
    });

    await prisma.guideRequiredForm.deleteMany({ where: { guideId: guide.id } });
    let fi = 0;
    for (const f of g.forms) {
      await prisma.guideRequiredForm.create({
        data: {
          guideId: guide.id,
          formCode: f.formCode,
          title: f.title,
          notes: f.notes ?? null,
          sortOrder: fi++,
        },
      });
    }

    await prisma.documentChecklistItem.deleteMany({ where: { guideId: guide.id } });
    let ci = 0;
    for (const c of g.checklist) {
      await prisma.documentChecklistItem.create({
        data: {
          guideId: guide.id,
          label: c.label,
          whyMatters: c.whyMatters,
          category: c.category,
          sortOrder: ci++,
        },
      });
    }

    await prisma.commonMistake.deleteMany({ where: { guideId: guide.id } });
    let mi = 0;
    for (const m of g.mistakes) {
      await prisma.commonMistake.create({
        data: {
          guideId: guide.id,
          title: m.title,
          description: m.description,
          severity: m.severity,
          sortOrder: mi++,
        },
      });
    }

    await prisma.rfeTrigger.deleteMany({ where: { guideId: guide.id } });
    let ri = 0;
    for (const r of g.rfe) {
      await prisma.rfeTrigger.create({
        data: {
          guideId: guide.id,
          title: r.title,
          pattern: r.pattern,
          sortOrder: ri++,
        },
      });
    }

    await prisma.guideOfficialResource.deleteMany({
      where: { guideId: guide.id },
    });
    await prisma.guideOfficialResource.create({
      data: { guideId: guide.id, resourceId: sharedResource.id },
    });
  }

  await prisma.issueGuide.deleteMany({});
  await prisma.issueCategory.deleteMany({});

  for (const c of RESOLVE_CATEGORIES) {
    await prisma.issueCategory.create({
      data: {
        slug: c.slug,
        name: c.name,
        sortOrder: c.sortOrder,
      },
    });
  }

  const cat = async (slug: string) => {
    const x = await prisma.issueCategory.findUnique({ where: { slug } });
    if (!x) throw new Error(`Missing category ${slug}`);
    return x.id;
  };

  for (const ig of RESOLVE_ISSUES) {
    await prisma.issueGuide.create({
      data: {
        categoryId: await cat(ig.categorySlug),
        slug: ig.slug,
        title: ig.title,
        summary: ig.summary,
        urgencyLevel: ig.urgencyLevel,
        triageLane: ig.triageLane,
        formsAffectedJson: ig.formsAffected,
        lawyerRecommended: ig.lawyerRecommended,
        officialResourceLinksJson: ig.officialResourceLinks,
        relatedSlugsJson: ig.relatedSlugs,
        whyPeopleWorry: ig.whyPeopleWorry,
        typicalMeaning: ig.typicalMeaning,
        whatUsuallyNext: ig.whatUsuallyNext,
        whatToPrepare: ig.whatToPrepare,
        whenToWait: ig.whenToWait,
        whenToEscalate: ig.whenToEscalate,
        likelyCausesJson: ig.likelyCauses,
        evidenceSignalsJson: ig.evidenceSignals,
        nextStepsJson: ig.nextSteps,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  await prisma.interpretationRule.deleteMany({});
  await prisma.interpretationRule.createMany({
    data: [
      {
        name: "Case was received",
        statusPattern: "Case Was Received",
        priority: 10,
        active: true,
        outputJson: {
          summary: "USCIS acknowledges it received your filing.",
          typicalMeaning:
            "This is usually an early milestone. Next steps often include fee processing, scanning, and biometrics scheduling if applicable.",
          waitVsAct: "wait",
          confidence: "high",
          officialTools: ["uscis-case-status", "processing-times"],
        },
      },
      {
        name: "Fingerprints taken",
        statusPattern: "Fingerprints Were Taken",
        priority: 10,
        active: true,
        outputJson: {
          summary: "Biometrics were captured or applied to your case.",
          typicalMeaning:
            "Many cases continue with background and adjudication steps that are not visible day-to-day online.",
          waitVsAct: "wait",
          confidence: "medium",
          officialTools: ["uscis-case-status"],
        },
      },
      {
        name: "Interview scheduled",
        statusPattern: "Interview Was Scheduled",
        priority: 20,
        active: true,
        outputJson: {
          summary: "An interview appears scheduled or mailed.",
          typicalMeaning:
            "You should align your preparation with official notices and any attorney guidance.",
          waitVsAct: "act",
          confidence: "medium",
          documentsToPrepare: [
            "Original civil documents",
            "Updated joint evidence if applicable",
            "Medical exam if instructed",
          ],
          officialTools: ["uscis-case-status"],
        },
      },
    ],
  });

  await prisma.recommendationRule.deleteMany({});
  await prisma.recommendationRule.createMany({
    data: [
      {
        name: "Onboarding incomplete",
        condition: "onboarding_incomplete",
        priority: 100,
        active: true,
        outputJson: {
          title: "Finish onboarding",
          why: "A few answers help QueueTip route you to the right path.",
          actionLabel: "Continue onboarding",
          href: "/app/onboarding",
          timing: "About 2 minutes",
        },
      },
      {
        name: "Track path without cases",
        condition: "track_no_cases",
        priority: 90,
        active: true,
        outputJson: {
          title: "Add a receipt to start tracking",
          why: "We can group related forms and show a calmer timeline view.",
          actionLabel: "Add receipt",
          href: "/app/track/add-case",
          timing: "When you have a receipt number handy",
        },
      },
    ],
  });

  const helpEntries = [
    {
      name: "National Immigration Law Center (illustrative)",
      type: "nonprofit",
      serviceArea: "National / remote consultations",
      website: "https://www.nilc.org",
      phone: null,
      email: null,
      notes: "Sample entry for UI; verify independently before relying on services.",
      languages: ["English", "Spanish"],
      caseTypes: ["I-485", "I-130"],
      regions: ["United States"],
    },
    {
      name: "Local accredited representative (sample)",
      type: "accredited representative",
      serviceArea: "Example metro area",
      website: null,
      phone: "+1-555-0100",
      email: "help@example.org",
      notes: "Replace with real nonprofits in your area for production.",
      languages: ["English"],
      caseTypes: ["I-765", "I-131"],
      regions: ["California"],
    },
    {
      name: "Immigration attorney network (sample)",
      type: "lawyer",
      serviceArea: "Statewide",
      website: "https://example.com",
      phone: null,
      email: null,
      notes: "Not a referral; illustrative card for filters and layout.",
      languages: ["English", "Mandarin"],
      caseTypes: ["I-130", "I-485"],
      regions: ["Texas"],
    },
  ];

  for (const h of helpEntries) {
    const existing = await prisma.helpDirectoryEntry.findFirst({
      where: { name: h.name },
    });
    if (existing) continue;
    await prisma.helpDirectoryEntry.create({
      data: {
        name: h.name,
        type: h.type,
        serviceArea: h.serviceArea,
        website: h.website,
        phone: h.phone,
        email: h.email,
        notes: h.notes,
        languages: {
          create: h.languages.map((language) => ({ language })),
        },
        caseTypes: {
          create: h.caseTypes.map((caseType) => ({ caseType })),
        },
        regions: {
          create: h.regions.map((region) => ({ region })),
        },
      },
    });
  }

  await prisma.faqEntry.deleteMany({});

  const faqs = [
    {
      q: "Is QueueTip a law firm?",
      a: "No. QueueTip provides structured information, plain-English interpretation boundaries, and organization tools. It is not legal advice and not a substitute for an attorney or accredited representative when you need one.",
    },
    {
      q: "Why do you show “typical meaning” separately from official status?",
      a: "Official status text comes from government systems. “Typical meaning” is a general educational explanation based on common patterns—it can be wrong for edge cases and never guarantees your outcome.",
    },
    {
      q: "What forms does V1 focus on?",
      a: "Family-based workflows around I-130, I-485, I-765, and I-131, with room to grow later.",
    },
    {
      q: "Can QueueTip expedite my case?",
      a: "No. Expedites are handled through official USCIS criteria and processes. QueueTip may suggest when to consider official options, but cannot influence government decisions.",
    },
    {
      q: "What is Premium for?",
      a: "Deeper compare and estimate views, richer interpretation notes, saved workflows, and expanded alerts—without locking basic trust features like official tool links.",
    },
    {
      q: "How do you handle my data?",
      a: "Store only what you provide for account, onboarding, and tracking. Use strong passwords in production environments and follow your deployment security checklist.",
    },
  ];
  let fq = 0;
  for (const f of faqs) {
    await prisma.faqEntry.create({
      data: {
        question: f.q,
        answer: f.a,
        sortOrder: fq++,
        published: true,
      },
    });
  }

  await prisma.landingPageSection.upsert({
    where: { key: "trust" },
    create: {
      key: "trust",
      title: "Trust & boundaries",
      body: "QueueTip separates official facts, typical patterns, and suggested next steps. We never promise outcomes.",
      published: true,
    },
    update: {},
  });

  await prisma.notificationTemplate.createMany({
    data: [
      {
        key: "status_change",
        titleTemplate: "Status update: {{formType}}",
        bodyTemplate:
          "Your case {{receipt}} changed to: {{status}}. Verify on USCIS Case Status.",
      },
      {
        key: "delay_threshold",
        titleTemplate: "No update in a while",
        bodyTemplate:
          "We have not recorded a meaningful status change for {{days}} days. Consider official processing times and eligible inquiries.",
      },
    ],
    skipDuplicates: true,
  });

  const demoEmail = "demo@queuetip.dev";
  const demoPass = "Demo123456!";
  let demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!demoUser) {
    const demoHash = await bcrypt.hash(demoPass, 12);
    demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        passwordHash: demoHash,
        profile: { create: { firstName: "Sam", lastName: "Rivera" } },
        subscription: { create: { plan: Plan.FREE, status: "ACTIVE" } },
        notifPrefs: { create: {} },
        onboarding: {
          create: {
            completed: true,
            journeyCategory: "ALREADY_FILED",
            alreadyFiled: true,
            hasReceipt: true,
            routedPath: "TRACK",
            formsInvolved: ["I-130", "I-485", "I-765", "I-131"],
          },
        },
      },
    });
    const group = await prisma.caseGroup.create({
      data: {
        userId: demoUser.id,
        label: "Marina & Sam — Adjustment package",
      },
    });
    const demoCases: Array<{
      receipt: string;
      form: string;
      status: string;
    }> = [
      { receipt: "MSC2190543210", form: "I-130", status: "Case Was Received" },
      {
        receipt: "MSC2190543211",
        form: "I-485",
        status: "Fingerprints Were Taken",
      },
      { receipt: "MSC2190543212", form: "I-765", status: "Case Was Received" },
      { receipt: "MSC2190543213", form: "I-131", status: "Case Was Received" },
    ];
    for (const row of demoCases) {
      const c = await prisma.case.create({
        data: {
          userId: demoUser.id,
          caseGroupId: group.id,
          receiptNumber: row.receipt,
          formType: row.form,
          currentStatusLabel: row.status,
          lastSyncedAt: new Date(),
        },
      });
      await prisma.caseStatusSnapshot.create({
        data: {
          caseId: c.id,
          statusLabel: row.status,
          description:
            "Mock snapshot for demo — replace with live USCIS integration.",
          source: "mock",
          isOfficial: true,
        },
      });
      await prisma.caseEvent.create({
        data: {
          caseId: c.id,
          title: "Status observed",
          description: row.status,
          kind: "status_change",
          occurredAt: new Date(Date.now() - 7 * 86400000),
        },
      });
    }
    console.log(`Demo user: ${demoEmail} / ${demoPass}`);
  }

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
