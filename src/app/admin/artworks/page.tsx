import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button";
import { buttonClasses } from "@/components/ui/button";
import { listAdminArtworks } from "@/lib/queries";
import { cn, formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = ["all", "pending", "approved", "rejected"] as const;

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  all: "все",
  pending: "на рассмотрении",
  approved: "одобренные",
  rejected: "отклонённые",
};

export default async function AdminArtworksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = FILTERS.includes((params.status ?? "") as (typeof FILTERS)[number])
    ? (params.status as string)
    : "all";
  const all = listAdminArtworks(200);
  const rows = status === "all" ? all : all.filter((artwork) => artwork.status === status);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[16px] font-medium tracking-tight">Каталог</h2>
          <p className="mt-1 text-[12px] text-muted">
            {formatNumber(all.length)} работ в базе.
          </p>
        </div>
        <Link href="/admin/artworks/new" className={buttonClasses({ size: "sm" })}>
          <Plus size={14} /> Новая работа
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-1">
        {FILTERS.map((filter) => {
          const count =
            filter === "all" ? all.length : all.filter((artwork) => artwork.status === filter).length;
          return (
            <Link
              key={filter}
              href={filter === "all" ? "/admin/artworks" : `/admin/artworks?status=${filter}`}
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

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[44px_minmax(0,1fr)_120px_90px_90px_130px] items-center gap-3 border-b border-line px-4 py-2.5 text-[9.5px] uppercase tracking-[0.12em] text-muted lg:grid">
          <span />
          <span>Работа</span>
          <span>Категория</span>
          <span>Статус</span>
          <span className="text-right">Голоса</span>
          <span className="text-right">Действия</span>
        </div>
        <ul className="divide-y divide-line">
          {rows.length === 0 && (
            <li className="px-4 py-14 text-center text-[12.5px] text-muted">
              Работ с таким статусом нет.
            </li>
          )}
          {rows.map((artwork) => (
            <li
              key={artwork.id}
              className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[44px_minmax(0,1fr)_120px_90px_90px_130px]"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-subtle">
                <ArtworkThumb src={artwork.image_url} alt={artwork.title} sizes="44px" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">{artwork.title}</p>
                <p className="truncate text-[10px] text-muted">
                  {artwork.artist_name}
                  {artwork.submitter ? ` · @${artwork.submitter}` : ""}
                  {" · "}
                  {formatDate(artwork.created_at)}
                </p>
              </div>
              <span className="hidden truncate text-[10.5px] text-muted lg:block">
                {artwork.category}
              </span>
              <span className="hidden lg:block">
                <Status status={artwork.status} />
              </span>
              <span className="hidden text-right text-[11px] tabular-nums text-muted lg:block">
                {formatNumber(artwork.vote_count)}
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <Status status={artwork.status} className="lg:hidden" />
                {artwork.status === "approved" && (
                  <Link
                    href={`/artwork/${artwork.slug}`}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] text-muted hover:bg-subtle hover:text-ink"
                  >
                    Открыть <ArrowUpRight size={10} />
                  </Link>
                )}
                <Link
                  href={`/admin/artworks/${artwork.id}/edit`}
                  className="rounded-full px-2 py-1 text-[10.5px] text-muted hover:bg-subtle hover:text-ink"
                >
                  Изменить
                </Link>
                <DeleteArtworkButton artworkId={artwork.id} title={artwork.title} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Status({ status, className }: { status: string; className?: string }) {
  const tone =
    status === "approved"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "pending"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-red-500/10 text-red-600 dark:text-red-400";
  const labels: Record<string, string> = {
    approved: "одобрена",
    pending: "на рассмотрении",
    rejected: "отклонена",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.1em]",
        tone,
        className,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
