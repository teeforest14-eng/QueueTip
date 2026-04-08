"use client";

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
  const [message, setMessage] = useState<string | null>(null);
  const [p, setP] = useState(profile);
  const [n, setN] = useState(prefs);
  const [loading, setLoading] = useState(false);

  async function saveNotifs(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/notification-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n),
    });
    setLoading(false);
    setMessage(res.ok ? "Notification preferences saved." : "Could not save.");
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
        <p className="mt-2 text-xs text-qt-text-muted">
          Profile fields sync through onboarding PATCH in V1; edit here is
          display-only until wired to a dedicated API.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>First name</Label>
            <Input className="mt-1" value={p.firstName} readOnly />
          </div>
          <div>
            <Label>Last name</Label>
            <Input className="mt-1" value={p.lastName} readOnly />
          </div>
          <div>
            <Label>Preferred language</Label>
            <Input className="mt-1" value={p.preferredLanguage} readOnly />
          </div>
          <div>
            <Label>Country / region</Label>
            <Input className="mt-1" value={p.countryRegion} readOnly />
          </div>
        </div>
      </Card>
      <Card>
        <CardTitle>Notifications</CardTitle>
        <form onSubmit={saveNotifs} className="mt-4 space-y-3 text-sm">
          {message ? <p className="text-qt-text-secondary">{message}</p> : null}
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
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save notifications"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
