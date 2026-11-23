import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { ArtworkCard } from "@/components/artwork/artwork-card";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import {
  getCommunityData,
  getCommunityMembers,
  getSiteStats,
} from "@/lib/queries";
import { formatNumber, plural, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Сообщество",
  description:
    "Познакомьтесь с теми, кто смотрит внимательно: новые работы, обсуждения и участники, которые формируют галерею.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  const data = getCommunityData();
  const members = getCommunityMembers(18);
  const stats = getSiteStats();

  return (
    <>
      <section className="border-b border-line bg-subtle/40">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow">Сообщество</p>
              <h1 className="display mt-4 text-[clamp(2.7rem,6.4vw,5.4rem)] leading-[0.9]">
                Здесь полно
                <br />
                других мнений.
              </h1>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
                Кто-то приходит посмотреть. Кто-то — поспорить. Кто-то — показать
                то, что сделал в два часа ночи. Все они — часть эксперимента.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className={buttonClasses()}>
                  Присоединиться к сообществу <ArrowRight size={15} />
                </Link>
                <Link href="/submit" className={buttonClasses({ variant: "secondary" })}>
                  Предложить работу
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {[
                { icon: <Users size={15} />, label: "Участники", value: stats.users },
                { icon: <MessageSquare size={15} />, label: "Комментарии", value: stats.comments },
                { icon: <Sparkles size={15} />, label: "Суждения", value: stats.votes },
                { icon: <Trophy size={15} />, label: "Работы", value: stats.artworks },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-line bg-surface p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-subtle text-ink">
                    {item.icon}
                  </span>
                  <dd className="mt-4 text-[26px] font-semibold tracking-tight tabular-nums">
                    {formatNumber(item.value)}
                  </dd>
                  <dt className="text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="От сообщества"
          title="Работы, предложенные людьми, а не организациями."
          description="Каждая одобренная загрузка проходит проверку модератора, а затем открывается для всех."
          href="/discover?sort=newest"
          linkLabel="Новые поступления"
        />
        {data.works.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line py-16 text-center">
            <p className="text-[14px] font-medium">Пока нет работ от сообщества.</p>
            <p className="mt-2 text-[12.5px] text-muted">
              Станьте первым, кто покажет свою работу всем.
            </p>
            <Link href="/submit" className={buttonClasses({ size: "sm", className: "mt-5" })}>
              Предложить работу
            </Link>
          </div>
        ) : (
          <div className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {data.works.map((artwork, index) => (
              <Reveal key={artwork.id} delay={(index % 4) * 0.04}>
                <ArtworkCard artwork={artwork} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-subtle/40">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:py-20">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">Последние обсуждения</p>
              <Link href="/discover" className="text-[11px] text-muted hover:text-ink">
                Найти работу для обсуждения
              </Link>
            </div>
            <ul className="mt-5 space-y-2">
              {data.comments.length === 0 && (
                <li className="rounded-2xl border border-dashed border-line p-6 text-center text-[12.5px] text-muted">
                  Комментариев пока нет. Первое мнение всегда самое одинокое.
                </li>
              )}
              {data.comments.map((comment) => (
                <li key={comment.id}>
                  <Link
                    href={`/artwork/${comment.artwork_slug}`}
                    className="group flex gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:bg-paper"
                  >
                    <Avatar name={comment.username} src={comment.avatar_url} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-medium">
                        @{comment.username}
                        <span className="ml-2 font-normal text-muted">
                          {timeAgo(comment.created_at)}
                        </span>
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink/80">
                        {comment.content}
                      </p>
                      <p className="mt-1 truncate text-[10.5px] text-muted">
                        к работе {comment.artwork_title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">Участники, на которых стоит подписаться</p>
              <Link href="/leaderboard" className="text-[11px] text-muted hover:text-ink">
                Вся таблица лидеров
              </Link>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {members.map((member, index) => (
                <li key={member.id}>
                  <Link
                    href={`/u/${member.username}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:bg-paper"
                  >
                    <span className="w-5 shrink-0 text-[10px] tabular-nums text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Avatar name={member.username} src={member.avatar_url} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium">@{member.username}</p>
                      <p className="text-[10.5px] text-muted">
                        {plural(member.points, "очко", "очка", "очков")} · {plural(member.votes, "суждение", "суждения", "суждений")}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={13}
                      className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Сначала смотрите, потом читайте",
              text: "В игре название, автор и история скрыты, пока вы не вынесете суждение.",
            },
            {
              title: "Один человек — одно суждение",
              text: "Голоса окончательны и закреплены на уровне базы данных. Накрутить результат нельзя.",
            },
            {
              title: "Никакого единого стиля",
              text: "В галерее соседствуют классика из общественного достояния, работы сообщества и явно помеченные демо-материалы.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-line p-5">
                <p className="text-[10px] tabular-nums text-muted">0{index + 1}</p>
                <h2 className="mt-2 text-[13.5px] font-medium">{item.title}</h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
