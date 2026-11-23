import Link from "next/link";

import { ArtworkThumb } from "./artwork-image";
import type { ArtworkWithStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function ArtworkCard({
  artwork,
  priority = false,
}: {
  artwork: ArtworkWithStats;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/artwork/${artwork.slug}`}
      className="group block min-w-0"
      aria-label={`${artwork.title} by ${artwork.artist_name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-subtle">
        <ArtworkThumb
          src={artwork.image_url}
          alt={`${artwork.title} by ${artwork.artist_name}`}
          priority={priority}
          className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {(artwork.is_demo === 1 || artwork.is_ai_generated === 1) && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {artwork.is_demo === 1 && (
              <span className="rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur">
                Demo
              </span>
            )}
            {artwork.is_ai_generated === 1 && (
              <span className="rounded-full bg-white/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-black backdrop-blur">
                AI
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14.5px] font-medium tracking-[-0.01em]">
            {artwork.title}
          </h3>
          <p className="mt-0.5 truncate text-[12.5px] text-muted">
            {artwork.artist_name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-medium tabular-nums">
            {artwork.vote_count ? `${artwork.yes_pct}%` : "—"}
          </p>
          <p className="text-[10px] text-muted">say art</p>
        </div>
      </div>

      <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-ink/75 transition-all duration-700"
          style={{ width: `${artwork.yes_pct}%` }}
        />
      </div>
      <p className="mt-2 text-[10.5px] text-muted">
        {artwork.vote_count
          ? `${formatNumber(artwork.vote_count)} judgments`
          : "No judgments yet — be the first"}
      </p>
    </Link>
  );
}
