import type { InterpretationOutput } from "@/lib/services/interpretation-service";

export type SerializableSnapshot = {
  id: string;
  statusLabel: string;
  description: string | null;
  capturedAt: string;
  source: string;
  isOfficial: boolean;
};

export type SerializableGroupCase = {
  id: string;
  receiptNumber: string;
  formType: string;
  currentStatusLabel: string | null;
  lastSyncedAt: string | null;
  snapshots: SerializableSnapshot[];
};

export type CaseDetailPayload = {
  id: string;
  receiptNumber: string;
  formType: string;
  currentStatusLabel: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isStale: boolean;
  syncUnavailable: boolean;
  notes: string | null;
  fieldOffice: string | null;
  serviceCenter: string | null;
  priorityDate: string | null;
  caseGroup: {
    id: string;
    label: string | null;
    cases: SerializableGroupCase[];
  };
  snapshots: SerializableSnapshot[];
  events: Array<{
    id: string;
    title: string;
    description: string | null;
    kind: string;
    occurredAt: string;
  }>;
  syncLogs: Array<{
    id: string;
    success: boolean;
    message: string | null;
    createdAt: string;
  }>;
};

export type CaseDetailTabsProps = {
  data: CaseDetailPayload;
  interpretation: InterpretationOutput | null;
  uscisLive: boolean;
};
