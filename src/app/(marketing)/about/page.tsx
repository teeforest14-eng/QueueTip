import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-qt-text sm:text-4xl">
        About QueueTip
      </h1>
      <p className="mt-5 text-base leading-relaxed text-qt-text-secondary">
        QueueTip is software for family-based immigration workflows. It combines
        structured guidance, labeled interpretation, case organization, and
        shortcuts to USCIS and other official resources—so families spend less
        time reconstructing the process from scattered posts and PDFs.
      </p>
      <h2 id="disclaimer" className="mt-14 text-xl font-semibold text-qt-text">
        Disclaimer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
        QueueTip is not a law firm. Nothing on this site or in the product is
        legal advice. Government requirements change; always verify with USCIS
        and qualified professionals. We do not guarantee timelines, approvals,
        or any outcome.
      </p>
      <h2 id="privacy" className="mt-14 text-xl font-semibold text-qt-text">
        Privacy overview
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
        QueueTip stores the information you provide to operate your account:
        profile and onboarding answers, cases and receipts you enter,
        checklist progress, notification preferences, and similar app data.
        Before you serve real users at scale, publish a full privacy policy that
        describes what you collect, how long you retain it, subprocessors,
        international transfers (if any), and how people can exercise their
        rights under applicable law.
      </p>
      <h2 id="terms" className="mt-14 text-xl font-semibold text-qt-text">
        Terms overview
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
        Terms of use should cover acceptable use, disclaimers, limitation of
        liability appropriate to informational software, account termination, and
        governing law. Have counsel review before production launch—especially
        for a high-stakes category like immigration.
      </p>
    </div>
  );
}
