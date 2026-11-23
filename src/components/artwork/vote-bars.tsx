"use client";

import { motion } from "framer-motion";

import type { VoteStats, VoteType } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

const ROWS: Array<{
  key: VoteType;
  label: string;
  short: string;
  tone: string;
}> = [
  { key: "yes", label: "Yes, it's art.", short: "Yes", tone: "bg-ink" },
  { key: "no", label: "No, it's not art.", short: "No", tone: "bg-ink/45" },
  { key: "unsure", label: "I'm not sure.", short: "Not sure", tone: "bg-ink/15" },
];

export function VoteBars({
  stats,
  yourVote,
  className,
  showCounts = true,
  animate = true,
}: {
  stats: VoteStats;
  yourVote?: VoteType | null;
  className?: string;
  showCounts?: boolean;
  animate?: boolean;
}) {
  const value = (key: VoteType) =>
    key === "yes" ? stats.yesPct : key === "no" ? stats.noPct : stats.unsurePct;
  const count = (key: VoteType) =>
    key === "yes" ? stats.yes : key === "no" ? stats.no : stats.unsure;

  return (
    <div
      className={cn("space-y-4", className)}
      role="img"
      aria-label={`Yes ${stats.yesPct}%, no ${stats.noPct}%, not sure ${stats.unsurePct}%`}
    >
      {ROWS.map((row) => (
        <div key={row.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] text-ink/80">{row.label}</span>
              {yourVote === row.key && (
                <span className="rounded-full bg-subtle px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-muted">
                  You
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              {showCounts && (
                <span className="text-[10.5px] tabular-nums text-muted">
                  {formatNumber(count(row.key))}
                </span>
              )}
              <span className="w-9 text-right text-[13px] font-medium tabular-nums">
                {value(row.key)}%
              </span>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <motion.div
              className={cn("h-full rounded-full", row.tone)}
              initial={animate ? { width: 0 } : false}
              animate={{ width: `${value(row.key)}%` }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MiniVoteBar({
  stats,
  className,
}: {
  stats: VoteStats;
  className?: string;
}) {
  return (
    <div className={cn("flex h-1.5 w-full overflow-hidden rounded-full bg-line", className)}>
      <div className="h-full bg-ink" style={{ width: `${stats.yesPct}%` }} />
      <div className="h-full bg-ink/40" style={{ width: `${stats.noPct}%` }} />
      <div className="h-full bg-ink/15" style={{ width: `${stats.unsurePct}%` }} />
    </div>
  );
}
