"use client";

import type { ReactNode } from "react";
import type { AppPath, OnboardingJourneyState } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TrackSurface } from "@/components/app/track/track-surface";
import { PushSettingsSection } from "@/components/app/settings/push-settings-section";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import { getSignupCountries } from "@/lib/signup-countries";

const surface =
  "rounded-[14px] border border-white/90 bg-white/98 shadow-[0_4px_32px_rgba(0,50,24,0.07)]";

const LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish (UI still English)" },
  { value: "zh", label: "Chinese (UI still English)" },
];

const journeyOptions: { value: OnboardingJourneyState; label: string }[] = [
  { value: "PREPARING_TO_FILE", label: "Preparing to file" },
  { value: "ALREADY_FILED", label: "Already filed" },
  { value: "RFE_OR_ISSUE", label: "Received an RFE or issue" },
  { value: "WAITING_TOO_LONG", label: "Waiting too long" },
  { value: "JUST_EXPLORING", label: "Just exploring" },
];

const formOptions = ["I-130", "I-485", "I-765", "I-131"];

const pathLabels: Record<AppPath, string> = {
  PREPARE: "Prepare",
  TRACK: "Track",
  RESOLVE: "Resolve",
  EXPLORE: "Explore",
};

type ProfileState = {
  displayName: string;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  countryRegion: string;
  needsReminders: boolean;
  interestedLocalHelp: boolean;
};

type NotifState = {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  statusChanges: boolean;
  delayThresholds: boolean;
};

export type OnboardingClientState = {
  journeyCategory: OnboardingJourneyState | null;
  familyCaseType: string;
  alreadyFiled: boolean | null;
  formsInvolved: string[];
  hasReceipt: boolean | null;
  currentConcern: string;
  routedPath: AppPath | null;
  completed: boolean;
  skipped: boolean;
};

type Props = {
  email: string;
  createdAtIso: string;
  hasOAuth: boolean;
  oauthProviders: string[];
  emailDeliveryConfigured: boolean;
  profile: ProfileState;
  notifPrefs: NotifState;
  onboarding: OnboardingClientState | null;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
    >
      {children}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  type = "text",
  autoComplete,
  disabled,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-qt-support/25 placeholder:text-neutral-400 focus:border-qt-slate/35 focus:ring-2 disabled:bg-neutral-50"
    />
  );
}

export function SettingsPageClient({
  email,
  createdAtIso,
  hasOAuth,
  oauthProviders,
  emailDeliveryConfigured,
  profile: initialProfile,
  notifPrefs: initialNotif,
  onboarding: initialOnb,
}: Props) {
  const router = useRouter();
  const countries = useMemo(() => getSignupCountries(), []);

  const [profile, setProfile] = useState(initialProfile);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [n, setN] = useState(initialNotif);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  const [onb, setOnb] = useState<OnboardingClientState | null>(initialOnb);
  const [onbMsg, setOnbMsg] = useState<string | null>(null);
  const [onbLoading, setOnbLoading] = useState(false);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<Record<string, string[]> | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    setProfileErr(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setProfileLoading(false);
    if (!res.ok) {
      setProfileErr("Could not save profile.");
      return;
    }
    setProfileMsg("Profile saved.");
    router.refresh();
  }

  async function saveNotifs(e: React.FormEvent) {
    e.preventDefault();
    setNotifLoading(true);
    setNotifMsg(null);
    const res = await fetch("/api/notification-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n),
    });
    setNotifLoading(false);
    setNotifMsg(
      res.ok ? "Notification preferences saved." : "Could not save preferences.",
    );
    if (res.ok) router.refresh();
  }

  async function patchNotifs(patch: Partial<NotifState>) {
    const next = { ...n, ...patch };
    const res = await fetch("/api/notification-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (res.ok) {
      setN(next);
      router.refresh();
    }
  }

  async function saveOnboarding(e: React.FormEvent) {
    e.preventDefault();
    if (!onb) return;
    setOnbLoading(true);
    setOnbMsg(null);
    const res = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        journeyCategory: onb.journeyCategory ?? undefined,
        familyCaseType: onb.familyCaseType || null,
        alreadyFiled: onb.alreadyFiled,
        formsInvolved: onb.formsInvolved,
        hasReceipt: onb.hasReceipt,
        currentConcern: onb.currentConcern || null,
      }),
    });
    setOnbLoading(false);
    if (!res.ok) {
      setOnbMsg("Could not save journey preferences.");
      return;
    }
    const data = (await res.json()) as {
      onboarding?: { routedPath?: AppPath | null };
    };
    if (data.onboarding?.routedPath !== undefined) {
      setOnb((prev) =>
        prev
          ? { ...prev, routedPath: data.onboarding?.routedPath ?? prev.routedPath }
          : prev,
      );
    }
    setOnbMsg("Journey preferences saved. Routed workspace may update on your next visit.");
    router.refresh();
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);
    if (pwNew !== pwConfirm) {
      setPwErr({ confirmPassword: ["New passwords do not match"] });
      return;
    }
    if (pwNew.length < 8) {
      setPwErr({ newPassword: ["Use at least 8 characters"] });
      return;
    }
    setPwLoading(true);
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: pwCurrent,
        newPassword: pwNew,
        confirmPassword: pwConfirm,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: Record<string, string[]> | string;
    };
    setPwLoading(false);
    if (!res.ok) {
      if (typeof data.error === "object" && data.error) {
        setPwErr(data.error as Record<string, string[]>);
      } else {
        setPwErr({
          _form: [
            typeof data.error === "string" ? data.error : "Could not update password.",
          ],
        });
      }
      return;
    }
    setPwMsg("Password updated.");
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-qt-support/30";

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-12">
      <TrackSurface className={cn(surface, "p-8 sm:p-10")}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-qt-slate">
          Control center
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
          Settings
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600">
          Manage how QueueTip addresses you, how you hear about case movement,
          and how the app reaches your devices. Case facts still come from what
          you sync and official USCIS tools—not from your display name.
        </p>
      </TrackSurface>

      {/* Account */}
      <TrackSurface className={cn(surface, "p-6 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">Account</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-neutral-500">Email</dt>
            <dd className="mt-0.5 text-neutral-900">{email}</dd>
            <p className="mt-1 text-xs text-neutral-500">
              Email sign-in is fixed to this address. Contact support to change
              it in production.
            </p>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Member since</dt>
            <dd className="mt-0.5 text-neutral-900">
              {new Date(createdAtIso).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Sign-in</dt>
            <dd className="mt-0.5 text-neutral-900">
              {hasOAuth
                ? `OAuth: ${oauthProviders.join(", ") || "linked provider"} · password may also be set`
                : "Email and password"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-500">Account status</dt>
            <dd className="mt-0.5 text-neutral-900">Active</dd>
          </div>
        </dl>

        {!hasOAuth ? (
          <form onSubmit={submitPassword} className="mt-8 border-t border-neutral-100 pt-8">
            <h3 className="text-sm font-semibold text-neutral-900">
              Update password
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Use your current password, then choose a new one (at least 8
              characters).
            </p>
            <div className="mt-4 grid gap-4 sm:max-w-md">
              <div>
                <FieldLabel htmlFor="pw-current">Current password</FieldLabel>
                <input
                  id="pw-current"
                  type="password"
                  autoComplete="current-password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  className={inputClass}
                />
                {pwErr?.currentPassword?.[0] ? (
                  <p className="mt-1 text-xs text-red-600">
                    {pwErr.currentPassword[0]}
                  </p>
                ) : null}
              </div>
              <div>
                <FieldLabel htmlFor="pw-new">New password</FieldLabel>
                <input
                  id="pw-new"
                  type="password"
                  autoComplete="new-password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  className={inputClass}
                />
                {pwErr?.newPassword?.[0] ? (
                  <p className="mt-1 text-xs text-red-600">
                    {pwErr.newPassword[0]}
                  </p>
                ) : null}
              </div>
              <div>
                <FieldLabel htmlFor="pw-confirm">Confirm new password</FieldLabel>
                <input
                  id="pw-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  className={inputClass}
                />
                {pwErr?.confirmPassword?.[0] ? (
                  <p className="mt-1 text-xs text-red-600">
                    {pwErr.confirmPassword[0]}
                  </p>
                ) : null}
              </div>
            </div>
            {pwErr?._form?.[0] ? (
              <p className="mt-2 text-sm text-red-600">{pwErr._form[0]}</p>
            ) : null}
            {pwMsg ? (
              <p className="mt-3 text-sm text-emerald-800">{pwMsg}</p>
            ) : null}
            <button
              type="submit"
              disabled={pwLoading}
              className={cn(
                appPrimaryCtaClassWide,
                "mt-4 disabled:opacity-45",
              )}
            >
              {pwLoading ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : (
          <p className="mt-6 border-t border-neutral-100 pt-6 text-sm text-neutral-600">
            You signed in with a linked provider. Manage your password there, or
            add a QueueTip password by signing out and using forgot-password with
            this email if your account supports it.
          </p>
        )}
      </TrackSurface>

      {/* Profile */}
      <TrackSurface className={cn(surface, "p-6 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Matches what you set at signup and onboarding. Display name is only
          for QueueTip—it is not sent to USCIS.
        </p>
        <form onSubmit={saveProfile} className="mt-6 space-y-5">
          {profileErr ? (
            <p className="text-sm text-red-600">{profileErr}</p>
          ) : null}
          {profileMsg ? (
            <p className="text-sm text-emerald-800">{profileMsg}</p>
          ) : null}
          <div>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <TextInput
              id="displayName"
              value={profile.displayName}
              onChange={(v) => setProfile({ ...profile, displayName: v })}
              autoComplete="nickname"
              placeholder="How you want to be addressed"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="firstName">Preferred first name</FieldLabel>
              <TextInput
                id="firstName"
                value={profile.firstName}
                onChange={(v) => setProfile({ ...profile, firstName: v })}
                autoComplete="given-name"
              />
            </div>
            <div>
              <FieldLabel htmlFor="lastName">Preferred last name</FieldLabel>
              <TextInput
                id="lastName"
                value={profile.lastName}
                onChange={(v) => setProfile({ ...profile, lastName: v })}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="lang">Preferred language</FieldLabel>
            <select
              id="lang"
              value={profile.preferredLanguage}
              onChange={(e) =>
                setProfile({ ...profile, preferredLanguage: e.target.value })
              }
              className={inputClass}
            >
              {LANG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="country">Country / region</FieldLabel>
            <select
              id="country"
              value={profile.countryRegion || ""}
              onChange={(e) =>
                setProfile({ ...profile, countryRegion: e.target.value })
              }
              className={inputClass}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              Same ISO list as signup (stored as your country code).
            </p>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300 text-qt-slate"
              checked={profile.needsReminders}
              onChange={(e) =>
                setProfile({ ...profile, needsReminders: e.target.checked })
              }
            />
            <span>
              Open to reminders for saved tasks when reminder features are
              available
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300 text-qt-slate"
              checked={profile.interestedLocalHelp}
              onChange={(e) =>
                setProfile({ ...profile, interestedLocalHelp: e.target.checked })
              }
            />
            <span>Show local help resources when QueueTip lists them</span>
          </label>
          <button
            type="submit"
            disabled={profileLoading}
            className={cn(appPrimaryCtaClassWide, "disabled:opacity-45")}
          >
            {profileLoading ? "Saving…" : "Save profile"}
          </button>
        </form>
      </TrackSurface>

      {/* Onboarding / journey */}
      {onb ? (
        <TrackSurface className={cn(surface, "p-6 sm:p-8")}>
          <h2 className="text-lg font-semibold text-neutral-900">
            Journey & case preferences
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            These answers orient dashboards and recommendations. Changing them
            updates your routed workspace path when it makes sense.
          </p>
          <div className="mt-4 rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">Routed path: </span>
            {onb.routedPath
              ? pathLabels[onb.routedPath] ?? onb.routedPath
              : "—"}
            {onb.completed ? (
              <span className="ml-2 text-xs text-neutral-500">(onboarding completed)</span>
            ) : null}
          </div>
          <form onSubmit={saveOnboarding} className="mt-6 space-y-6">
            {onbMsg ? (
              <p className="text-sm text-emerald-800">{onbMsg}</p>
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Where you are in your journey
              </p>
              <div className="mt-3 space-y-2">
                {journeyOptions.map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200/90 bg-white px-3 py-2.5 text-sm transition hover:border-qt-slate/25"
                  >
                    <input
                      type="radio"
                      name="journey"
                      checked={onb.journeyCategory === o.value}
                      onChange={() =>
                        setOnb({ ...onb, journeyCategory: o.value })
                      }
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="familyCase">Family-based case type</FieldLabel>
              <TextInput
                id="familyCase"
                value={onb.familyCaseType}
                onChange={(v) => setOnb({ ...onb, familyCaseType: v })}
                placeholder="e.g. spouse adjustment, parent petition"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Filing status
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.alreadyFiled === true}
                    onChange={() => setOnb({ ...onb, alreadyFiled: true })}
                  />
                  Already filed
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.alreadyFiled === false}
                    onChange={() => setOnb({ ...onb, alreadyFiled: false })}
                  />
                  Not filed yet
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.alreadyFiled === null}
                    onChange={() => setOnb({ ...onb, alreadyFiled: null })}
                  />
                  Prefer not to say
                </label>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Forms involved
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {formOptions.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={onb.formsInvolved.includes(f)}
                      onChange={() =>
                        setOnb({
                          ...onb,
                          formsInvolved: onb.formsInvolved.includes(f)
                            ? onb.formsInvolved.filter((x) => x !== f)
                            : [...onb.formsInvolved, f],
                        })
                      }
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Receipt numbers
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.hasReceipt === true}
                    onChange={() => setOnb({ ...onb, hasReceipt: true })}
                  />
                  I have at least one receipt
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.hasReceipt === false}
                    onChange={() => setOnb({ ...onb, hasReceipt: false })}
                  />
                  Not yet
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={onb.hasReceipt === null}
                    onChange={() => setOnb({ ...onb, hasReceipt: null })}
                  />
                  Prefer not to say
                </label>
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="concern">Current concern</FieldLabel>
              <textarea
                id="concern"
                rows={4}
                value={onb.currentConcern}
                onChange={(e) =>
                  setOnb({ ...onb, currentConcern: e.target.value })
                }
                className={cn(inputClass, "resize-y")}
                placeholder="Optional — what you are watching most closely"
              />
            </div>
            <button
              type="submit"
              disabled={onbLoading}
              className={cn(appPrimaryCtaClassWide, "disabled:opacity-45")}
            >
              {onbLoading ? "Saving…" : "Save journey preferences"}
            </button>
          </form>
        </TrackSurface>
      ) : null}

      {/* Notifications */}
      <TrackSurface className={cn(surface, "p-6 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">Notifications</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Only categories that QueueTip actually uses today are shown below.
        </p>
        <form onSubmit={saveNotifs} className="mt-6 space-y-5">
          {notifMsg ? (
            <p className="text-sm text-emerald-800">{notifMsg}</p>
          ) : null}

          <div
            className={cn(
              "rounded-xl border p-4",
              emailDeliveryConfigured
                ? "border-neutral-100 bg-white"
                : "border-amber-200/60 bg-amber-50/30",
            )}
          >
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                disabled={!emailDeliveryConfigured}
                className="mt-1 size-4 rounded border-neutral-300 text-qt-slate disabled:opacity-40"
                checked={n.emailEnabled}
                onChange={(e) =>
                  setN({ ...n, emailEnabled: e.target.checked })
                }
              />
              <span>
                <span className="font-medium text-neutral-900">
                  Email notifications
                </span>
                <span className="mt-1 block text-neutral-600">
                  {emailDeliveryConfigured
                    ? "Outbound email is configured for this deployment."
                    : "Not available yet—SMTP or a provider API is not configured. Your choice is saved for when email goes live."}
                </span>
              </span>
            </label>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300 text-qt-slate"
              checked={n.inAppEnabled}
              onChange={(e) => setN({ ...n, inAppEnabled: e.target.checked })}
            />
            <span>
              <span className="font-medium text-neutral-900">
                In-app alerts
              </span>
              <span className="mt-1 block text-neutral-600">
                QueueTip records in your Alerts list when case status changes or
                delay heuristics fire (if those categories are on).
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300 text-qt-slate"
              checked={n.statusChanges}
              onChange={(e) =>
                setN({ ...n, statusChanges: e.target.checked })
              }
            />
            <span>
              <span className="font-medium text-neutral-900">
                Case status changes
              </span>
              <span className="mt-1 block text-neutral-600">
                When a synced receipt’s posted status changes.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300 text-qt-slate"
              checked={n.delayThresholds}
              onChange={(e) =>
                setN({ ...n, delayThresholds: e.target.checked })
              }
            />
            <span>
              <span className="font-medium text-neutral-900">
                Long-gap (delay) notices
              </span>
              <span className="mt-1 block text-neutral-600">
                When no new snapshot has been recorded for longer than the
                configured threshold—compare with official processing times.
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={notifLoading}
            className={cn(appPrimaryCtaClassWide, "disabled:opacity-45")}
          >
            {notifLoading ? "Saving…" : "Save notification preferences"}
          </button>
        </form>

        <div className="mt-8">
          <PushSettingsSection
            pushEnabledPref={n.pushEnabled}
            onPrefsChange={async (patch) => {
              await patchNotifs(patch);
            }}
          />
        </div>
      </TrackSurface>

      {/* Install */}
      <TrackSurface className={cn(surface, "p-6 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">
          Install QueueTip on your phone
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Add the site to your home screen for faster access. On supported
          browsers this also pairs well with push notifications.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-5">
            <h3 className="text-sm font-semibold text-neutral-900">iPhone (Safari)</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-700">
              <li>Open QueueTip in Safari.</li>
              <li>Tap the Share button.</li>
              <li>Scroll and tap <strong>Add to Home Screen</strong>.</li>
              <li>Confirm the name.</li>
              <li>Tap <strong>Add</strong>.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
            <h3 className="text-sm font-semibold text-neutral-900">Android (Chrome)</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-700">
              <li>Open QueueTip in Chrome.</li>
              <li>Tap the browser menu (⋮).</li>
              <li>
                Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.
              </li>
              <li>Confirm.</li>
              <li>Launch from the home screen.</li>
            </ol>
          </div>
        </div>
      </TrackSurface>
    </div>
  );
}
