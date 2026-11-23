import Link from "next/link";
import { Flag } from "lucide-react";

import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { ReportActions } from "@/components/admin/report-actions";
import { listReports } from "@/lib/queries";
import { cn, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = ["open", "resolved", "dismissed", "all"] as const;

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  open: "открытые",
  resolved: "урегулированные",
  dismissed: "отклонённые",
  all: "все",
};

const STATUS_LABELS: Record<string, string> = {
  open: "открыта",
  resolved: "урегулирована",
  dismissed: "отклонена",
};

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = FILTERS.includes((params.status ?? "") as (typeof FILTERS)[number])
    ? (params.status as string)
    : "open";
  const all = listReports();
  const rows = status === "all" ? all : all.filter((report) => report.status === status);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[16px] font-medium tracking-tight">Жалобы</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
            Жалобы от сообщества. Решение фиксируется в системе, а отклонённая
            жалоба закрывается без изменений работы.
          </p>
        </div>
        <p className="text-[11px] text-muted">Открытых жалоб: {all.filter((r) => r.status === "open").length}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-1">
        {FILTERS.map((filter) => {
          const count =
            filter === "all" ? all.length : all.filter((report) => report.status === filter).length;
          return (
            <Link
              key={filter}
              href={filter === "open" ? "/admin/reports" : `/admin/reports?status=${filter}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] capitalize transition-colors",
                filter === status ? "bg-accent text-accent-ink" : "text-muted hover:bg-subtle hover:text-ink",
              )}
            >
              {FILTER_LABELS[filter]} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line py-20 text-center">
          <Flag size={20} className="mx-auto text-muted" />
          <p className="mt-3 text-[13px] font-medium">
            {status === "all"
              ? "Жалоб нет."
              : `Нет жалоб со статусом «${FILTER_LABELS[status as (typeof FILTERS)[number]]}».`}
          </p>
          <p className="mt-1 text-[11.5px] text-muted">В очереди тихо.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-2">
          {rows.map((report) => (
            <li key={report.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-subtle">
                  <ArtworkThumb
                    src={report.artwork_image ?? ""}
                    alt={report.artwork_title ?? "Работа"}
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12.5px] font-medium">{report.reason}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.1em]",
                        report.status === "open"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : report.status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-subtle text-muted",
                      )}
                    >
                      {STATUS_LABELS[report.status] ?? report.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[10.5px] text-muted">
                    {report.artwork_slug ? (
                      <Link href={`/artwork/${report.artwork_slug}`} className="underline underline-offset-2">
                        {report.artwork_title}
                      </Link>
                    ) : (
                      report.artwork_title
                    )}
                    {" · жалоба от "}
                    <Link href={`/u/${report.username}`} className="underline underline-offset-2">
                      @{report.username}
                    </Link>
                    {" · "}
                    {timeAgo(report.created_at)}
                  </p>
                  {report.details && (
                    <p className="mt-2 rounded-xl bg-subtle/70 px-3 py-2 text-[11.5px] leading-relaxed text-ink/75">
                      {report.details}
                    </p>
                  )}
                </div>
                {report.status === "open" ? (
                  <ReportActions reportId={report.id} />
                ) : (
                  <span className="text-[10px] text-muted">Закрыта</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
