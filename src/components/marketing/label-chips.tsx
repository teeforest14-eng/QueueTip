import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type LabelVariant = "official" | "typical" | "next";

const toneMap: Record<LabelVariant, "support" | "soft" | "trust"> = {
  official: "support",
  typical: "soft",
  next: "trust",
};

const styles: Record<
  LabelVariant,
  { border: string; activeRing: string; activeShadow: string }
> = {
  official: {
    border: "border-[#7eb8e8]/55",
    activeRing: "ring-2 ring-[#6F8FAF]/35",
    activeShadow: "shadow-[0_0_0_3px_rgba(169,214,255,0.28)]",
  },
  typical: {
    border: "border-qt-primary-soft/70",
    activeRing: "ring-2 ring-qt-primary/25",
    activeShadow: "shadow-[0_0_0_3px_rgba(252,227,199,0.55)]",
  },
  next: {
    border: "border-[#8cc99a]/55",
    activeRing: "ring-2 ring-[#6F8FAF]/30",
    activeShadow: "shadow-[0_0_0_3px_rgba(168,221,181,0.35)]",
  },
};

const labels: Record<LabelVariant, string> = {
  official: "Official",
  typical: "Typical",
  next: "Next step",
};

export function LabelChip({
  variant,
  active,
  className,
}: {
  variant: LabelVariant;
  active?: boolean;
  className?: string;
}) {
  const s = styles[variant];
  const tone = toneMap[variant];
  return (
    <Badge
      tone={tone}
      className={cn(
        "rounded-md border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
        s.border,
        active && cn(s.activeRing, s.activeShadow),
        className,
      )}
    >
      {labels[variant]}
    </Badge>
  );
}

export function LabelChipRow({
  activeVariant,
  className,
}: {
  activeVariant: LabelVariant;
  className?: string;
}) {
  const order: LabelVariant[] = ["official", "typical", "next"];
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {order.map((v) => (
        <LabelChip key={v} variant={v} active={v === activeVariant} />
      ))}
    </div>
  );
}
