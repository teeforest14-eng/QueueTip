"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { OnboardingJourneyState } from "@prisma/client";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const journeyOptions: Array<{
  value: OnboardingJourneyState;
  label: string;
}> = [
  { value: "PREPARING_TO_FILE", label: "Preparing to file" },
  { value: "ALREADY_FILED", label: "Already filed" },
  { value: "RFE_OR_ISSUE", label: "Received an RFE or issue" },
  { value: "WAITING_TOO_LONG", label: "Waiting too long" },
  { value: "JUST_EXPLORING", label: "Just exploring" },
];

const formOptions = ["I-130", "I-485", "I-765", "I-131"];

export function OnboardingWizard({ initialStep }: { initialStep: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const intent = params.get("intent");
  const [step, setStep] = useState(initialStep);
  const [journeyCategory, setJourneyCategory] =
    useState<OnboardingJourneyState | null>(
      intent === "track"
        ? "ALREADY_FILED"
        : intent === "prepare"
          ? "PREPARING_TO_FILE"
          : intent === "resolve"
            ? "RFE_OR_ISSUE"
            : intent === "explore"
              ? "JUST_EXPLORING"
              : null,
    );
  const [familyCaseType, setFamilyCaseType] = useState("");
  const [alreadyFiled, setAlreadyFiled] = useState<boolean | null>(null);
  const [formsInvolved, setFormsInvolved] = useState<string[]>([]);
  const [hasReceipt, setHasReceipt] = useState<boolean | null>(null);
  const [currentConcern, setCurrentConcern] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [countryRegion, setCountryRegion] = useState("");
  const [needsReminders, setNeedsReminders] = useState(true);
  const [interestedLocalHelp, setInterestedLocalHelp] = useState(false);
  const [saving, setSaving] = useState(false);

  const persist = useCallback(
    async (payload: Record<string, unknown>) => {
      setSaving(true);
      await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaving(false);
    },
    [],
  );

  async function goNext() {
    const next = step + 1;
    await persist({
      lastStep: next,
      journeyCategory: journeyCategory ?? undefined,
      familyCaseType: familyCaseType || null,
      alreadyFiled,
      formsInvolved,
      hasReceipt,
      currentConcern: currentConcern || null,
      preferredLanguage,
      countryRegion: countryRegion || null,
      needsReminders,
      interestedLocalHelp,
    });
    setStep(next);
  }

  async function goBack() {
    const prev = Math.max(0, step - 1);
    await persist({ lastStep: prev });
    setStep(prev);
  }

  async function finish() {
    await persist({
      lastStep: step,
      journeyCategory: journeyCategory ?? undefined,
      familyCaseType: familyCaseType || null,
      alreadyFiled,
      formsInvolved,
      hasReceipt,
      currentConcern: currentConcern || null,
      preferredLanguage,
      countryRegion: countryRegion || null,
      needsReminders,
      interestedLocalHelp,
      completed: true,
    });
    router.push("/app/dashboard");
    router.refresh();
  }

  async function skip() {
    await persist({ skipped: true, completed: false, lastStep: step });
    router.push("/app/dashboard");
    router.refresh();
  }

  const totalSteps = 4;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-qt-text-secondary">
          Step {Math.min(step + 1, totalSteps)} of {totalSteps}
        </p>
        <div className="h-2 flex-1 max-w-xs rounded-full bg-qt-soft-gray">
          <div
            className="h-2 rounded-full bg-qt-primary transition-all"
            style={{
              width: `${((Math.min(step, totalSteps - 1) + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      {step === 0 && (
        <Card>
          <CardTitle>Where are you in your journey?</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Short answers help us open the right workspace first.
          </p>
          <div className="mt-4 space-y-2">
            {journeyOptions.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-qt-soft-gray bg-white px-3 py-2 hover:bg-qt-mist"
              >
                <input
                  type="radio"
                  name="journey"
                  checked={journeyCategory === o.value}
                  onChange={() => setJourneyCategory(o.value)}
                />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <Label htmlFor="family">Family-based case type (optional)</Label>
            <Input
              id="family"
              className="mt-1"
              placeholder="e.g. spouse adjustment, parent petition"
              value={familyCaseType}
              onChange={(e) => setFamilyCaseType(e.target.value)}
            />
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardTitle>Filing status</CardTitle>
          <p className="mt-2 text-sm text-qt-text-secondary">
            If you already filed, we can emphasize receipts and timelines.
          </p>
          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={alreadyFiled === true}
                onChange={() => setAlreadyFiled(true)}
              />
              Already filed
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={alreadyFiled === false}
                onChange={() => setAlreadyFiled(false)}
              />
              Not filed yet
            </label>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-qt-text">Forms involved</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {formOptions.map((f) => (
                <label key={f} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formsInvolved.includes(f)}
                    onChange={() =>
                      setFormsInvolved((prev) =>
                        prev.includes(f)
                          ? prev.filter((x) => x !== f)
                          : [...prev, f],
                      )
                    }
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={hasReceipt === true}
                onChange={() => setHasReceipt(true)}
              />
              I have at least one receipt number
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={hasReceipt === false}
                onChange={() => setHasReceipt(false)}
              />
              Not yet
            </label>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardTitle>What is on your mind?</CardTitle>
          <Label htmlFor="concern" className="mt-4 block">
            Current concern (optional)
          </Label>
          <textarea
            id="concern"
            className="mt-1 min-h-[120px] w-full rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm"
            placeholder="e.g. worried about biometrics, long silence after RFE response…"
            value={currentConcern}
            onChange={(e) => setCurrentConcern(e.target.value)}
          />
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardTitle>Preferences</CardTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="lang">Preferred language (V1: English UI)</Label>
              <Input
                id="lang"
                className="mt-1"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="region">Country / region (optional)</Label>
              <Input
                id="region"
                className="mt-1"
                value={countryRegion}
                onChange={(e) => setCountryRegion(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={needsReminders}
                onChange={(e) => setNeedsReminders(e.target.checked)}
              />
              Email reminders for saved tasks (when email delivery is on)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={interestedLocalHelp}
                onChange={(e) => setInterestedLocalHelp(e.target.checked)}
              />
              Show local help resources when available
            </label>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={skip}
          disabled={saving}
          className="qt-cta-line inline-flex items-center border-0 bg-transparent py-1 text-sm font-semibold tracking-tight text-qt-text-secondary transition-colors hover:text-qt-text disabled:pointer-events-none disabled:opacity-50"
        >
          Skip for now
        </button>
        <div className="flex flex-wrap items-center gap-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={saving}
              className="qt-cta-line inline-flex items-center border-0 bg-transparent py-1 text-sm font-semibold tracking-tight text-qt-text transition-colors hover:text-qt-slate disabled:pointer-events-none disabled:opacity-50"
            >
              Back
            </button>
          ) : null}
          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={saving}
              className="qt-cta-line inline-flex items-center border-0 bg-transparent py-1 text-sm font-semibold tracking-tight text-qt-text transition-colors hover:text-qt-slate disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={saving}
              className="qt-cta-line inline-flex items-center border-0 bg-transparent py-1 text-sm font-semibold tracking-tight text-qt-text transition-colors hover:text-qt-slate disabled:pointer-events-none disabled:opacity-50"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
