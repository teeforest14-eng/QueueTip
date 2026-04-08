import { cn } from "@/lib/cn";

export function TrustChipRow({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2.5", className)}>
      {items.map((label) => (
        <li key={label}>
          <span className="qt-trust-chip inline-flex items-center rounded-md border border-qt-soft-gray bg-white px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.02em] text-qt-text-secondary sm:px-3">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
