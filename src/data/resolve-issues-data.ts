import type {
  OfficialResourceLink,
  ResolveIssueSeed,
  ResolveTriageLane,
  ResolveUrgency,
} from "./resolve-issues-types";
import { resolveLinks } from "./resolve-issues-types";

type In = {
  categorySlug: string;
  slug: string;
  title: string;
  summary: string;
  urgencyLevel: ResolveUrgency;
  triageLane: ResolveTriageLane;
  formsAffected?: string[];
  lawyerRecommended?: boolean;
  whyPeopleWorry: string;
  typicalMeaning: string;
  whatUsuallyNext: string;
  whatToPrepare: string;
  whenToWait: string;
  whenToEscalate: string;
  likelyCauses: string[];
  evidenceSignals: string[];
  nextSteps: string[];
  officialResourceLinks?: OfficialResourceLink[];
  relatedSlugs?: string[];
};

function issue(i: In): ResolveIssueSeed {
  return {
    formsAffected: i.formsAffected ?? [],
    lawyerRecommended: i.lawyerRecommended ?? false,
    officialResourceLinks:
      i.officialResourceLinks ?? resolveLinks("caseStatus", "processingTimes"),
    relatedSlugs: i.relatedSlugs ?? [],
    categorySlug: i.categorySlug,
    slug: i.slug,
    title: i.title,
    summary: i.summary,
    urgencyLevel: i.urgencyLevel,
    triageLane: i.triageLane,
    whyPeopleWorry: i.whyPeopleWorry,
    typicalMeaning: i.typicalMeaning,
    whatUsuallyNext: i.whatUsuallyNext,
    whatToPrepare: i.whatToPrepare,
    whenToWait: i.whenToWait,
    whenToEscalate: i.whenToEscalate,
    likelyCauses: i.likelyCauses,
    evidenceSignals: i.evidenceSignals,
    nextSteps: i.nextSteps,
  };
}

/** Full Resolve issue library — seed via prisma/seed.ts */
export const RESOLVE_ISSUES: ResolveIssueSeed[] = [
  issue({
    categorySlug: "delays-and-silence",
    slug: "case-taking-longer-than-expected",
    title: "Case taking longer than expected",
    summary:
      "Published ranges are estimates; many family cases move in quiet phases.",
    urgencyLevel: "low",
    triageLane: "monitor",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Applicants often compare their wait to friends’ timelines or unofficial forums and fear something is wrong.",
    typicalMeaning:
      "USCIS publishes processing time ranges that change with workload. Being inside the range usually means the case is still in normal queue processing.",
    whatUsuallyNext:
      "If there is no RFE or interview deadline, the file may simply be pending adjudication or background steps you cannot see online.",
    whatToPrepare:
      "Receipt date, form type, office or service center from notices, and a screenshot of current posted ranges.",
    whenToWait:
      "When you are within posted processing times and online status shows routine pending language, waiting is often appropriate.",
    whenToEscalate:
      "If you are far outside posted ranges, have urgent humanitarian reasons, or see contradictory notices, consider e-Request (if eligible) or qualified help.",
    likelyCauses: [
      "Backlog at field office or service center",
      "Background or security checks",
      "File transfer between locations",
    ],
    evidenceSignals: [
      "Last status change date",
      "Posted processing window for your form and category",
    ],
    nextSteps: [
      "Open USCIS processing times for your exact form and category.",
      "Confirm mailing address on file is current.",
      "Avoid paying for unofficial “expedite guarantees.”",
    ],
    relatedSlugs: ["no-update-long-time"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "no-update-long-time",
    title: "No update for a long time",
    summary:
      "Online status can stay generic while a case is still pending internally.",
    urgencyLevel: "moderate",
    triageLane: "monitor",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Silence feels like neglect or loss of the file, especially when work or travel depends on the case.",
    typicalMeaning:
      "USCIS Case Status often shows high-level wording that does not refresh with every internal step.",
    whatUsuallyNext:
      "If you are inside posted ranges, many cases receive the next visible update only when a milestone occurs (RFE, interview, decision).",
    whatToPrepare:
      "Timeline of every status check, any mail from USCIS, and proof of address updates.",
    whenToWait:
      "Quiet periods inside published ranges are common and do not by themselves prove a problem.",
    whenToEscalate:
      "If outside ranges, after a clear USCIS error, or with imminent harm (job loss, medical travel), explore official inquiries or counsel.",
    likelyCauses: ["No milestone yet", "Mail or scanning delay", "Multiple forms processed separately"],
    evidenceSignals: ["Unchanged status for months", "No mail", "Still within posted window"],
    nextSteps: [
      "Compare silence duration to posted processing times.",
      "Check each receipt in a group separately.",
      "Verify USPS forwarding if you moved.",
    ],
    relatedSlugs: ["case-taking-longer-than-expected"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "rfe-response-sent-no-change",
    title: "RFE response sent but nothing changed",
    summary:
      "USCIS needs time to scan, route, and review a mailed or uploaded response.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "People fear the response was lost or that missing the invisible queue will cause denial.",
    typicalMeaning:
      "After a complete RFE response, the case usually returns to the adjudication queue; online status may lag.",
    whatUsuallyNext:
      "You may see a generic “response received” or no change until the next decision or follow-up request.",
    whatToPrepare:
      "Copy of full response, proof of delivery or upload confirmation, RFE deadline date.",
    whenToWait:
      "Several weeks to months of no new line after proof of delivery can still fall within normal processing variance.",
    whenToEscalate:
      "If proof shows delivery long ago and you are past reasonable processing, use official inquiry options or get help.",
    likelyCauses: ["Mailroom backlog", "Scanning delay", "Case awaiting officer review"],
    evidenceSignals: ["Tracking shows delivered", "No online acknowledgement yet"],
    nextSteps: [
      "Keep return receipt or UPS/FedEx proof.",
      "Note the date USCIS should have received the packet.",
      "Do not re-send duplicates unless USCIS instructs you.",
    ],
    officialResourceLinks: resolveLinks("caseStatus", "eRequest", "forms"),
    relatedSlugs: ["received-rfe"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "ead-delayed",
    title: "EAD delayed",
    summary:
      "I-765 processing times vary; expedite rules are narrow and fact-specific.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-765"],
    whyPeopleWorry:
      "Job offers and household income often depend on the card arriving on time.",
    typicalMeaning:
      "USCIS publishes I-765 ranges by category and location; they are not promises of completion by a date.",
    whatUsuallyNext:
      "If eligible, some applicants explore expedite through official channels; criteria are strict.",
    whatToPrepare:
      "Receipt, category code, prior EAD copies, employer letter if pursuing expedite.",
    whenToWait:
      "While still inside the published range for your category, delay alone may not be abnormal.",
    whenToEscalate:
      "Severe financial or employer hardship with documented facts may warrant accredited help to assess expedite; outcomes are not guaranteed.",
    likelyCauses: ["Photo or biometrics issues", "Category mismatch", "Background checks"],
    evidenceSignals: ["Outside posted range", "Biometrics pending"],
    nextSteps: [
      "Verify I-765 category matches your situation.",
      "Check current I-765 processing times.",
      "Discuss expedite eligibility with a professional if urgent.",
    ],
    relatedSlugs: ["advance-parole-delayed"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "advance-parole-delayed",
    title: "Advance parole / travel document delayed",
    summary:
      "I-131 timelines fluctuate; international travel before approval carries risk.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-131"],
    whyPeopleWorry:
      "Family emergencies abroad create pressure when travel documents are pending.",
    typicalMeaning:
      "Advance parole adjudication follows posted ranges; urgent travel does not automatically shorten processing.",
    whatUsuallyNext:
      "Some applicants request expedite with documentation; USCIS decides based on policy and facts.",
    whatToPrepare:
      "Receipt, proof of emergency if applicable, understanding of travel risk without parole.",
    whenToWait:
      "Inside posted ranges, waiting is common; leaving the U.S. without appropriate parole can have serious consequences.",
    whenToEscalate:
      "True emergencies or complex parole-in-place questions need qualified legal advice—not guesswork.",
    likelyCauses: ["Backlog", "Incomplete file", "Multiple filings"],
    evidenceSignals: ["Emergency abroad", "Long-pending I-131"],
    nextSteps: [
      "Read current I-131 instructions for your category.",
      "Do not assume re-entry is safe without parole or other authorization.",
      "Use Help Directory for urgent legal questions.",
    ],
    lawyerRecommended: false,
    relatedSlugs: ["ead-delayed"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "interview-not-scheduled",
    title: "Interview not scheduled",
    summary:
      "Some cases are interviewed; others are waived; timing varies widely.",
    urgencyLevel: "low",
    triageLane: "monitor",
    formsAffected: ["I-485"],
    whyPeopleWorry:
      "Applicants expect an interview soon after filing and fear missing a notice.",
    typicalMeaning:
      "USCIS may schedule interviews months or years out, or waive interview when policy allows.",
    whatUsuallyNext:
      "You may receive an interview notice by mail; online status may update before or after mail.",
    whatToPrepare:
      "Current address, list of address changes filed with USCIS, joint evidence if marriage-based.",
    whenToWait:
      "If within published ranges and no denial signals, lack of interview date can still be normal.",
    whenToEscalate:
      "If you moved without updating USCIS, or you are far outside normal patterns, correct the address and seek guidance.",
    likelyCauses: ["Field office scheduling backlog", "Interview waived", "Case pending pre-interview steps"],
    evidenceSignals: ["No notice by mail", "Status still “pending”"],
    nextSteps: [
      "Confirm AR-11 / address updates if you relocated.",
      "Check processing times for your office.",
      "Keep mail monitored for interview notice.",
    ],
    relatedSlugs: ["case-taking-longer-than-expected"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "green-card-not-produced-mailed",
    title: "Green card not produced / not mailed",
    summary:
      "After approval, card production and USPS delivery are separate steps.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-485"],
    whyPeopleWorry:
      "Approval feels final; delays after approval create anxiety about errors or loss.",
    typicalMeaning:
      "USCIS and USPS handle production and mailing; tracking may appear only after shipment.",
    whatUsuallyNext:
      "You may see “card is being produced” or similar; then mailing updates.",
    whatToPrepare:
      "Approval notice, current mailing address, any USCIS messages about production.",
    whenToWait:
      "A modest gap after approval before tracking appears is often reported.",
    whenToEscalate:
      "If USPS shows delivery problems or months pass with no card, use official inquiry or help.",
    likelyCauses: ["Production backlog", "Address error", "USPS delay"],
    evidenceSignals: ["Approval but no card weeks later"],
    nextSteps: [
      "Verify the address on the approval notice.",
      "Check Case Status for production messages.",
      "Contact USCIS through official channels if stalled.",
    ],
    relatedSlugs: ["card-mailed-not-received"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "card-mailed-not-received",
    title: "Card mailed but not received",
    summary:
      "USPS issues are common; card replacement may require a formal request.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-485", "I-765"],
    whyPeopleWorry:
      "A lost card affects work, travel, and ID; identity theft is a background concern.",
    typicalMeaning:
      "Tracking may show delivered while the envelope is missing; USCIS has procedures for non-delivery.",
    whatUsuallyNext:
      "Document USPS status, then follow USCIS instructions for non-receipt or replacement.",
    whatToPrepare:
      "Tracking screenshots, mail address, approval notice.",
    whenToWait:
      "Allow a few days for neighbor or apartment office misdelivery before acting.",
    whenToEscalate:
      "If USCIS confirms delivery but you have nothing, pursue official replacement paths promptly.",
    likelyCauses: ["Wrong mailbox", "Theft", "USPS error"],
    evidenceSignals: ["Delivered scan but no envelope"],
    nextSteps: [
      "Check with USPS and neighbors.",
      "Follow USCIS guidance for card not received.",
      "Keep copies of all submissions.",
    ],
    relatedSlugs: ["green-card-not-produced-mailed"],
  }),
  issue({
    categorySlug: "delays-and-silence",
    slug: "biometrics-reuse-confusion",
    title: "Biometrics reuse / no biometrics notice confusion",
    summary:
      "USCIS sometimes reuses prior prints; status wording varies by form.",
    urgencyLevel: "low",
    triageLane: "monitor",
    formsAffected: ["I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Missing an appointment fear drives people to assume the worst when no ASC letter arrives.",
    typicalMeaning:
      "Reuse policies change; some filings skip a new ASC visit when prior biometrics apply.",
    whatUsuallyNext:
      "You may receive a reuse notice or a new appointment; online status may update either way.",
    whatToPrepare:
      "Prior ASC notices, receipt notices, current address.",
    whenToWait:
      "If status mentions reuse or you recently completed biometrics for a related filing, waiting can be normal.",
    whenToEscalate:
      "If you never received a scheduled appointment and processing stalls, verify address and use official help.",
    likelyCauses: ["Reuse applied", "Notice lost in mail", "ASC rescheduling"],
    evidenceSignals: ["Status says fingerprint reuse", "No ASC letter"],
    nextSteps: [
      "Read the exact status line on Case Status.",
      "Confirm address on file.",
      "Compare to form-specific USCIS instructions.",
    ],
    relatedSlugs: ["no-update-long-time"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "received-rfe",
    title: "Received an RFE",
    summary:
      "USCIS is asking for specific items by a deadline; incomplete responses carry risk.",
    urgencyLevel: "high",
    triageLane: "review",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Deadlines and dense RFE language create fear of denial for small mistakes.",
    typicalMeaning:
      "A Request for Evidence lists what the officer needs to continue; it is a structured opportunity to respond.",
    whatUsuallyNext:
      "A timely, complete response is critical; partial responses may invite another RFE or denial.",
    whatToPrepare:
      "Index of every RFE item, exhibits, translations, proof of mailing or upload.",
    whenToWait:
      "After submission, expect processing time before the next update.",
    whenToEscalate:
      "If the RFE requests legally impossible items or you cannot interpret it, consult an attorney or accredited representative before the deadline.",
    likelyCauses: ["Thin initial evidence", "Unclear scans", "Eligibility questions flagged"],
    evidenceSignals: ["RFE with due date", "Online status references RFE"],
    nextSteps: [
      "Calendar the deadline in local time.",
      "Map each bullet in the RFE to a document.",
      "Keep proof of delivery.",
    ],
    officialResourceLinks: resolveLinks("caseStatus", "forms", "findLegal"),
    relatedSlugs: ["rfe-response-sent-no-change", "received-noid"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "received-noid",
    title: "Received a NOID",
    summary:
      "A Notice of Intent to Deny is serious; you must respond carefully and on time.",
    urgencyLevel: "critical",
    triageLane: "review",
    formsAffected: ["I-130", "I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "NOID language sounds like imminent denial and may involve legal arguments.",
    typicalMeaning:
      "USCIS is giving notice and an opportunity to rebut before a final denial in many contexts.",
    whatUsuallyNext:
      "A structured legal response is often appropriate; generic evidence alone may not suffice.",
    whatToPrepare:
      "The NOID letter, entire prior filing, and any evidence that directly addresses each allegation.",
    whenToWait:
      "Do not wait casually—deadlines are real.",
    whenToEscalate:
      "NOIDs usually warrant attorney or accredited representative review before you respond.",
    likelyCauses: ["Eligibility doubts", "Fraud indicators (alleged)", "Legal complexity"],
    evidenceSignals: ["NOID with short deadline"],
    nextSteps: [
      "Note the response deadline immediately.",
      "Avoid emotional replies; organize facts.",
      "Seek qualified help through the Help Directory.",
    ],
    officialResourceLinks: resolveLinks("caseStatus", "findLegal", "policyManual"),
    relatedSlugs: ["received-rfe", "received-denial"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "received-denial",
    title: "Received a denial",
    summary:
      "Denials have consequences; options may include motion, appeal, or refiling—each is fact-specific.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "People fear immediate loss of status, work authorization, or future eligibility.",
    typicalMeaning:
      "The notice should state reasons and sometimes next steps (motion to reopen, appeal, etc.).",
    whatUsuallyNext:
      "Deadlines for any challenge are strict; wrong moves can foreclose options.",
    whatToPrepare:
      "Complete denial notice, entire file copy, timeline of what was submitted.",
    whenToWait:
      "Do not delay reading the denial—some windows are very short.",
    whenToEscalate:
      "Legal review is strongly recommended before you choose a path.",
    likelyCauses: ["Eligibility failure", "Missed RFE", "Discretionary denial"],
    evidenceSignals: ["Written denial", "Termination of benefits referenced"],
    nextSteps: [
      "Read every page of the denial for deadlines.",
      "Do not assume re-filing fixes everything.",
      "Contact qualified counsel or accredited representative promptly.",
    ],
    officialResourceLinks: resolveLinks("findLegal", "policyManual", "caseStatus"),
    relatedSlugs: ["received-noid", "prior-denial-current-case"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "online-status-mail-mismatch",
    title: "Online status does not match the mail notice",
    summary:
      "Systems and mail can differ in timing and wording; compare sources before assuming error.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Contradictions feel like someone else’s case or a harmful mistake.",
    typicalMeaning:
      "Online summaries can lag or simplify; the mailed notice is often more specific.",
    whatUsuallyNext:
      "Reconcile dates and receipt numbers; confirm you are viewing the correct case.",
    whatToPrepare:
      "PDFs of notices, screenshots of online status with timestamps.",
    whenToWait:
      "If mail just arrived, give the system a short window to align.",
    whenToEscalate:
      "Persistent mismatch on material facts (wrong name, wrong decision) needs official inquiry or legal help.",
    likelyCauses: ["Lag", "Multiple receipts", "Generic online text"],
    evidenceSignals: ["Different dates or outcomes online vs mail"],
    nextSteps: [
      "Open each receipt separately in Case Status.",
      "Compare exact wording and codes.",
      "Use e-Request or counsel if a true error is likely.",
    ],
    relatedSlugs: ["missing-notice-document", "notice-typo-name-mismatch"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "missing-notice-document",
    title: "Missing notice or document",
    summary:
      "Lost mail and portal gaps happen; recreating proof requires official channels.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "Deadlines may be missed if a notice never arrived.",
    typicalMeaning:
      "USCIS may resend or confirm what was mailed; you must act before deadlines when possible.",
    whatUsuallyNext:
      "Inquiry or duplicate notice request through official tools, if available.",
    whatToPrepare:
      "Receipt numbers, address history, any informed delivery data.",
    whenToWait:
      "If no deadline is active, a short wait while requesting a duplicate may be fine.",
    whenToEscalate:
      "Imminent deadlines with no notice—get legal help immediately.",
    likelyCauses: ["USPS loss", "Old address", "USCIS system delay"],
    evidenceSignals: ["Others got interview mail; you did not"],
    nextSteps: [
      "Update address if needed via official process.",
      "Use e-Request or phone lines per USCIS guidance.",
      "Document every call or submission.",
    ],
    officialResourceLinks: resolveLinks("caseStatus", "eRequest"),
    relatedSlugs: ["online-status-mail-mismatch"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "notice-typo-name-mismatch",
    title: "Typo in notice / name mismatch",
    summary:
      "Small errors can signal data entry problems; some fixes are administrative.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    whyPeopleWorry:
      "People fear denials or identity mix-ups from spelling differences.",
    typicalMeaning:
      "USCIS sometimes issues notices with clerical errors; correction paths depend on context.",
    whatUsuallyNext:
      "Compare to your filed forms; follow USCIS correction guidance or consult help if material.",
    whatToPrepare:
      "Passport, birth certificate, filed G-325A or biographic forms, erroneous notice.",
    whenToWait:
      "Trivial typos with no impact on eligibility may be resolved administratively.",
    whenToEscalate:
      "If the error affects A-number, receipt, or could confuse adjudication, get professional help.",
    likelyCauses: ["Data entry", "OCR from scans", "Multiple name formats"],
    evidenceSignals: ["Different spellings across documents"],
    nextSteps: [
      "List every variation of your name used on filings.",
      "Follow USCIS instructions for corrections.",
      "Keep proof of any correction request.",
    ],
    relatedSlugs: ["online-status-mail-mismatch"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "priority-date-category-confusion",
    title: "Priority date / category confusion",
    summary:
      "Visa bulletin and preference categories confuse many family cases; verify your category with official charts.",
    urgencyLevel: "low",
    triageLane: "monitor",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Bulletin movement drives fear of “losing a spot” or filing too early.",
    typicalMeaning:
      "Priority dates and visa categories come from statute and DOS visa bulletin rules—not forums.",
    whatUsuallyNext:
      "If filing concurrently is allowed for your category and month, USCIS/DOS instructions govern.",
    whatToPrepare:
      "I-797 receipt, approval dates, visa bulletin screenshots for relevant month.",
    whenToWait:
      "When your category is not yet current, waiting for the bulletin is normal.",
    whenToEscalate:
      "Complex cross-chargeability or derivative questions need legal analysis.",
    likelyCauses: ["Misread bulletin", "Wrong preference assumption"],
    evidenceSignals: ["Unsure if I-485 can file"],
    nextSteps: [
      "Read DOS Visa Bulletin notes for your category.",
      "Confirm USCIS “Dates for Filing” vs “Final Action” when applicable.",
      "Use Help Directory for nuanced questions.",
    ],
    officialResourceLinks: resolveLinks("caseStatus", "policyManual"),
    relatedSlugs: ["case-transferred-confusion"],
  }),
  issue({
    categorySlug: "notices-and-mismatch",
    slug: "case-transferred-confusion",
    title: "Case transferred and you do not understand what changed",
    summary:
      "Transfers between service centers or to field offices are common routing steps.",
    urgencyLevel: "moderate",
    triageLane: "monitor",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Transfers feel like starting over or losing priority.",
    typicalMeaning:
      "USCIS moves workload between locations; your receipt number usually stays the same.",
    whatUsuallyNext:
      "Processing continues at the new location; times may differ from the prior site.",
    whatToPrepare:
      "Transfer notice, old and new office names, receipt.",
    whenToWait:
      "After transfer, a quiet period while the new office opens the file is common.",
    whenToEscalate:
      "If status disappears or errors reference wrong receipt, seek official help.",
    likelyCauses: ["Workload balancing", "Interview scheduling location"],
    evidenceSignals: ["Notice says transferred"],
    nextSteps: [
      "Read which office now has jurisdiction.",
      "Update processing time lookup to new location if instructed.",
      "Monitor mail for interview or RFE from new office.",
    ],
    relatedSlugs: ["priority-date-category-confusion"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "possible-missing-evidence",
    title: "Possible missing evidence",
    summary:
      "Gaps in the initial filing may surface as RFEs; proactive review is practical, not predictive.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Applicants second-guess every document after submission.",
    typicalMeaning:
      "USCIS reviews for completeness; you cannot reopen the package casually, but you can prepare supplements if an RFE arrives.",
    whatUsuallyNext:
      "Wait for official feedback unless USCIS invites unsolicited evidence (rare).",
    whatToPrepare:
      "Checklist from current form instructions; copies of what you already sent.",
    whenToWait:
      "Unless instructed, mailing extra packets without an RFE can confuse the file.",
    whenToEscalate:
      "If you discover a material omission before decision, ask counsel whether cover letter + evidence is appropriate.",
    likelyCauses: ["Rushed filing", "Translation gaps", "Missing joint documents"],
    evidenceSignals: ["You remember skipping a listed item"],
    nextSteps: [
      "Re-read official form instructions for your edition.",
      "Organize potential exhibits in case of RFE.",
      "Track mail and online status.",
    ],
    officialResourceLinks: resolveLinks("forms", "policyManual"),
    relatedSlugs: ["received-rfe", "marriage-evidence-concern"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "affidavit-support-concern",
    title: "Affidavit of support concern",
    summary:
      "I-864 and household size rules are technical; public charge rules are separate but related in policy.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-864", "I-485"],
    whyPeopleWorry:
      "Income thresholds and joint sponsors confuse families.",
    typicalMeaning:
      "Sponsors must meet requirements in effect for their filing; USCIS reviews income evidence against the Poverty Guidelines.",
    whatUsuallyNext:
      "RFEs often request updated tax documents or joint sponsor forms.",
    whatToPrepare:
      "Tax transcripts, W-2s, pay stubs, employer letters, joint sponsor packet if used.",
    whenToWait:
      "If you met guidelines at filing and nothing changed, waiting for adjudication may be fine.",
    whenToEscalate:
      "Complex household composition or self-employment analysis may need tax or legal help.",
    likelyCauses: ["Income borderline", "Incorrect household size", "Missing tax year"],
    evidenceSignals: ["RFE on I-864"],
    nextSteps: [
      "Download current Poverty Guidelines.",
      "Compare to sponsor’s documented income.",
      "Review I-864 instructions for your edition.",
    ],
    officialResourceLinks: resolveLinks("forms", "policyManual"),
    relatedSlugs: ["joint-sponsor-concern", "public-charge-financial-concern"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "i693-timing-confusion",
    title: "Medical exam / I-693 timing confusion",
    summary:
      "Civil surgeon exams have validity and sealing rules; timing with filing matters.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-485"],
    whyPeopleWorry:
      "Expired or improperly sealed I-693 triggers RFEs or delays.",
    typicalMeaning:
      "USCIS publishes how long exams remain valid and when to submit; follow the edition in effect.",
    whatUsuallyNext:
      "You may file with exam in sealed envelope or submit after filing per instructions.",
    whatToPrepare:
      "Civil surgeon list, vaccination records, prior I-693 if any.",
    whenToWait:
      "If exam is valid and properly sealed, no immediate redo is needed.",
    whenToEscalate:
      "Health-related inadmissibility questions need medical and legal guidance.",
    likelyCauses: ["Expired exam", "Unsealed packet", "Wrong form edition"],
    evidenceSignals: ["RFE for new medical"],
    nextSteps: [
      "Read I-693 instructions on uscis.gov.",
      "Confirm surgeon is USCIS-designated.",
      "Keep a copy of the sealed envelope receipt.",
    ],
    officialResourceLinks: resolveLinks("forms", "policyManual"),
    relatedSlugs: ["possible-missing-evidence"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "translation-civil-document-concern",
    title: "Translation / civil document concern",
    summary:
      "Foreign documents usually need complete English translation with a certification statement.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Applicants fear rejections for translation format.",
    typicalMeaning:
      "USCIS expects full translations and translator certifications as described in instructions.",
    whatUsuallyNext:
      "RFEs may request compliant translations or certified copies.",
    whatToPrepare:
      "Certified copies of originals, word-for-word translation, translator statement.",
    whenToWait:
      "If you submitted compliant translations, wait for review.",
    whenToEscalate:
      "Unusual vital records from certain countries may need expert translators or counsel.",
    likelyCauses: ["Summary translation", "Missing certification"],
    evidenceSignals: ["RFE cites translation"],
    nextSteps: [
      "Match USCIS translation guidance in form instructions.",
      "Use qualified translators for legal names and dates.",
      "Keep originals safe; send copies unless instructed otherwise.",
    ],
    officialResourceLinks: resolveLinks("forms", "policyManual"),
    relatedSlugs: ["birth-certificate-issue"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "birth-certificate-issue",
    title: "Birth certificate issue",
    summary:
      "Some countries issue non-standard records; USCIS may expect specific formats or secondary evidence.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Unavailable or late-registration birth records create eligibility doubts.",
    typicalMeaning:
      "USCIS policy addresses unavailable documents and alternatives; country conditions vary.",
    whatUsuallyNext:
      "You may need secondary evidence, affidavits, or country-specific guidance.",
    whatToPrepare:
      "Any non-availability letter, church or school records, early photos if policy allows.",
    whenToWait:
      "If you filed best available evidence, wait for officer feedback.",
    whenToEscalate:
      "Persistent non-availability or conflicting records needs legal strategy.",
    likelyCauses: ["Late registration", "No vital records system", "Name variants"],
    evidenceSignals: ["RFE for different birth proof"],
    nextSteps: [
      "Review Policy Manual sections on birth records for your context.",
      "Gather secondary evidence listed in instructions.",
      "Consult counsel if RFE is unclear.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "forms"),
    relatedSlugs: ["translation-civil-document-concern"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "marriage-evidence-concern",
    title: "Marriage evidence concern",
    summary:
      "Bona fide marriage proof is fact-specific; quality and consistency matter more than volume alone.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-130", "I-485"],
    whyPeopleWorry:
      "Couples fear interviews and RFEs questioning authenticity.",
    typicalMeaning:
      "USCIS evaluates whether the marriage was entered into in good faith, using totality of evidence.",
    whatUsuallyNext:
      "Interview or RFE may probe gaps in joint life documentation.",
    whatToPrepare:
      "Joint accounts, leases, insurance, affidavits from people who know you, timeline of relationship.",
    whenToWait:
      "After strong initial filing, waiting for next step is normal.",
    whenToEscalate:
      "Fraud allegations or NOID require immediate legal representation.",
    likelyCauses: ["Short relationship before filing", "Little co-mingling"],
    evidenceSignals: ["RFE lists relationship gaps"],
    nextSteps: [
      "Organize documents chronologically.",
      "Ensure dates align across forms.",
      "Prepare calmly for interview questions.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "forms"),
    relatedSlugs: ["possible-missing-evidence", "received-noid"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "joint-sponsor-concern",
    title: "Joint sponsor concern",
    summary:
      "A joint sponsor can supplement household income when the petitioner does not meet guidelines alone.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-864"],
    whyPeopleWorry:
      "Families worry whether a joint sponsor’s income “counts” or creates liability.",
    typicalMeaning:
      "USCIS reviews each sponsor’s I-864 package; joint sponsors must meet requirements independently.",
    whatUsuallyNext:
      "RFE may request updated tax proof or domicile evidence for sponsors.",
    whatToPrepare:
      "Joint sponsor’s taxes, employment proof, proof of U.S. status or residency as required.",
    whenToWait:
      "If both sponsors clearly exceed guidelines, adjudication may proceed without extra steps.",
    whenToEscalate:
      "Domicile, tax dependency, or household size disputes need legal/tax advice.",
    likelyCauses: ["Primary sponsor income shortfall", "Household math errors"],
    evidenceSignals: ["RFE naming sponsor issues"],
    nextSteps: [
      "Verify each sponsor files a complete I-864 with correct edition.",
      "Align tax year with instructions.",
      "Document relationship to joint sponsor if required.",
    ],
    relatedSlugs: ["affidavit-support-concern"],
  }),
  issue({
    categorySlug: "filing-and-evidence",
    slug: "public-charge-financial-concern",
    title: "Public charge / financial concern (framing)",
    summary:
      "Public charge inadmissibility has regulatory tests; it is not the same as every benefits question.",
    urgencyLevel: "moderate",
    triageLane: "review",
    formsAffected: ["I-485"],
    lawyerRecommended: false,
    whyPeopleWorry:
      "Families fear any past benefit use or low income means automatic denial.",
    typicalMeaning:
      "USCIS applies defined factors for adjustment applicants subject to public charge review; many family cases turn on I-864 sufficiency and statutory exemptions.",
    whatUsuallyNext:
      "You may need to document income, assets, or Form I-944-era replacements per current rules.",
    whatToPrepare:
      "Current USCIS instructions for your filing date, sponsor evidence, education and skills records if requested.",
    whenToWait:
      "Do not assume worst case from rumors—verify which rules apply to your filing.",
    whenToEscalate:
      "Complex benefit history or I-864 shortfalls merit legal consult.",
    likelyCauses: ["Misinformation", "Mixed household finances"],
    evidenceSignals: ["Unsure if benefits affect case"],
    nextSteps: [
      "Read the edition of instructions that matches your I-485 filing date.",
      "Separate “tax public benefits” myths from USCIS criteria.",
      "Use Help Directory for individualized questions.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "forms"),
    relatedSlugs: ["affidavit-support-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "overstay-unlawful-presence",
    title: "Overstay / unlawful presence concern",
    summary:
      "Unlawful presence and inadmissibility rules are legally complex; USCIS highlights complexity and authorized advice.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485", "I-130"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "People fear permanent bars, 3/10-year triggers, and eligibility to adjust.",
    typicalMeaning:
      "Whether time in the U.S. counts as unlawful presence and whether bars apply depends on immigration history and current law—not a simple calculator.",
    whatUsuallyNext:
      "A qualified attorney or DOJ-accredited representative typically reviews entries, status, and any waivers.",
    whatToPrepare:
      "Complete travel history, I-94 records, prior filings, any prior decisions.",
    whenToWait:
      "Do not self-adjudicate eligibility from articles alone.",
    whenToEscalate:
      "Immediately seek authorized legal advice; QueueTip only orients you to official materials.",
    likelyCauses: ["Expired visa", "Status gap", "EWIs in some analyses"],
    evidenceSignals: ["Unsure if you accrued unlawful presence"],
    nextSteps: [
      "Gather I-94 and passport entry stamps.",
      "Read USCIS overview on unlawful presence for orientation only.",
      "Use Help Directory to find authorized representatives.",
    ],
    officialResourceLinks: resolveLinks(
      "unlawfulPresence",
      "policyManual",
      "findLegal",
    ),
    relatedSlugs: ["waiver-need-concern", "ewi-admission-history-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "unauthorized-work-concern",
    title: "Unauthorized work concern",
    summary:
      "Unlawful employment can affect eligibility and waivers depending on category and facts.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Applicants fear automatic denial for any off-books work.",
    typicalMeaning:
      "Some adjustment paths forgive certain periods; others do not. Analysis is legal, not informational.",
    whatUsuallyNext:
      "Counsel reviews timeline, authorization, and any exceptions that may apply.",
    whatToPrepare:
      "Employment dates, pay records if any, tax filings, prior EADs.",
    whenToWait:
      "Do not omit work history on forms without legal advice—that can create misrepresentation risk.",
    whenToEscalate:
      "Legal consult before filing or before interview.",
    likelyCauses: ["Worked before EAD", "Cash jobs"],
    evidenceSignals: ["Worried about SS records"],
    nextSteps: [
      "List every employer and date range honestly for your attorney.",
      "Avoid filing corrections without strategy.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal"),
    relatedSlugs: ["overstay-unlawful-presence", "waiver-need-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "ewi-admission-history-concern",
    title: "Entry without inspection / admission history concern",
    summary:
      "Manner of last admission can determine whether adjustment in the U.S. is available.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "EWI history creates fear of permanent ineligibility.",
    typicalMeaning:
      "Certain provisions (e.g., INA 245(i) grandfathering, parole, VAWA paths) may exist for narrow facts—only legal analysis can say if they help you.",
    whatUsuallyNext:
      "Attorney reviews entries, any prior petitions, and waiver needs.",
    whatToPrepare:
      "I-94 if any, border records requests, family petition history.",
    whenToWait:
      "Do not assume consular processing vs adjustment without advice.",
    whenToEscalate:
      "Before any filing that locks you into a path.",
    likelyCauses: ["Multiple entries", "Unclear inspection"],
    evidenceSignals: ["No I-94", "Entered without visa"],
    nextSteps: [
      "Document every entry and exit you remember.",
      "Request records through lawful channels if needed.",
      "Seek accredited help immediately.",
    ],
    officialResourceLinks: resolveLinks(
      "unlawfulPresence",
      "inadmissibilityVol9",
      "findLegal",
    ),
    relatedSlugs: ["overstay-unlawful-presence", "visa-overstay-after-marriage"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "visa-overstay-after-marriage",
    title: "Visa overstay after marriage-based filing concern",
    summary:
      "Immediate-relative and other categories have different overstay forgiveness rules; verify your category.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-130", "I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "People mix tourist overstays with adjustment eligibility.",
    typicalMeaning:
      "Eligibility depends on relationship category, manner of entry, and other inadmissibility grounds.",
    whatUsuallyNext:
      "Legal review before or concurrent with filing decisions.",
    whatToPrepare:
      "Marriage certificate, I-94 history, prior petitions.",
    whenToWait:
      "Do not rely on forum posts for “automatic” forgiveness.",
    whenToEscalate:
      "Always for individualized legal advice before filing I-485.",
    likelyCauses: ["Category confusion", "Prior removal history"],
    evidenceSignals: ["Overstay + pending I-130/I-485"],
    nextSteps: [
      "Bring complete timeline to counsel.",
      "Read USCIS policy only as background.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal"),
    relatedSlugs: ["overstay-unlawful-presence"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "prior-removal-deportation-concern",
    title: "Prior removal / deportation / voluntary departure concern",
    summary:
      "Prior orders can trigger reinstatement, bars, or require special motions.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485", "I-130"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Past orders feel like a closed door to any future status.",
    typicalMeaning:
      "Some people have motions, reopening, or waivers; others do not. This is highly fact-specific.",
    whatUsuallyNext:
      "Obtain complete EOIR and DHS records with counsel.",
    whatToPrepare:
      "Any old order paperwork, A-numbers, departure evidence.",
    whenToWait:
      "Do not re-enter or file without understanding prior order effects.",
    whenToEscalate:
      "Immediate legal consult.",
    likelyCauses: ["In absentia order", "Voluntary departure breach"],
    evidenceSignals: ["Old deportation paperwork"],
    nextSteps: [
      "Request EOIR/DHS records.",
      "Avoid filing new forms that could trigger enforcement questions without strategy.",
      "Use Help Directory for experienced counsel.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal", "policyManual"),
    relatedSlugs: ["removal-proceedings", "prior-order-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "criminal-history-concern",
    title: "Criminal history concern",
    summary:
      "Criminal grounds of inadmissibility and deportability require legal analysis; USCIS organizes criminal inadmissibility in policy.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485", "I-130"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Any arrest feels disqualifying.",
    typicalMeaning:
      "Not every disposition counts the same; CIMT and other grounds depend on statute and sentence.",
    whatUsuallyNext:
      "Immigration counsel obtains certificates of disposition and analyzes immigration consequences.",
    whatToPrepare:
      "Court dockets, final dispositions, probation completion proof.",
    whenToWait:
      "Do not hide arrests on forms.",
    whenToEscalate:
      "Before filing or interview—always consult for any record.",
    likelyCauses: ["Old misdemeanors", "Domestic incidents"],
    evidenceSignals: ["Any arrest record"],
    nextSteps: [
      "Collect certified dispositions.",
      "Do not guess “expunged means invisible.”",
      "Use Help Directory for crimmigration experience.",
    ],
    officialResourceLinks: resolveLinks("criminalGrounds", "findLegal", "policyManual"),
    relatedSlugs: ["arrest-without-conviction-concern", "dui-drug-offense-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "arrest-without-conviction-concern",
    title: "Arrest without conviction concern",
    summary:
      "Arrests may still be relevant to admissibility and good moral character depending on facts.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Applicants hope dismissed charges disappear for immigration purposes.",
    typicalMeaning:
      "Forms ask about arrests; officers may review underlying conduct. Legal analysis determines what must be disclosed.",
    whatUsuallyNext:
      "Attorney aligns form answers with disposition records.",
    whatToPrepare:
      "Police reports (if obtainable), court disposition, expungement orders.",
    whenToWait:
      "Do not omit arrests based on non-conviction without advice.",
    whenToEscalate:
      "Legal consult before signing attested forms.",
    likelyCauses: ["Dismissals", "Diversion programs"],
    evidenceSignals: ["Old arrest record"],
    nextSteps: [
      "Gather final court outcome documents.",
      "Review form questions word-for-word with counsel.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("criminalGrounds", "findLegal"),
    relatedSlugs: ["criminal-history-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "dui-drug-offense-concern",
    title: "DUI / drug offense concern",
    summary:
      "Alcohol and controlled-substance offenses can trigger inadmissibility or good moral character issues.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "People fear automatic denial for DUI or marijuana-related state dispositions.",
    typicalMeaning:
      "Immigration law treats drug and alcohol offenses differently from state criminal labels; analysis is specialized.",
    whatUsuallyNext:
      "Crimmigration counsel reviews statutes and sentences.",
    whatToPrepare:
      "Certified convictions, treatment completion, police narrative if relevant.",
    whenToWait:
      "Disclose as instructed on forms after legal advice.",
    whenToEscalate:
      "Before filing or interview.",
    likelyCauses: ["Multiple DUIs", "Drug paraphernalia charges"],
    evidenceSignals: ["Controlled substance statute references"],
    nextSteps: [
      "Obtain certified court records.",
      "Avoid self-interpreting “simple misdemeanor.”",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("criminalGrounds", "findLegal"),
    relatedSlugs: ["criminal-history-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "fraud-misrepresentation-concern",
    title: "Fraud or misrepresentation concern",
    summary:
      "Material misrepresentation can create permanent inadmissibility waivable only in narrow circumstances.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485", "I-130"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Past wrong information on visas or forms creates deep fear.",
    typicalMeaning:
      "USCIS policy addresses fraud and willful misrepresentation inadmissibility; waivers are limited.",
    whatUsuallyNext:
      "Only counsel should assess materiality, timing, and waiver paths.",
    whatToPrepare:
      "Every prior DS-160, I-589, I-485, marriage records, employment letters referenced in filings.",
    whenToWait:
      "Do not file new corrections without strategy.",
    whenToEscalate:
      "Immediately if any prior false statement is possible.",
    likelyCauses: ["Wrong job title on visa", "Marital status errors"],
    evidenceSignals: ["NOID alleging fraud"],
    nextSteps: [
      "Stop public discussion of facts online.",
      "Collect complete file for attorney.",
      "Use Help Directory urgently.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal"),
    relatedSlugs: ["false-claim-citizenship-concern", "received-noid"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "false-claim-citizenship-concern",
    title: "False claim to U.S. citizenship concern",
    summary:
      "False claims can carry severe immigration consequences; analysis is strictly legal.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Checking wrong box or employer I-9 rumors create panic.",
    typicalMeaning:
      "Whether a false claim occurred and whether a narrow exception exists requires legal analysis.",
    whatUsuallyNext:
      "Attorney reviews every I-9, loan application, voter registration touchpoint.",
    whatToPrepare:
      "Copies of any government benefit or employment eligibility forms you signed.",
    whenToWait:
      "Do not assume harmless error.",
    whenToEscalate:
      "Immediate legal consult.",
    likelyCauses: ["Employer paperwork", "Benefit applications"],
    evidenceSignals: ["Worried about past checkbox"],
    nextSteps: [
      "Gather documents before speaking to anyone non-privileged.",
      "Seek experienced counsel.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal"),
    relatedSlugs: ["fraud-misrepresentation-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "prior-immigration-violation-concern",
    title: "Prior immigration violation concern",
    summary:
      "Prior visa violations, misrepresentation, or removals interact with current eligibility.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-485", "I-130"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Past mistakes feel disqualifying forever.",
    typicalMeaning:
      "Some violations have waivers; some do not; some are waived only for certain relatives.",
    whatUsuallyNext:
      "Full immigration history review with counsel.",
    whatToPrepare:
      "All prior petitions, denials, border notes, FOIA results.",
    whenToWait:
      "Do not file waivers without legal strategy.",
    whenToEscalate:
      "Before any new filing.",
    likelyCauses: ["Prior visa cancellations", "Misrepresentation findings"],
    evidenceSignals: ["Old denials in file"],
    nextSteps: [
      "Order A-file or relevant FOIA if advised.",
      "Map every U.S. entry.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal"),
    relatedSlugs: ["prior-removal-deportation-concern", "waiver-need-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "prior-denial-current-case",
    title: "Prior denial affecting current case",
    summary:
      "Earlier denials may influence discretion, credibility, or eligibility depending on reasons.",
    urgencyLevel: "high",
    triageLane: "legal",
    formsAffected: ["I-130", "I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Applicants fear the new case is doomed.",
    typicalMeaning:
      "USCIS may review prior decisions; strategies vary if facts changed or errors occurred.",
    whatUsuallyNext:
      "Counsel compares old denial grounds to current evidence.",
    whatToPrepare:
      "Complete prior denial notices, motions, appeals.",
    whenToWait:
      "If refiling, ensure new facts or law support the filing.",
    whenToEscalate:
      "Legal advice before refiling.",
    likelyCauses: ["Same relationship refiled", "Fraud finding"],
    evidenceSignals: ["Prior NOID/denial in packet"],
    nextSteps: [
      "Obtain certified copies of prior decisions.",
      "Document what changed since last filing.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("policyManual", "findLegal", "caseStatus"),
    relatedSlugs: ["received-denial", "fraud-misrepresentation-concern"],
  }),
  issue({
    categorySlug: "status-and-admissibility",
    slug: "waiver-need-concern",
    title: "Need for waiver concern",
    summary:
      "Waivers are form- and ground-specific; approval is discretionary and never guaranteed.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-601", "I-601A", "I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Families hear “waiver” as a magic fix.",
    typicalMeaning:
      "Each waiver has statutory prerequisites and extreme hardship or other standards; USCIS or consular stages differ.",
    whatUsuallyNext:
      "Counsel identifies applicable waiver, filing order, and evidence plan.",
    whatToPrepare:
      "Hardship documentation, qualifying relative proof, medical/psychological records if appropriate.",
    whenToWait:
      "Do not file I-601/A without understanding unlawful presence triggers and departure risk.",
    whenToEscalate:
      "Waiver strategy should be attorney-led.",
    likelyCauses: ["Unlawful presence", "Criminal grounds", "Misrepresentation"],
    evidenceSignals: ["Attorney mentions I-601 or I-601A"],
    nextSteps: [
      "Identify qualifying relatives if any.",
      "Avoid provisional waiver travel without legal advice.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("unlawfulPresence", "policyManual", "findLegal"),
    relatedSlugs: ["overstay-unlawful-presence", "criminal-history-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "removal-proceedings",
    title: "In removal proceedings",
    summary:
      "Immigration court is separate from USCIS case tracking; EOIR resources apply.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Court dates and DHS custody feel urgent and unfamiliar.",
    typicalMeaning:
      "Removal defense has different deadlines, judges, and forms than USCIS filings.",
    whatUsuallyNext:
      "Representation or careful self-prep per EOIR rules—most people benefit from counsel.",
    whatToPrepare:
      "NTA, hearing notices, prior orders, bond paperwork if any.",
    whenToWait:
      "Never miss a hearing while waiting for USCIS.",
    whenToEscalate:
      "Immediately retain removal defense counsel or accredited representative.",
    likelyCauses: ["NTA filed", "Referral from USCIS"],
    evidenceSignals: ["EOIR portal shows case"],
    nextSteps: [
      "Confirm next hearing date on EOIR systems.",
      "Notify court of address changes.",
      "Use Help Directory for court-experienced help.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal", "caseStatus"),
    relatedSlugs: ["immigration-court-hearing-confusion", "ice-nta-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "immigration-court-hearing-confusion",
    title: "Immigration court hearing confusion",
    summary:
      "Hearing types and continuances follow court rules; missing a hearing has severe consequences.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: [],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Multiple notices and virtual appearances create confusion.",
    typicalMeaning:
      "Each hearing notice states time, place (or link), and purpose; EOIR publishes guidance.",
    whatUsuallyNext:
      "Prepare evidence bundles per judge standing orders with counsel.",
    whatToPrepare:
      "All notices, identity documents, interpreter needs.",
    whenToWait:
      "Do not skip hearings expecting USCIS to “fix it.”",
    whenToEscalate:
      "If you missed a hearing, emergency legal consult for motion options.",
    likelyCauses: ["Rescheduling backlog", "Mail delays"],
    evidenceSignals: ["Conflicting hearing dates"],
    nextSteps: [
      "Call EOIR hotline or check online portal as directed.",
      "Send change-of-address to court immediately if you move.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal"),
    relatedSlugs: ["removal-proceedings", "missed-hearing-notice-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "ice-nta-concern",
    title: "ICE / NTA concern",
    summary:
      "Enforcement encounters and NTAs require immediate legal orientation; do not rely on apps for strategy.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: [],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Fear of detention and fast deportation.",
    typicalMeaning:
      "A Notice to Appear starts court proceedings; ICE custody may involve bond hearings.",
    whatUsuallyNext:
      "Contact counsel or legal aid immediately; know your hearing dates.",
    whatToPrepare:
      "Any paperwork given at encounter, family contact list, prior A-number.",
    whenToWait:
      "Do not delay finding representation if detained or served.",
    whenToEscalate:
      "Immediately.",
    likelyCauses: ["Prior removal order", "Criminal arrest"],
    evidenceSignals: ["ICE visit", "NTA in hand"],
    nextSteps: [
      "Write down officer names and locations if safe to do so.",
      "Contact family to arrange counsel.",
      "Use Help Directory for emergency contacts.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal"),
    relatedSlugs: ["removal-proceedings", "detention-enforcement-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "missed-hearing-notice-concern",
    title: "Missed hearing or notice concern",
    summary:
      "In absentia orders can result from missed hearings; motions to reopen are limited.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: [],
    lawyerRecommended: true,
    whyPeopleWorry:
      "People discover an old order years later.",
    typicalMeaning:
      "You may need a motion to reopen or other relief; deadlines and standards are strict.",
    whatUsuallyNext:
      "Emergency consult with removal defense counsel.",
    whatToPrepare:
      "Any proof of non-receipt, change-of-address evidence, medical emergencies.",
    whenToWait:
      "Do not assume the order is irrelevant.",
    whenToEscalate:
      "Immediately.",
    likelyCauses: ["Mail failure", "Moved without updating court"],
    evidenceSignals: ["Order of removal in absentia"],
    nextSteps: [
      "Obtain complete court docket.",
      "Gather proof of why you missed court if applicable.",
      "Use Help Directory urgently.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal"),
    relatedSlugs: ["immigration-court-hearing-confusion", "prior-order-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "detention-enforcement-concern",
    title: "Detention or enforcement concern",
    summary:
      "Custody and ICE enforcement raise constitutional and procedural issues requiring counsel.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: [],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Family separation and unknown location of detainees.",
    typicalMeaning:
      "Locators and hotlines exist, but legal strategy belongs to professionals.",
    whatUsuallyNext:
      "Family members should locate the person if possible, then engage counsel experienced in detention and bond.",
    whatToPrepare:
      "Full name, A-number, country of birth, location last known.",
    whenToWait:
      "Begin calling qualified help immediately.",
    whenToEscalate:
      "Always treat as urgent.",
    likelyCauses: ["ICE holds", "Criminal custody"],
    evidenceSignals: ["Detained loved one"],
    nextSteps: [
      "Use official ICE detainee locator if appropriate.",
      "Contact immigration attorneys experienced in detention.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("findLegal", "eoir"),
    relatedSlugs: ["ice-nta-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "prior-order-concern",
    title: "Prior order concern",
    summary:
      "Old removal or voluntary departure orders may still be active until terminated or reopened.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-485"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Travel or new filings may trigger enforcement.",
    typicalMeaning:
      "Reinstatement of removal and other provisions may apply; only records review can clarify.",
    whatUsuallyNext:
      "Attorney obtains EOIR/DHS records and analyzes options.",
    whatToPrepare:
      "Any old paperwork, FOIA results.",
    whenToWait:
      "Do not travel internationally without advice.",
    whenToEscalate:
      "Before any USCIS filing or border crossing.",
    likelyCauses: ["Old in absentia order", "Voluntary departure violation"],
    evidenceSignals: ["Uncertain if order exists"],
    nextSteps: [
      "Request full immigration court history.",
      "Avoid self-help filings that could trigger review.",
      "Use Help Directory.",
    ],
    officialResourceLinks: resolveLinks("eoir", "findLegal", "policyManual"),
    relatedSlugs: ["prior-removal-deportation-concern", "missed-hearing-notice-concern"],
  }),
  issue({
    categorySlug: "court-enforcement-legal",
    slug: "urgent-legal-review-needed",
    title: "Need urgent legal review",
    summary:
      "When deadlines, court, or serious inadmissibility intersect, prioritize authorized representatives.",
    urgencyLevel: "critical",
    triageLane: "legal",
    formsAffected: ["I-130", "I-485", "I-765", "I-131"],
    lawyerRecommended: true,
    whyPeopleWorry:
      "Users feel time pressure and want instant answers.",
    typicalMeaning:
      "QueueTip organizes guidance; it cannot triage legal emergencies or replace counsel.",
    whatUsuallyNext:
      "Contact an attorney or DOJ-accredited representative today; bring your documents.",
    whatToPrepare:
      "Every notice, receipt, passport, and court paper.",
    whenToWait:
      "Do not wait on app messaging for court dates or ICE contact.",
    whenToEscalate:
      "You are already in the escalation zone—use Help Directory now.",
    likelyCauses: ["Stacked risks"],
    evidenceSignals: ["Multiple red flags at once"],
    nextSteps: [
      "Open Help Directory and filter for your geography and needs.",
      "Write a one-page timeline before your consult.",
      "Avoid signing blank forms or paying non-attorney notarios for legal advice.",
    ],
    officialResourceLinks: resolveLinks("findLegal", "eoir", "caseStatus"),
    relatedSlugs: ["received-denial", "removal-proceedings"],
  }),
];
