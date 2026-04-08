export type SyncResult =
  | { ok: true; statusLabel: string; message?: string }
  | { ok: false; error: string };
