"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Props = {
  onPrefsChange: (patch: { pushEnabled: boolean }) => Promise<void>;
  pushEnabledPref: boolean;
};

export function PushSettingsSection({
  onPrefsChange,
  pushEnabledPref,
}: Props) {
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(
    null,
  );
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setPermission(
      typeof Notification !== "undefined"
        ? Notification.permission
        : "denied",
    );
    try {
      const r = await fetch("/api/push/status");
      if (!r.ok) return;
      const j = (await r.json()) as {
        serverConfigured: boolean;
        subscriptionCount: number;
        pushEnabled: boolean;
      };
      setServerConfigured(j.serverConfigured);
      setSubscriptionCount(j.subscriptionCount);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function enablePush() {
    setBusy(true);
    setMessage(null);
    try {
      const v = await fetch("/api/push/vapid-key");
      const vk = (await v.json()) as {
        configured: boolean;
        publicKey: string | null;
      };
      if (!vk.configured || !vk.publicKey) {
        setMessage(
          "Push is not configured on this server. Add VAPID keys to enable.",
        );
        setBusy(false);
        return;
      }
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setMessage(
          perm === "denied"
            ? "Notifications are blocked for this site. Change the setting in your browser for QueueTip."
            : "Permission was not granted.",
        );
        setBusy(false);
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vk.publicKey),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(
          typeof err.error === "string"
            ? err.error
            : "Could not save push subscription.",
        );
        setBusy(false);
        return;
      }
      await onPrefsChange({ pushEnabled: true });
      setMessage("Push is enabled for this device.");
      await refresh();
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Something went wrong enabling push.",
      );
    }
    setBusy(false);
  }

  async function disablePush() {
    setBusy(true);
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const j = sub.toJSON();
          if (j.endpoint) {
            await fetch("/api/push/unsubscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ endpoint: j.endpoint }),
            });
          }
          await sub.unsubscribe();
        }
      } else {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      }
      await onPrefsChange({ pushEnabled: false });
      setMessage("Push disabled for this account on this device.");
      await refresh();
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not disable push cleanly.",
      );
    }
    setBusy(false);
  }

  const active =
    pushEnabledPref && subscriptionCount > 0 && permission === "granted";

  return (
    <div className="rounded-xl border border-emerald-100/80 bg-gradient-to-br from-white to-emerald-50/20 p-5">
      <h3 className="text-sm font-semibold text-neutral-900">
        Browser push notifications
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Used for case status updates and delay notices when those events occur
        and your notification toggles allow them. Requires HTTPS and a
        supported browser.
      </p>
      {serverConfigured === false ? (
        <p className="mt-3 text-sm font-medium text-amber-900">
          This deployment has not set VAPID keys, so push cannot be enabled yet.
        </p>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        <li>
          <span className="font-medium text-neutral-900">Server: </span>
          {serverConfigured === null
            ? "Checking…"
            : serverConfigured
              ? "Ready"
              : "Not configured"}
        </li>
        <li>
          <span className="font-medium text-neutral-900">Browser permission: </span>
          {permission === "granted"
            ? "Granted"
            : permission === "denied"
              ? "Blocked"
              : "Not asked yet"}
        </li>
        <li>
          <span className="font-medium text-neutral-900">Saved devices: </span>
          {subscriptionCount}
        </li>
        <li>
          <span className="font-medium text-neutral-900">Status: </span>
          {active
            ? "Push enabled for this account (this browser)"
            : "Push not fully active"}
        </li>
      </ul>
      {message ? (
        <p className="mt-3 text-sm text-neutral-800" role="status">
          {message}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={
            busy || serverConfigured === false || permission === "denied"
          }
          onClick={() => void enablePush()}
          className={cn(
            appPrimaryCtaClassWide,
            "disabled:cursor-not-allowed disabled:opacity-45",
          )}
        >
          {busy ? "Working…" : "Enable push on this device"}
        </button>
        <button
          type="button"
          disabled={busy || subscriptionCount === 0}
          onClick={() => void disablePush()}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Disable push on this device
        </button>
      </div>
    </div>
  );
}
