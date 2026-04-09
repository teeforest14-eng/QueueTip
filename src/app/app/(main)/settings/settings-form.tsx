"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    preferredLanguage: string;
    countryRegion: string;
    needsReminders: boolean;
    interestedLocalHelp: boolean;
  };
  prefs: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    statusChanges: boolean;
    delayThresholds: boolean;
    reminders: boolean;
    milestones: boolean;
  };
};

export function SettingsForm({ email, profile, prefs }: Props) {
  const router = useRouter();
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [p, setP] = useState(profile);
  const [n, setN] = useState(prefs);
  const [profileLoading, setProfileLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setProfileLoading(false);
    if (!res.ok) {
      setProfileMsg("Could not save profile.");
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
      res.ok ? "Notification preferences saved." : "Could not save.",
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Account</CardTitle>
        <p className="mt-2 text-sm text-qt-text-secondary">Email: {email}</p>
        <p className="mt-2 text-xs text-qt-text-muted">
          Password changes use the forgot-password flow in V1.
        </p>
      </Card>
      <Card>
        <CardTitle>Profile</CardTitle>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          {profileMsg ? (
            <p className="text-sm text-qt-text-secondary">{profileMsg}</p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                className="mt-1"
                value={p.firstName}
                onChange={(e) => setP({ ...p, firstName: e.target.value })}
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                className="mt-1"
                value={p.lastName}
                onChange={(e) => setP({ ...p, lastName: e.target.value })}
                autoComplete="family-name"
              />
            </div>
            <div>
              <Label htmlFor="preferredLanguage">Preferred language</Label>
              <Input
                id="preferredLanguage"
                className="mt-1"
                value={p.preferredLanguage}
                onChange={(e) =>
                  setP({ ...p, preferredLanguage: e.target.value })
                }
                placeholder="en"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="countryRegion">Country / region</Label>
              <Input
                id="countryRegion"
                className="mt-1"
                value={p.countryRegion}
                onChange={(e) => setP({ ...p, countryRegion: e.target.value })}
                autoComplete="country-name"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-qt-text-secondary">
            <input
              type="checkbox"
              checked={p.needsReminders}
              onChange={(e) =>
                setP({ ...p, needsReminders: e.target.checked })
              }
            />
            Open to task reminders (when email delivery is on)
          </label>
          <label className="flex items-center gap-2 text-sm text-qt-text-secondary">
            <input
              type="checkbox"
              checked={p.interestedLocalHelp}
              onChange={(e) =>
                setP({ ...p, interestedLocalHelp: e.target.checked })
              }
            />
            Interested in local help resources when available
          </label>
          <Button type="submit" disabled={profileLoading}>
            {profileLoading ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
      <Card>
        <CardTitle>Notifications</CardTitle>
        <form onSubmit={saveNotifs} className="mt-4 space-y-3 text-sm">
          {notifMsg ? <p className="text-qt-text-secondary">{notifMsg}</p> : null}
          {(
            [
              ["emailEnabled", "Email channel (when configured)"],
              ["inAppEnabled", "In-app alerts"],
              ["statusChanges", "Status change category"],
              ["delayThresholds", "Delay threshold heuristics"],
              ["reminders", "Reminder tasks"],
              ["milestones", "Milestone prompts"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={n[key]}
                onChange={(e) => setN({ ...n, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
          <Button type="submit" disabled={notifLoading}>
            {notifLoading ? "Saving…" : "Save notifications"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
