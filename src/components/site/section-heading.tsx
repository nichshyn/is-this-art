import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.8rem)] leading-[1.02] text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="link-underline shrink-0 text-[12.5px] font-medium text-ink"
        >
          {linkLabel}
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}
