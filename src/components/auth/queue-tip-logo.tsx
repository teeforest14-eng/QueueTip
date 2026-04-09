import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const LOGO_SRC = "/brand/queue-tip-logo.png";

/** Wordmark + brand image; links home. */
export function QueueTipLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col items-center gap-3.5 outline-none",
        "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-4",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={448}
        height={112}
        sizes="96px"
        className="h-24 w-auto max-w-[min(100%,18rem)] shrink-0 object-contain object-center"
        priority
      />
      <span className="text-lg font-medium leading-none tracking-[-0.02em] text-neutral-800">
        QueueTip
      </span>
    </Link>
  );
}
