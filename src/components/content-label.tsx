import { Badge } from "@/components/ui/badge";

const map = {
  official: { label: "Official resource", tone: "support" as const },
  typical: { label: "Typical meaning", tone: "soft" as const },
  interpretation: { label: "QueueTip interpretation", tone: "trust" as const },
  action: { label: "What to do now", tone: "neutral" as const },
  wait: { label: "When to wait", tone: "neutral" as const },
  escalate: { label: "When to escalate", tone: "neutral" as const },
};

export function ContentLabel({
  kind,
}: {
  kind: keyof typeof map;
}) {
  const m = map[kind];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
