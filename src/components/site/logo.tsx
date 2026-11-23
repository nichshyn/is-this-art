import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="IS THIS ART? — главная"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-accent text-accent-ink transition-transform duration-500 group-hover:rotate-6">
        <span className="text-[15px] font-semibold leading-none">?</span>
      </span>
      {!markOnly && (
        <span className="text-[14px] font-semibold tracking-[-0.02em] text-ink">
          IS THIS ART?
        </span>
      )}
    </Link>
  );
}
