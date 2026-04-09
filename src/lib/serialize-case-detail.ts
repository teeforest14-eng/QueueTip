import type {
  Case,
  CaseEvent,
  CaseGroup,
  CaseStatusSnapshot,
  SyncLog,
} from "@prisma/client";
import type { CaseDetailPayload } from "@/components/app/track/case-detail-types";

export type CaseDetailFromDb = Case & {
  caseGroup: CaseGroup & {
    cases: (Case & { snapshots: CaseStatusSnapshot[] })[];
  };
  snapshots: CaseStatusSnapshot[];
  events: CaseEvent[];
  syncLogs: SyncLog[];
};

export function serializeCaseDetail(c: CaseDetailFromDb): CaseDetailPayload {
  return {
    id: c.id,
    receiptNumber: c.receiptNumber,
    formType: c.formType,
    currentStatusLabel: c.currentStatusLabel,
    lastSyncedAt: c.lastSyncedAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    isStale: c.isStale,
    syncUnavailable: c.syncUnavailable,
    notes: c.notes,
    fieldOffice: c.fieldOffice,
    serviceCenter: c.serviceCenter,
    priorityDate: c.priorityDate?.toISOString() ?? null,
    caseGroup: {
      id: c.caseGroup.id,
      label: c.caseGroup.label,
      cases: c.caseGroup.cases.map((k) => ({
        id: k.id,
        receiptNumber: k.receiptNumber,
        formType: k.formType,
        currentStatusLabel: k.currentStatusLabel,
        lastSyncedAt: k.lastSyncedAt?.toISOString() ?? null,
        snapshots: k.snapshots.map((s) => ({
          id: s.id,
          statusLabel: s.statusLabel,
          description: s.description,
          capturedAt: s.capturedAt.toISOString(),
          source: s.source,
          isOfficial: s.isOfficial,
        })),
      })),
    },
    snapshots: c.snapshots.map((s) => ({
      id: s.id,
      statusLabel: s.statusLabel,
      description: s.description,
      capturedAt: s.capturedAt.toISOString(),
      source: s.source,
      isOfficial: s.isOfficial,
    })),
    events: c.events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      kind: e.kind,
      occurredAt: e.occurredAt.toISOString(),
    })),
    syncLogs: c.syncLogs.map((l) => ({
      id: l.id,
      success: l.success,
      message: l.message,
      createdAt: l.createdAt.toISOString(),
    })),
  };
}
