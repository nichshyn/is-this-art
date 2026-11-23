import type { Metadata } from "next";
import Link from "next/link";
import { Crown, Flame, Sparkles, Trophy } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { getCurrentUser } from "@/lib/auth";
import { getLeaderboard, getSiteStats } from "@/lib/queries";
import { cn, formatNumber, plural } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Таблица лидеров",
  description:
    "Участники, которые смотрят внимательнее всех. Рейтинг по очкам за суждения, задания дня, достижения и одобренные работы.",
  alternates: { canonical: "/leaderboard" },
};

const PERIODS = [
  { value: "weekly", label: "На этой неделе" },
  { value: "monthly", label: "В этом месяце" },
  { value: "all", label: "За всё время" },
] as const;

type Period = (typeof PERIODS)[number]["value"];

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period: Period = PERIODS.some((item) => item.value === params.period)
    ? (params.period as Period)
    : "all";

  const rows = getLeaderboard(period);
  const stats = getSiteStats();
  const viewer = await getCurrentUser();
  const viewerIndex = viewer ? rows.findIndex((row) => row.id === viewer.id) : -1;
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Таблица лидеров</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[0.9]">
            Те, кто
            <br />
            смотрит внимательнее всех.
          </h1>
          <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-muted">
            Очки начисляются за суждения, задания дня, достижения и одобренные
            работы. Никаких денег, рекламы и лёгких путей.
          </p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-full border border-line bg-surface p-1">
          {PERIODS.map((item) => (
            <Link
              key={item.value}
              href={item.value === "all" ? "/leaderboard" : `/leaderboard?period=${item.value}`}
              className={cn(
                "rounded-full px-3.5 py-2 text-[11.5px] transition-colors",
                item.value === period
                  ? "bg-accent text-accent-ink"
                  : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-3 border-y border-line py-5 sm:grid-cols-4">
        {[
          ["Участники", stats.users],
          ["Суждения", stats.votes],
          ["Работы", stats.artworks],
          ["Сегодня", stats.todayVotes],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <dd className="text-[22px] font-semibold tracking-tight tabular-nums">
              {formatNumber(Number(value))}
            </dd>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-line py-16 text-center">
          <p className="text-[14px] font-medium">Рейтинга пока нет.</p>
          <p className="mt-2 text-[12.5px] text-muted">
            Станьте первым, кто заработает очки за суждение.
          </p>
          <Link
            href="/play"
            className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-[12.5px] font-medium text-accent-ink"
          >
            Начать игру
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {podium.map((row, index) => (
              <Reveal key={row.id} delay={index * 0.05}>
                <Link
                  href={`/u/${row.username}`}
                  className={cn(
                    "group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-5 transition-colors hover:bg-subtle",
                    index === 0 && "sm:order-2",
                    index === 1 && "sm:order-1",
                    index === 2 && "sm:order-3",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-[10px] font-medium">
                      {index === 0 ? <Crown size={11} /> : <Trophy size={11} />}
                      #{index + 1}
                    </span>
                    <span className="text-[10.5px] text-muted">
                      {plural(row.points, "очко", "очка", "очков")}
                    </span>
                  </div>
                  <Avatar
                    name={row.username}
                    src={row.avatar_url}
                    size={index === 0 ? "lg" : "md"}
                    className="mt-6"
                  />
                  <p className="mt-4 truncate text-[17px] font-medium tracking-tight">
                    @{row.username}
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted">
                    {plural(row.votes, "суждение", "суждения", "суждений")} · {plural(row.works, "работа", "работы", "работ")}
                  </p>
                  {row.streak > 0 && (
                    <p className="mt-3 inline-flex items-center gap-1 text-[10.5px] text-muted">
                      <Flame size={11} /> серия {plural(row.streak, "день", "дня", "дней")}
                    </p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="hidden grid-cols-[48px_1fr_100px_100px_100px_100px] items-center gap-4 border-b border-line px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-muted sm:grid">
              <span>Место</span>
              <span>Участник</span>
              <span className="text-right">Очки</span>
              <span className="text-right">Суждения</span>
              <span className="text-right">Работы</span>
              <span className="text-right">Серия</span>
            </div>
            <ul className="divide-y divide-line">
              {rest.map((row, index) => {
                const rank = index + 4;
                const isViewer = viewer?.id === row.id;
                return (
                  <li key={row.id}>
                    <Link
                      href={`/u/${row.username}`}
                      className={cn(
                        "grid grid-cols-[36px_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-subtle sm:grid-cols-[48px_1fr_100px_100px_100px_100px]",
                        isViewer && "bg-subtle",
                      )}
                    >
                      <span className="text-[11.5px] tabular-nums text-muted">
                        {String(rank).padStart(2, "0")}
                      </span>
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar name={row.username} src={row.avatar_url} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-[12.5px] font-medium">
                            @{row.username}
                            {isViewer && <span className="ml-2 text-[10px] text-muted">вы</span>}
                          </span>
                          <span className="block text-[10px] text-muted sm:hidden">
                            {plural(row.points, "очко", "очка", "очков")} · {plural(row.votes, "суждение", "суждения", "суждений")}
                          </span>
                        </span>
                      </span>
                      <span className="hidden text-right text-[12px] tabular-nums sm:block">
                        {formatNumber(row.points)}
                      </span>
                      <span className="hidden text-right text-[12px] tabular-nums text-muted sm:block">
                        {formatNumber(row.votes)}
                      </span>
                      <span className="hidden text-right text-[12px] tabular-nums text-muted sm:block">
                        {row.works}
                      </span>
                      <span className="hidden text-right text-[12px] tabular-nums text-muted sm:block">
                        {row.streak > 0 ? `${row.streak} дн.` : "—"}
                      </span>
                      <span className="text-right text-[12px] font-medium tabular-nums sm:hidden">
                        {formatNumber(row.points)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-subtle/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-[12px] text-muted">
          <Sparkles size={14} />
          {viewer ? (
            viewerIndex >= 0 ? (
              <>
                У вас {plural(rows[viewerIndex]!.points, "очко", "очка", "очков")} за этот период — <span className="font-medium text-ink">#{viewerIndex + 1} место</span>.
              </>
            ) : (
              <>
                В этом периоде вы не вошли в топ-{rows.length}. Оцените несколько
                работ, чтобы подняться выше.
              </>
            )
          ) : (
            <>Войдите, чтобы сохранить очки, серии и место в рейтинге.</>
          )}
        </p>
        <Link
          href={viewer ? "/play" : "/signup"}
          className="shrink-0 text-[12px] font-medium text-ink underline underline-offset-4"
        >
          {viewer ? "Оценить ещё работу" : "Создать аккаунт"}
        </Link>
      </div>
    </div>
  );
}
