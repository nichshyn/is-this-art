import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Crown,
  Flame,
  Images,
  Layers,
  MessageSquare,
  Palette,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";

import { ArtworkCard } from "@/components/artwork/artwork-card";
import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { FollowButton } from "@/components/artwork/follow-button";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getCurrentUser } from "@/lib/auth";
import { VOTE_SHORT } from "@/lib/constants";
import {
  getAllAchievements,
  getPublicUser,
  getUserAchievements,
  getUserByUsername,
  getUserRecentVotes,
  getUserStats,
  getUserWorks,
  isFollowing,
} from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = getPublicUser(username);
  if (!user) return { title: "Member not found" };
  return {
    title: `@${user.username}`,
    description: user.bio || `The gallery profile of @${user.username} on IS THIS ART?`,
    alternates: { canonical: `/u/${user.username}` },
  };
}

const ICONS: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={16} strokeWidth={1.7} />,
  layers: <Layers size={16} strokeWidth={1.7} />,
  compass: <Compass size={16} strokeWidth={1.7} />,
  trophy: <Trophy size={16} strokeWidth={1.7} />,
  flame: <Flame size={16} strokeWidth={1.7} />,
  calendar: <CalendarDays size={16} strokeWidth={1.7} />,
  crown: <Crown size={16} strokeWidth={1.7} />,
  palette: <Palette size={16} strokeWidth={1.7} />,
  gallery: <Images size={16} strokeWidth={1.7} />,
  message: <MessageSquare size={16} strokeWidth={1.7} />,
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const account = getUserByUsername(username);
  if (!account || account.is_blocked) notFound();
  const user = getPublicUser(username);
  if (!user) notFound();

  const viewer = await getCurrentUser();
  const isOwn = viewer?.id === user.id;
  const stats = getUserStats(user.id);
  const earned = getUserAchievements(user.id);
  const all = getAllAchievements();
  const works = getUserWorks(user.id);
  const recentVotes = getUserRecentVotes(user.id, 6);
  const following = viewer && !isOwn ? isFollowing(viewer.id, user.id) : false;
  const earnedIds = new Set(earned.map((item) => item.id));
  const earnedMap = new Map(earned.map((item) => [item.id, item.earned_at]));

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <Avatar name={user.username} src={user.avatar_url} size="xl" />
            <h1 className="display mt-5 text-[clamp(1.8rem,3.4vw,2.4rem)] leading-[1.02]">
              @{user.username}
            </h1>
            <p className="mt-2 text-[11.5px] text-muted">
              Joined {formatDate(user.created_at)}
              {user.role === "admin" ? " · Curator" : ""}
            </p>
            {user.bio && (
              <p className="mt-4 text-[13px] leading-relaxed text-ink/80">{user.bio}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {isOwn ? (
                <Link href="/settings" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                  <Settings size={13} /> Edit profile
                </Link>
              ) : (
                <FollowButton
                  username={user.username}
                  initialFollowing={following}
                  signedIn={Boolean(viewer)}
                />
              )}
              <Link href="/play" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                Judge a work <ArrowUpRight size={13} />
              </Link>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5">
              {[
                ["Points", formatNumber(user.points)],
                ["Streak", `${user.streak} ${user.streak === 1 ? "day" : "days"}`],
                ["Judgments", formatNumber(stats.votes)],
                ["Works", formatNumber(stats.works)],
                ["Followers", formatNumber(stats.followers)],
                ["Following", formatNumber(stats.following)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="text-[19px] font-semibold tracking-tight tabular-nums">{value}</dd>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-3 rounded-2xl border border-line p-5">
            <p className="eyebrow">Achievements</p>
            <p className="mt-2 text-[11.5px] text-muted">
              {earned.length} of {all.length} unlocked
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {all.map((achievement) => {
                const unlocked = earnedIds.has(achievement.id);
                return (
                  <li
                    key={achievement.id}
                    title={achievement.description}
                    className={`rounded-xl border p-2.5 ${
                      unlocked
                        ? "border-line bg-subtle text-ink"
                        : "border-dashed border-line text-muted opacity-55"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] font-medium leading-tight">
                      {ICONS[achievement.icon] ?? <Trophy size={16} />}
                      {achievement.name}
                    </span>
                    {unlocked && (
                      <span className="mt-1 block text-[9px] text-muted">
                        {formatDate(earnedMap.get(achievement.id) ?? "")}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          <section>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="display text-[clamp(1.5rem,2.8vw,2.1rem)]">Submitted works</h2>
              <span className="text-[11px] text-muted">{stats.works} approved</span>
            </div>
            {works.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-line py-14 text-center">
                <p className="text-[13px] font-medium">Nothing submitted yet.</p>
                <p className="mt-1.5 text-[12px] text-muted">
                  {isOwn
                    ? "Your first approved work is waiting in the queue."
                    : `@${user.username} has not shared a work yet.`}
                </p>
                {isOwn && (
                  <Link href="/submit" className={buttonClasses({ size: "sm", className: "mt-4" })}>
                    Submit a work
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-5 grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                {works.map((artwork, index) => (
                  <Reveal key={artwork.id} delay={(index % 3) * 0.04}>
                    <ArtworkCard artwork={artwork} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          <section className="mt-14">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="display text-[clamp(1.5rem,2.8vw,2.1rem)]">Recent judgments</h2>
              <Link href="/play" className="text-[11.5px] text-muted hover:text-ink">
                Judge something yourself
              </Link>
            </div>
            {recentVotes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-line py-12 text-center">
                <p className="text-[13px] font-medium">No judgments yet.</p>
                <p className="mt-1.5 text-[12px] text-muted">
                  Every opinion starts with a first look.
                </p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {recentVotes.map((vote) => (
                  <li key={`${vote.slug}-${vote.created_at}`}>
                    <Link
                      href={`/artwork/${vote.slug}`}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:bg-subtle"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-subtle">
                        <ArtworkThumb src={vote.image_url} alt={vote.title} sizes="56px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium">{vote.title}</p>
                        <p className="truncate text-[10.5px] text-muted">{vote.artist_name}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-subtle px-2 py-1 text-[9.5px] text-muted">
                        {VOTE_SHORT[vote.vote_type]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
