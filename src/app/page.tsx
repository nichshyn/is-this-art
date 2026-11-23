import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  Scale,
  Sparkles,
} from "lucide-react";

import { ArtworkCard } from "@/components/artwork/artwork-card";
import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { MiniVoteBar } from "@/components/artwork/vote-bars";
import { SectionHeading } from "@/components/site/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/constants";
import {
  getArtworkOfTheDay,
  getChallengeCards,
  getCommunityData,
  getControversialArtworks,
  getSiteStats,
  getTrendingArtworks,
} from "@/lib/queries";
import { formatNumber, plural, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IS THIS ART? — Кто решает, что такое искусство?",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const stats = getSiteStats();
  const trending = getTrendingArtworks(6);
  const controversial = getControversialArtworks(4);
  const featured = getArtworkOfTheDay() ?? trending[0] ?? null;
  const challenge = getChallengeCards();
  const community = getCommunityData();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_72%_0%,rgba(23,23,23,0.055),transparent_70%)] dark:bg-[radial-gradient(60%_45%_at_72%_0%,rgba(255,255,255,0.06),transparent_70%)]" />
        <div className="container-page pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
                  </span>
                  Социальный эксперимент о вкусе
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="display mt-6 text-[clamp(3.1rem,7.4vw,7rem)] leading-[0.86]">
                  КТО
                  <br />
                  РЕШАЕТ,
                  <br />
                  ЧТО ТАКОЕ ИСКУССТВО?
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted">
                  Исследуйте границы искусства. Выскажите своё мнение. Узнайте,
                  что думают другие.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/play" className={buttonClasses({ size: "lg" })}>
                    НАЧАТЬ ОБЗОР
                    <ArrowRight size={17} />
                  </Link>
                  <Link
                    href="/discover"
                    className={buttonClasses({ variant: "secondary", size: "lg" })}
                  >
                    Открыть галерею
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[11px] text-muted">
                  <div>
                    <dt className="inline">Работы </dt>
                    <dd className="inline font-medium text-ink">{stats.artworks}</dd>
                  </div>
                  <div>
                    <dt className="inline">Суждения </dt>
                    <dd className="inline font-medium text-ink">{formatNumber(stats.votes)}</dd>
                  </div>
                  <div>
                    <dt className="inline">Страны </dt>
                    <dd className="inline font-medium text-ink">{stats.countries}</dd>
                  </div>
                  <div>
                    <dt className="inline">Сегодня </dt>
                    <dd className="inline font-medium text-ink">{stats.todayVotes}</dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            {featured && (
              <Reveal delay={0.12} className="relative">
                <Link href={`/artwork/${featured.slug}`} className="group block">
                  <div className="art-shadow relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-subtle">
                    <ArtworkThumb
                      src={featured.image_url}
                      alt={`${featured.title} — ${featured.artist_name}`}
                      priority
                      sizes="(max-width: 1024px) 100vw, 44vw"
                      className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-20 text-white">
                      <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/65">
                        Работа дня
                      </p>
                      <h2 className="mt-2 text-[24px] font-medium tracking-tight">
                        {featured.title}
                      </h2>
                      <p className="mt-1 text-[12px] text-white/70">
                        {featured.artist_name}
                        {featured.creation_year ? ` · ${featured.creation_year}` : ""}
                        {featured.country ? ` · ${featured.country}` : ""}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                      {featured.description}
                    </p>
                    <Link
                      href={`/play?artwork=${featured.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink"
                    >
                      Выскажите своё суждение
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[26px] font-semibold tracking-tight">
                      {featured.vote_count ? `${featured.yes_pct}%` : "—"}
                    </p>
                    <p className="text-[10px] text-muted">считают, что это искусство</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-subtle/60">
        <div className="container-page grid gap-8 py-10 sm:grid-cols-3 sm:py-12">
          {[
            {
              icon: <Eye size={17} strokeWidth={1.6} />,
              number: "01",
              title: "Смотрите внимательно",
              text: "По одному изображению — без подписи, цены и имени автора.",
            },
            {
              icon: <Scale size={17} strokeWidth={1.6} />,
              number: "02",
              title: "Выносите суждение",
              text: "Искусство, не искусство или не уверены. Правильного ответа нет — есть только ваш.",
            },
            {
              icon: <Sparkles size={17} strokeWidth={1.6} />,
              number: "03",
              title: "Узнайте мнение других",
              text: "После голоса открываются история работы и результаты в реальном времени.",
            },
          ].map((item, index) => (
            <Reveal key={item.number} delay={index * 0.06} className="flex gap-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink">
                {item.icon}
              </span>
              <div>
                <p className="text-[10px] tabular-nums text-muted">{item.number}</p>
                <h2 className="mt-1 text-[13.5px] font-medium">{item.title}</h2>
                <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="Сейчас обсуждают"
          title="Работы, вокруг которых спорят."
          description="Все проценты обновляются в реальном времени. Каждое суждение — ответ одного человека, а не приговор."
          href="/discover"
          linkLabel="Все работы"
        />
        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((artwork, index) => (
            <Reveal key={artwork.id} delay={(index % 3) * 0.05}>
              <ArtworkCard artwork={artwork} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page">
        <Reveal>
          <div className="noise relative overflow-hidden rounded-[32px] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-14 lg:px-14">
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-paper/45">
                  Задание дня
                </p>
                <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.4vw,3.7rem)] leading-[0.98]">
                  Сможете распознать настоящее современное искусство?
                </h2>
                <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-paper/55">
                  Пять изображений. Пять суждений. Одно общее задание. Правильных
                  ответов нет — есть только то, что думаете вы и другие.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/challenge"
                    className={buttonClasses({
                      variant: "secondary",
                      size: "md",
                      className: "border-transparent bg-paper text-ink",
                    })}
                  >
                    Пройти задание дня
                    <ArrowRight size={15} />
                  </Link>
                  <span className="text-[11px] text-paper/40">Пять работ · около 2 минут</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {challenge.map((card, index) => (
                  <Link
                    key={card.id}
                    href="/challenge"
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-paper/10"
                    aria-label={`Изображение задания ${index + 1}`}
                  >
                    <Image
                      src={card.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 18vw, 9vw"
                      className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <span className="absolute left-1.5 top-1.5 text-[9px] font-medium text-white/80">
                      0{index + 1}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="Самые спорные"
          title="Мнения делятся почти пополам."
          description="Здесь голоса «за» и «против» ближе всего друг к другу."
          href="/discover?sort=controversial"
          linkLabel="Самые спорные"
        />
        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {controversial.map((artwork, index) => (
            <Reveal key={artwork.id} delay={(index % 2) * 0.05}>
              <Link
                href={`/artwork/${artwork.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 transition-colors hover:bg-subtle"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-subtle sm:h-24 sm:w-24">
                  <ArtworkThumb
                    src={artwork.image_url}
                    alt={artwork.title}
                    sizes="96px"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[13.5px] font-medium">{artwork.title}</h3>
                  <p className="truncate text-[11.5px] text-muted">{artwork.artist_name}</p>
                  <MiniVoteBar
                    stats={{
                      total: artwork.vote_count,
                      yes: artwork.yes_count,
                      no: artwork.no_count,
                      unsure: artwork.unsure_count,
                      yesPct: artwork.yes_pct,
                      noPct: artwork.no_pct,
                      unsurePct: artwork.unsure_pct,
                    }}
                    className="mt-2.5"
                  />
                  <p className="mt-1.5 text-[10.5px] text-muted">
                    {artwork.yes_pct} % искусство · {artwork.no_pct} % не искусство ·{" "}
                    {plural(artwork.vote_count, "голос", "голоса", "голосов")}
                  </p>
                </div>
                <ArrowUpRight size={15} className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-subtle/50">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
          <div>
            <p className="eyebrow">Идея</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1] text-balance">
              Правильных ответов нет.
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-[1.8] text-muted">
              IS THIS ART? не говорит вам, что такое искусство. Он просит заметить
              свою реакцию, а потом показывает реакции остальных. Сайт — это
              запись вкуса в движении, а не суд.
            </p>
            <Link href="/about" className="link-underline mt-6 inline-flex text-[12.5px] font-medium">
              Читать манифест
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="eyebrow">От сообщества</p>
              <Link href="/community" className="text-[11.5px] text-muted hover:text-ink">
                Перейти в сообщество
              </Link>
            </div>
            <ul className="mt-5 space-y-2">
              {community.comments.slice(0, 4).map((comment) => (
                <li key={comment.id}>
                  <Link
                    href={`/artwork/${comment.artwork_slug}`}
                    className="group flex gap-3 rounded-2xl border border-line bg-paper p-3.5 transition-colors hover:bg-surface"
                  >
                    <Avatar name={comment.username} src={comment.avatar_url} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-medium">
                        @{comment.username}
                        <span className="ml-2 font-normal text-muted">{timeAgo(comment.created_at)}</span>
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
        </div>
      </section>

      <section className="container-page pb-8 pt-20 sm:pb-12 sm:pt-24">
        <Reveal>
          <div className="rounded-[32px] border border-line bg-surface px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="eyebrow">Открытый приём</p>
            <h2 className="display mx-auto mt-4 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] leading-[0.98]">
              Ваша работа — искусство?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
              Пришлите изображение, название и историю. Каждая загрузка проходит
              проверку модератора, прежде чем попасть в галерею.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className={buttonClasses({ size: "lg" })}>
                Предложить работу
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/community" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                Познакомиться с сообществом
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
