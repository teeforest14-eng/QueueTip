/**
 * USCIS Case Status API (USCIS Torch platform) — sandbox by default.
 *
 * Docs: https://developer.uscis.gov/api/case-status
 * OAuth (client credentials): https://developer.uscis.gov/article/how-get-access-tokens-client-credentials
 *
 * Set `USCIS_CASE_STATUS_MODE=live` and provide `USCIS_CLIENT_ID` + `USCIS_CLIENT_SECRET`
 * (never commit secrets). Production base URLs are issued after USCIS demo approval.
 */

import { prisma } from "@/lib/prisma";
import { isValidReceiptFormat, normalizeReceiptNumber } from "@/lib/validation";
import type { SyncResult } from "@/lib/services/case-sync-types";
import { evaluateDelayForCase } from "@/lib/services/delay-service";

const DEFAULT_TOKEN_URL = "https://api-int.uscis.gov/oauth/accesstoken";
const DEFAULT_CASE_STATUS_BASE = "https://api-int.uscis.gov";

const TOKEN_SKEW_MS = 60_000;

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

type UscisTokenResponse = {
  access_token?: string;
  expires_in?: string | number;
  token_type?: string;
  status?: string;
};

type UscisCaseStatusResponse = {
  case_status?: {
    receiptNumber?: string;
    formType?: string;
    current_case_status_text_en?: string | null;
    submittedDate?: string;
    modifiedDate?: string;
  };
  message?: string;
};

type UscisProblem = {
  status?: number;
  title?: string;
  detail?: string;
  traceId?: string;
};

function parseExpiresMs(data: UscisTokenResponse): number {
  const raw = data.expires_in;
  const sec = typeof raw === "string" ? parseInt(raw, 10) : typeof raw === "number" ? raw : 0;
  if (!Number.isFinite(sec) || sec <= 0) return 1_800_000;
  return sec * 1000;
}

async function getClientCredentialsToken(): Promise<string> {
  const clientId = process.env.USCIS_CLIENT_ID?.trim();
  const clientSecret = process.env.USCIS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing USCIS_CLIENT_ID or USCIS_CLIENT_SECRET. Add them to your server environment (not the client bundle).",
    );
  }

  const now = Date.now();
  if (tokenCache && now < tokenCache.expiresAt - TOKEN_SKEW_MS) {
    return tokenCache.accessToken;
  }

  const tokenUrl = process.env.USCIS_OAUTH_TOKEN_URL?.trim() || DEFAULT_TOKEN_URL;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();
  let data: UscisTokenResponse;
  try {
    data = JSON.parse(text) as UscisTokenResponse;
  } catch {
    throw new Error(
      `USCIS OAuth token response was not JSON (${res.status}). Check USCIS_OAUTH_TOKEN_URL and credentials.`,
    );
  }

  if (!res.ok || !data.access_token) {
    const hint = data.status === "denied" ? " Credentials may be wrong or the app may lack Case Status API access." : "";
    throw new Error(
      `USCIS OAuth failed (${res.status}). ${text.slice(0, 280)}${hint}`,
    );
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + parseExpiresMs(data),
  };
  return tokenCache.accessToken;
}

function formatUscisError(status: number, text: string): string {
  try {
    const j = JSON.parse(text) as { errors?: UscisProblem[]; detail?: string; title?: string };
    const first = j.errors?.[0];
    if (first?.detail) return first.detail;
    if (j.detail) return j.detail;
    if (first?.title) return first.title;
    if (j.title) return j.title;
  } catch {
    /* fall through */
  }
  return `USCIS API returned ${status}. Try again later or verify the receipt number.`;
}

export async function syncCaseFromUscisApi(caseId: string): Promise<SyncResult> {
  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return { ok: false, error: "Case not found" };

  const normalized = normalizeReceiptNumber(c.receiptNumber);
  if (!isValidReceiptFormat(normalized)) {
    return {
      ok: false,
      error:
        "Receipt number format looks invalid. Official receipts usually look like MSC1290123456 (3 letters + 10 digits).",
    };
  }

  let accessToken: string;
  try {
    accessToken = await getClientCredentialsToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "USCIS authentication failed.";
    await prisma.syncLog.create({
      data: { caseId, success: false, message: msg.slice(0, 500) },
    });
    return { ok: false, error: msg };
  }

  const base = (process.env.USCIS_CASE_STATUS_API_BASE?.trim() || DEFAULT_CASE_STATUS_BASE).replace(
    /\/$/,
    "",
  );
  const url = `${base}/case-status/${encodeURIComponent(normalized)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error calling USCIS.";
    await prisma.syncLog.create({
      data: { caseId, success: false, message: msg.slice(0, 500) },
    });
    await prisma.case.update({
      where: { id: caseId },
      data: { syncUnavailable: true, isStale: true },
    });
    return { ok: false, error: "Could not reach USCIS. Check your connection and try again." };
  }

  const bodyText = await res.text();
  if (!res.ok) {
    const userMsg = formatUscisError(res.status, bodyText);
    await prisma.syncLog.create({
      data: {
        caseId,
        success: false,
        message: `HTTP ${res.status}: ${bodyText.slice(0, 400)}`,
      },
    });
    await prisma.case.update({
      where: { id: caseId },
      data: { syncUnavailable: res.status >= 500, isStale: true },
    });
    return { ok: false, error: userMsg };
  }

  let payload: UscisCaseStatusResponse;
  try {
    payload = JSON.parse(bodyText) as UscisCaseStatusResponse;
  } catch {
    await prisma.syncLog.create({
      data: { caseId, success: false, message: "Invalid JSON from USCIS case-status response" },
    });
    return { ok: false, error: "USCIS returned an unexpected response. Try again later." };
  }

  const statusEn = payload.case_status?.current_case_status_text_en?.trim();
  if (!statusEn) {
    await prisma.syncLog.create({
      data: {
        caseId,
        success: false,
        message: "Missing current_case_status_text_en in USCIS response",
      },
    });
    return {
      ok: false,
      error: "USCIS did not return a case status for this receipt. Confirm the receipt number.",
    };
  }

  const apiForm = payload.case_status?.formType?.trim();
  const prev = c.currentStatusLabel;

  await prisma.$transaction(async (tx) => {
    await tx.case.update({
      where: { id: caseId },
      data: {
        currentStatusLabel: statusEn,
        lastSyncedAt: new Date(),
        isStale: false,
        syncUnavailable: false,
        ...(apiForm ? { formType: apiForm } : {}),
      },
    });
    await tx.caseStatusSnapshot.create({
      data: {
        caseId,
        statusLabel: statusEn,
        description:
          payload.message?.slice(0, 2000) ??
          "Snapshot from USCIS Case Status API (official source).",
        source: "uscis",
        isOfficial: true,
      },
    });
    await tx.caseEvent.create({
      data: {
        caseId,
        title: "Status refresh",
        description: `USCIS Case Status API: ${statusEn}`,
        kind: "status_change",
      },
    });
    await tx.syncLog.create({
      data: { caseId, success: true, message: "USCIS Case Status sync completed" },
    });
  });

  if (prev && prev !== statusEn) {
    const { maybeNotifyStatusChange } = await import("@/lib/services/notification-service");
    await maybeNotifyStatusChange(c.userId, {
      receipt: normalized,
      formType: apiForm ?? c.formType,
      status: statusEn,
    });
  }

  await evaluateDelayForCase(caseId);

  return { ok: true, statusLabel: statusEn, message: payload.message };
}
