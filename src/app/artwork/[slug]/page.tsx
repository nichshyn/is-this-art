import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Info,
  MapPin,
} from "lucide-react";

import { ArtworkCard } from "@/components/artwork/artwork-card";
import { ArtworkImage, ArtworkThumb } from "@/components/artwork/artwork-image";
import { CommentsSection } from "@/components/artwork/comments-section";
import { LikeButton } from "@/components/artwork/like-button";
import { ReportDialog } from "@/components/artwork/report-dialog";
import { ShareButton } from "@/components/artwork/share-button";
import { VoteBars } from "@/components/artwork/vote-bars";
import { SectionHeading } from "@/components/site/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORY_MAP, SITE, VOTE_SHORT } from "@/lib/constants";
import {
  getArtworkBySlug,
  getComments,
  getLikeState,
  getSimilarArtworks,
  getVoteType,
  getUserById,
  hasVoted,
} from "@/lib/queries";
import { absoluteUrl, plural, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) return { title: "Работа не найдена" };
  const artist = artwork.is_anonymous ? "Анонимно" : artwork.artist_name;
  return {
    title: `${artwork.title} — ${artist}`,
    description: truncate(artwork.description, 170),
    alternates: { canonical: `/artwork/${artwork.slug}` },
    openGraph: {
      title: `${artwork.title} — ${artist}`,
      description: truncate(artwork.description, 170),
      type: "article",
      images: [{ url: artwork.image_url, width: artwork.image_width, height: artwork.image_height, alt: artwork.title }],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) notFound();

  const user = await getCurrentUser();
  const participant = {
    userId: user?.id ?? null,
    guestId: null,
  };
  const voteType = user ? getVoteType(participant, artwork.id) : null;
  const comments = getComments(artwork.id);
  const similar = getSimilarArtworks(artwork, 4);
  const like = getLikeState(artwork.id, user?.id ?? null);
  const submitter = artwork.submitted_by ? getUserById(artwork.submitted_by) : null;
  const category = CATEGORY_MAP[artwork.category];
  const displayArtist = artwork.is_anonymous ? "Анонимно" : artwork.artist_name;
  const showSubmitter = submitter && !artwork.is_anonymous;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    creator: { "@type": "Person", name: displayArtist },
    dateCreated: artwork.creation_year ?? undefined,
    description: artwork.description,
    image: absoluteUrl(artwork.image_url),
    url: absoluteUrl(`/artwork/${artwork.slug}`),
    artform: category?.name ?? artwork.category,
    locationCreated: artwork.country ?? undefined,
    isAccessibleForFree: true,
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={13} />
          Обзор
        </Link>
        <div className="flex items-center gap-4">
          <ShareButton title={artwork.title} />
          <ReportDialog artworkId={artwork.id} signedIn={Boolean(user)} />
        </div>
      </div>

      <div className="mt-6 grid items-start gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] lg:gap-14">
        <div className="self-start lg:sticky lg:top-24">
          <div className="relative flex min-h-[38vh] items-center justify-center overflow-hidden rounded-3xl border border-line bg-subtle p-3 sm:min-h-[46vh] sm:p-8">
            <ArtworkImage
              src={artwork.image_url}
              alt={`${artwork.title} — ${displayArtist}`}
              width={artwork.image_width}
              height={artwork.image_height}
              priority
              className="max-h-[72vh] rounded-lg shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-2 text-[10px] leading-relaxed text-muted">
            <span className="max-w-[70%]">
              Изображение: {artwork.image_credit ?? "Демо-материал, созданный для IS THIS ART?"}
            </span>
            <span>{artwork.image_license ?? "Демо-материал"}</span>
          </div>
          {artwork.image_source_url && (
            <a
              href={artwork.image_source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted underline underline-offset-2 hover:text-ink"
            >
              Открыть источник и лицензию <ExternalLink size={9} />
            </a>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Link
                href={`/discover?category=${artwork.category}`}
                className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
              >
                {category.name}
              </Link>
            )}
            {artwork.is_demo === 1 && (
              <span className="rounded-full bg-subtle px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                Демо-материал
              </span>
            )}
            {artwork.is_ai_generated === 1 && (
              <span className="rounded-full bg-subtle px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                Создано с помощью ИИ
              </span>
            )}
            {artwork.is_verified === 1 && artwork.is_demo !== 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                <BadgeCheck size={11} />
                Проверенный источник
              </span>
            )}
          </div>

          <h1 className="display mt-4 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.98] text-balance">
            {artwork.title}
          </h1>
          <p className="mt-3 text-[14px] text-muted">
            {displayArtist}
            {artwork.creation_year ? ` · ${artwork.creation_year}` : ""}
            {artwork.country ? ` · ${artwork.country}` : ""}
          </p>

          <p className="mt-6 text-[14.5px] leading-[1.8] text-ink/85">{artwork.description}</p>

          <div className="mt-7 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] font-medium">Что думают другие</p>
              <p className="text-[11px] tabular-nums text-muted">
                {plural(artwork.vote_count, "суждение", "суждения", "суждений")}
              </p>
            </div>
            {artwork.vote_count > 0 ? (
              <VoteBars
                stats={{
                  total: artwork.vote_count,
                  yes: artwork.yes_count,
                  no: artwork.no_count,
                  unsure: artwork.unsure_count,
                  yesPct: artwork.yes_pct,
                  noPct: artwork.no_pct,
                  unsurePct: artwork.unsure_pct,
                }}
                yourVote={voteType}
                className="mt-4"
              />
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">
                Суждений пока нет. Станьте первым, кто ответит.
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
              {user && voteType ? (
                <span className="inline-flex items-center gap-2 text-[12px] text-muted">
                  <Info size={13} />
                  Вы ответили: <span className="font-medium text-ink">{VOTE_SHORT[voteType].toLowerCase()}</span>
                </span>
              ) : (
                <Link
                  href={`/play?artwork=${artwork.slug}`}
                  className={buttonClasses({ size: "sm" })}
                >
                  Выскажите своё суждение
                  <ArrowRight size={14} />
                </Link>
              )}
              <LikeButton
                artworkId={artwork.id}
                initialLiked={like.liked}
                initialCount={like.count}
                signedIn={Boolean(user)}
              />
            </div>
          </div>

          {artwork.history && (
            <div className="mt-7 border-t border-line pt-5">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                История
              </h2>
              <p className="mt-3 text-[13.5px] leading-[1.8] text-ink/80">{artwork.history}</p>
            </div>
          )}

          {artwork.fun_fact && (
            <div className="mt-6 rounded-2xl bg-subtle p-5">
              <p className="eyebrow">Любопытный факт</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/80">{artwork.fun_fact}</p>
            </div>
          )}

          <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-line pt-5 text-[12px]">
            {artwork.creation_year && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Год</dt>
                <dd className="mt-1">{artwork.creation_year}</dd>
              </div>
            )}
            {artwork.country && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Страна</dt>
                <dd className="mt-1">{artwork.country}</dd>
              </div>
            )}
            {artwork.location && (
              <div className="col-span-2">
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Местоположение</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5">
                  <MapPin size={11} className="text-muted" />
                  {artwork.location}
                </dd>
              </div>
            )}
          </dl>

          {showSubmitter && (
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line p-3">
              <Avatar name={submitter.username} src={submitter.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Кто предложил</p>
                <Link href={`/u/${submitter.username}`} className="text-[12.5px] font-medium hover:underline">
                  @{submitter.username}
                </Link>
              </div>
              <Link href={`/u/${submitter.username}`} className="text-[11px] text-muted hover:text-ink">
                Профиль
              </Link>
            </div>
          )}

          <p className="mt-6 text-[10px] leading-relaxed text-muted">
            Эта платформа фиксирует мнения, а не факты о качестве. Проценты отражают
            голоса всех, кто оценил эту работу.
          </p>
        </div>
      </div>

      <CommentsSection
        artworkId={artwork.id}
        comments={comments}
        signedIn={Boolean(user)}
        currentUserId={user?.id}
        isAdmin={user?.role === "admin"}
      />

      {similar.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            eyebrow="Продолжайте смотреть"
            title="Похожие работы"
            href={`/discover?category=${artwork.category}`}
            linkLabel={category?.name ?? "Ещё"}
          />
          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.04}>
                <ArtworkCard artwork={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
