import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flag,
  Images,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  UserRoundX,
  Users,
} from "lucide-react";

import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import {
  getAdminStats,
  listAdminArtworks,
  listPendingArtworks,
  listReports,
} from "@/lib/queries";
import { formatNumber, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const pending = listPendingArtworks().slice(0, 4);
  const reports = listReports()
    .filter((report) => report.status === "open")
    .slice(0, 4);
  const recent = listAdminArtworks(6);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Pending review",
            value: stats.pending,
            href: "/admin/moderation",
            icon: <ShieldAlert size={16} />,
            highlight: stats.pending > 0,
          },
          {
            label: "Open reports",
            value: stats.reports,
            href: "/admin/reports",
            icon: <Flag size={16} />,
            highlight: stats.reports > 0,
          },
          {
            label: "Approved works",
            value: stats.approved,
            href: "/admin/artworks",
            icon: <Images size={16} />,
          },
          {
            label: "Members",
            value: stats.users,
            href: "/admin/users",
            icon: <Users size={16} />,
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group rounded-2xl border p-4 transition-colors hover:bg-subtle ${
              item.highlight ? "border-ink/20 bg-subtle/60" : "border-line bg-surface"
            }`}
          >
            <span className="flex items-center justify-between text-muted">
              {item.icon}
              <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <p className="mt-4 text-[26px] font-semibold tracking-tight tabular-nums">
              {formatNumber(item.value)}
            </p>
            <p className="text-[10.5px] uppercase tracking-[0.13em] text-muted">
              {item.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total judgments", stats.votes],
          ["Comments", stats.comments],
          ["All artworks", stats.artworks],
          ["Blocked users", stats.blocked],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-line px-4 py-3">
            <p className="text-[16px] font-semibold tabular-nums">{formatNumber(Number(value))}</p>
            <p className="text-[10px] text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[13.5px] font-medium">Moderation queue</h2>
              <p className="mt-0.5 text-[10.5px] text-muted">
                Oldest submissions first
              </p>
            </div>
            <Link href="/admin/moderation" className="text-[11px] text-muted hover:text-ink">
              View all
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Sparkles size={20} className="mx-auto text-muted" />
              <p className="mt-3 text-[12.5px] font-medium">The queue is clear.</p>
              <p className="mt-1 text-[11px] text-muted">New uploads will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {pending.map((artwork) => (
                <li key={artwork.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-subtle">
                    <ArtworkThumb src={artwork.image_url} alt={artwork.title} sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">{artwork.title}</p>
                    <p className="truncate text-[10.5px] text-muted">
                      {artwork.submitter ? `@${artwork.submitter}` : "Seed content"} ·{" "}
                      {timeAgo(artwork.created_at)}
                    </p>
                  </div>
                  <Link
                    href="/admin/moderation"
                    className="shrink-0 text-[10.5px] text-muted hover:text-ink"
                  >
                    Review
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[13.5px] font-medium">Open reports</h2>
              <p className="mt-0.5 text-[10.5px] text-muted">Community flags awaiting a decision</p>
            </div>
            <Link href="/admin/reports" className="text-[11px] text-muted hover:text-ink">
              View all
            </Link>
          </div>
          {reports.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShieldAlert size={20} className="mx-auto text-muted" />
              <p className="mt-3 text-[12.5px] font-medium">No open reports.</p>
              <p className="mt-1 text-[11px] text-muted">A quiet queue is a good queue.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {reports.map((report) => (
                <li key={report.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium">{report.reason}</p>
                      <p className="mt-0.5 truncate text-[10.5px] text-muted">
                        {report.artwork_title} · @{report.username}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9.5px] text-muted">
                      {timeAgo(report.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[13.5px] font-medium">Recently added</h2>
            <p className="mt-0.5 text-[10.5px] text-muted">Latest catalog entries</p>
          </div>
          <Link href="/admin/artworks" className="text-[11px] text-muted hover:text-ink">
            Manage artworks
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {recent.map((artwork) => (
            <li key={artwork.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-subtle">
                <ArtworkThumb src={artwork.image_url} alt={artwork.title} sizes="44px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium">{artwork.title}</p>
                <p className="truncate text-[10.5px] text-muted">
                  {artwork.artist_name} · {artwork.category}
                </p>
              </div>
              <span className="hidden text-[10px] text-muted sm:block">
                {formatNumber(artwork.vote_count)} votes
              </span>
              <Status status={artwork.status} />
              <Link
                href={`/admin/artworks/${artwork.id}/edit`}
                className="shrink-0 text-[10.5px] text-muted hover:text-ink"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/artworks/new" className={buttonClasses({ size: "sm" })}>
          Add an artwork <ArrowRight size={14} />
        </Link>
        <Link href="/admin/moderation" className={buttonClasses({ variant: "secondary", size: "sm" })}>
          <ShieldAlert size={13} /> Open queue
        </Link>
        <Link href="/admin/users" className={buttonClasses({ variant: "ghost", size: "sm" })}>
          <UserRoundX size={13} /> Manage members
        </Link>
        <Link href="/community" className={buttonClasses({ variant: "ghost", size: "sm" })}>
          <MessageSquare size={13} /> View community
        </Link>
      </div>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "pending"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-red-500/10 text-red-600 dark:text-red-400";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${tone}`}>
      {status}
    </span>
  );
}
