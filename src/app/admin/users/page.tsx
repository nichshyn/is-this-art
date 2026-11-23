import Link from "next/link";
import { Search, Users } from "lucide-react";

import { BlockUserButton } from "@/components/admin/block-user-button";
import { Avatar } from "@/components/ui/avatar";
import { listAdminUsers } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const all = listAdminUsers();
  const rows = q
    ? all.filter(
        (user) =>
          user.username.toLowerCase().includes(q.toLowerCase()) ||
          user.email.toLowerCase().includes(q.toLowerCase()),
      )
    : all;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[16px] font-medium tracking-tight">Members</h2>
          <p className="mt-1 text-[12px] text-muted">
            {formatNumber(all.length)} accounts · {all.filter((user) => user.is_blocked).length} suspended
          </p>
        </div>
        <form action="/admin/users" className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search username or email"
            className="h-9 w-full rounded-full border border-line bg-surface pl-9 pr-4 text-[12px] outline-none transition-colors focus:border-ink/30 sm:w-64"
          />
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[minmax(0,1fr)_90px_80px_80px_110px_100px] items-center gap-3 border-b border-line px-4 py-2.5 text-[9.5px] uppercase tracking-[0.12em] text-muted lg:grid">
          <span>Member</span>
          <span>Role</span>
          <span className="text-right">Points</span>
          <span className="text-right">Votes</span>
          <span className="text-right">Joined</span>
          <span className="text-right">Status</span>
        </div>
        <ul className="divide-y divide-line">
          {rows.length === 0 && (
            <li className="px-4 py-14 text-center text-[12.5px] text-muted">
              No members match “{q}”.
            </li>
          )}
          {rows.map((user) => (
            <li
              key={user.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_90px_80px_80px_110px_100px]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={user.username} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium">
                    @{user.username}
                    {user.is_blocked === 1 && (
                      <span className="ml-2 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[8.5px] uppercase tracking-[0.1em] text-red-600 dark:text-red-400">
                        suspended
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[10px] text-muted">{user.email}</p>
                </div>
              </div>
              <span className="hidden text-[10.5px] capitalize text-muted lg:block">{user.role}</span>
              <span className="hidden text-right text-[11px] tabular-nums lg:block">
                {formatNumber(user.points)}
              </span>
              <span className="hidden text-right text-[11px] tabular-nums text-muted lg:block">
                {formatNumber(user.votes)}
              </span>
              <span className="hidden text-right text-[10px] text-muted lg:block">
                {formatDate(user.created_at)}
              </span>
              <div className="flex justify-end">
                <BlockUserButton
                  userId={user.id}
                  username={user.username}
                  blocked={user.is_blocked === 1}
                  disabled={user.role === "admin"}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {rows.length > 0 && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] text-muted">
          <Users size={12} />
          Suspending an account blocks voting, commenting and uploading. Admins cannot be suspended here.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
        <Link href="/admin" className="text-muted hover:text-ink">
          ← Back to overview
        </Link>
      </div>
    </div>
  );
}
