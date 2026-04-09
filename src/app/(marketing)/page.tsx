import { SectionHeader } from "@/components/marketing/section-header";
import { MarketingSecondaryLink } from "@/components/marketing/marketing-buttons";
import { PathCard } from "@/components/marketing/path-card";
import { TrustComparisonPremium } from "@/components/marketing/trust-comparison-premium";
import { WorkflowSteps } from "@/components/marketing/workflow-steps";
import { PricingShowcase } from "@/components/marketing/pricing-showcase";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { LANDING_FAQS } from "@/components/marketing/landing-faqs";
import { HeroSection } from "@/components/marketing/hero-section";
import { ScrollReveal, ScrollRevealStagger } from "@/components/marketing/scroll-reveal";
import { MinimalCTA } from "@/components/marketing/minimal-cta";
import { SupportDirectoryPreview } from "@/components/marketing/support-directory-preview";
import { PremiumBullets } from "@/components/marketing/premium-bullets";

const paths = [
  {
    title: "Prepare",
    who: "Families assembling a filing package.",
    body: "Checklists for I-130, I-485, I-765, and I-131 help you catch missing items, current requirements, and common RFE triggers before you file.",
    reduces: "\u201cDid we miss anything before we submit?\u201d",
    href: "/signup?intent=prepare",
  },
  {
    title: "Track",
    who: "Families waiting for the next milestone.",
    body: "Receipts, milestones, and status updates are kept in one place, with official records clearly separated from what usually happens next.",
    reduces: "constant portal checking and not knowing what changed.",
    href: "/signup?intent=track",
  },
  {
    title: "Resolve",
    who: "Cases that feel stuck, delayed, or unclear.",
    body: "For RFEs, long silences, biometrics delays, and similar problems, QueueTip shows what to check next and when it makes sense to escalate.",
    reduces: "\u201cIs this still normal, or do we need to do something?\u201d",
    href: "/signup?intent=resolve",
  },
  {
    title: "Explore",
    who: "Anyone mapping the journey before filing.",
    body: "Learn how the family-based process fits together before filing, then move into the right path when you are ready.",
    reduces: "starting from zero and not knowing where to begin.",
    href: "/signup?intent=explore",
  },
];

const faqItems = LANDING_FAQS.map((f) => ({ q: f.q, a: f.a }));

export default function LandingPage() {
  return (
    <main className="bg-qt-mist">
      <HeroSection />

      <section className="border-b border-qt-soft-gray bg-white py-12 sm:py-16 lg:py-18">
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
                Real pain points
              </p>
              <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.08] tracking-tight text-qt-text">
                Built for the points where a case starts to feel uncertain, delayed, or hard to trust.
              </h2>
            </div>
            <div className="rounded-2xl border border-qt-soft-gray bg-qt-mist/35 p-4 sm:p-5 lg:col-span-5">
              <ul className="space-y-3 text-sm text-qt-text-secondary">
                {[
                  "You got a status update and do not know whether to wait or act.",
                  "Months have passed and nothing seems to be moving.",
                  "You are not sure which documents you still need.",
                  "You are tired of guessing based on forums and secondhand advice.",
                ].map((line) => (
                  <li key={line} className="border-b border-qt-soft-gray pb-3 last:border-0 last:pb-0">
                    {line}
                  </li>
                ))}
              </ul>
              <MinimalCTA href="/signup" className="mt-5 text-sm">
                Start with your case stage
              </MinimalCTA>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section
        id="trust-layer"
        className="scroll-mt-28 border-b border-qt-soft-gray bg-qt-trust-section py-20 sm:py-30 lg:py-40"
      >
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How QueueTip works"
            title="Three clear layers. Never mixed together."
            description="QueueTip keeps official USCIS information, typical case patterns, and next steps clearly separate so you do not confuse guidance with a government record."
          />
          <div className="mt-14 sm:mt-18 lg:mt-20">
            <TrustComparisonPremium />
          </div>
        </ScrollReveal>
      </section>

      <section
        id="paths"
        className="scroll-mt-28 border-b border-qt-soft-gray bg-qt-mist/40 py-16 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Product"
              title="Start where you are. Stay oriented as your case moves."
              description="QueueTip routes you into the right view now, then keeps your case organized as things change."
            />
          </ScrollReveal>
          <ScrollRevealStagger
            className="mt-14 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] md:mt-18 lg:mt-20 lg:gap-7"
            staggerMs={75}
          >
            {paths.map((p) => (
              <PathCard key={p.title} {...p} />
            ))}
          </ScrollRevealStagger>
        </div>
      </section>

      <section
        id="boundaries"
        className="scroll-mt-28 border-b border-qt-soft-gray bg-white py-18 sm:py-26 lg:py-36"
      >
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Boundaries"
            title="Clear limits, stated plainly"
            description="Clear boundaries are part of what makes this product trustworthy."
          />
          <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6 lg:mt-20 lg:gap-7">
            {[
              {
                t: "Official sources first",
                d: "QueueTip links to USCIS tools and instructions wherever you need to verify status, timing, or filing requirements.",
              },
              {
                t: "Interpretation stays labeled",
                d: "Guidance is clearly marked so you can tell the difference between official information and what usually happens.",
              },
              {
                t: "Not a substitute for counsel",
                d: "QueueTip helps you stay organized and informed. Legal strategy and representation still belong to qualified professionals.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="qt-motion-hover rounded-2xl border border-qt-soft-gray bg-qt-mist/30 p-6 sm:p-7 lg:p-9"
              >
                <h3 className="font-display text-xl font-normal text-qt-text">{x.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-qt-text-secondary">{x.d}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="border-b border-qt-soft-gray bg-qt-warm-cream py-14 sm:py-20 lg:py-24">
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="font-display text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02] tracking-tight text-qt-text lg:col-span-8">
              QueueTip keeps official information, typical case patterns, and next-step guidance clearly separate.
            </p>
            <div className="space-y-2 rounded-2xl border border-qt-soft-gray bg-white/70 p-4 sm:p-5 lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
                Core rule
              </p>
              <p className="text-3xl font-semibold text-qt-text">3 clear layers</p>
              <p className="text-sm leading-relaxed text-qt-text-secondary">
                Official source, typical interpretation, and suggested next step.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="border-b border-qt-soft-gray bg-qt-mist/30 py-14 sm:py-20 lg:py-28">
        <ScrollReveal className="mx-auto grid max-w-6xl gap-5 px-4 sm:gap-7 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div className="rounded-2xl border border-qt-soft-gray bg-white p-7 sm:p-8 lg:p-10 shadow-[0_1px_0_rgba(17,17,17,0.03)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
              Fit
            </p>
            <h3 className="mt-3 font-display text-2xl font-normal text-qt-text">
              Who QueueTip is for
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-qt-text-secondary">
              Families handling common USCIS forms and case events who want structure, plain language,
              and official sources within reach.
            </p>
          </div>
          <div className="rounded-2xl border border-qt-soft-gray bg-white p-7 sm:p-8 lg:p-10 shadow-[0_1px_0_rgba(17,17,17,0.03)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
              Out of scope
            </p>
            <h3 className="mt-3 font-display text-2xl font-normal text-qt-text">
              Who it is not for
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-qt-text-secondary">
              Removal defense, detention, asylum adjudication, and litigation-heavy matters require
              qualified counsel—not a guidance product.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-28 border-b border-qt-soft-gray bg-qt-warm-cream py-20 sm:py-30 lg:py-40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeader
              align="center"
              eyebrow="Workflow"
              title="How it works"
              description="Create your account, answer a short intake, and QueueTip puts you in the right place to start."
            />
          </ScrollReveal>
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <WorkflowSteps />
          </div>
        </div>
      </section>

      <section className="border-b border-qt-soft-gray bg-white py-16 sm:py-24 lg:py-34">
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <SectionHeader
              align="center"
              eyebrow="Support"
              title="Help directory"
              description="When your case needs more than guidance, QueueTip helps you find the right kind of qualified help."
            />
            <div className="mt-10 w-full">
              <SupportDirectoryPreview />
            </div>
            <MarketingSecondaryLink href="/signup" className="mt-10 mx-auto">
              Open the help directory
            </MarketingSecondaryLink>
          </div>
        </ScrollReveal>
      </section>

      <section className="border-b border-qt-soft-gray bg-qt-mist/55 py-14 sm:py-20 lg:py-28">
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
                Premium depth
              </p>
              <p className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.03] tracking-tight text-qt-text">
                Premium for active cases
              </p>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-qt-text-secondary sm:text-base">
                When your case is moving, Premium gives you more complete history, stronger follow-up
                prompts, and more guidance around delays, changes, and next checks.
              </p>
            </div>
            <div className="rounded-2xl border border-qt-slate/25 bg-white p-4 sm:p-5 shadow-[0_16px_44px_-30px_rgba(111,143,175,0.38)] lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
                Included in Premium
              </p>
              <PremiumBullets />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="border-b border-qt-soft-gray bg-white py-18 sm:py-26 lg:py-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <SectionHeader
                className="lg:col-span-8 lg:max-w-xl"
                eyebrow="Pricing"
                title="Straightforward plans"
                description="Free gives you real value. Premium gives active cases more tracking, follow-through, and issue guidance."
              />
              <div className="rounded-2xl border border-qt-soft-gray bg-qt-mist/40 p-4 sm:p-5 lg:col-span-4 lg:justify-self-end">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
                  Best for active cases
                </p>
                <p className="mt-2 text-3xl font-semibold text-qt-text">$10/mo</p>
                <MinimalCTA href="/pricing" className="mt-3 text-sm">
                  Full comparison
                </MinimalCTA>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal className="mt-14 sm:mt-16 lg:mt-20" delayMs={80}>
            <PricingShowcase />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-qt-mist/30 py-16 sm:py-24 lg:py-32">
        <ScrollReveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Direct answers about what QueueTip does, where its information comes from, and when to get legal help."
          />
          <div className="mt-10 sm:mt-12 lg:mt-14">
            <FaqAccordion items={faqItems} />
          </div>
          <MinimalCTA href="/faq" className="mt-12 inline-flex text-sm">
            See all FAQ answers
          </MinimalCTA>
        </ScrollReveal>
      </section>
    </main>
  );
}
