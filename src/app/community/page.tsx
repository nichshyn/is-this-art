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
import { formatNumber, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Meet the people looking closely: recent submissions, conversations and the members shaping the gallery.",
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
              <p className="eyebrow">The community</p>
              <h1 className="display mt-4 text-[clamp(2.7rem,6.4vw,5.4rem)] leading-[0.9]">
                A room full of
                <br />
                second opinions.
              </h1>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
                Some people come to look. Some come to argue. Some come to submit
                the thing they made at 2am. All of them are part of the experiment.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className={buttonClasses()}>
                  Join the community <ArrowRight size={15} />
                </Link>
                <Link href="/submit" className={buttonClasses({ variant: "secondary" })}>
                  Submit a work
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {[
                { icon: <Users size={15} />, label: "Members", value: stats.users },
                { icon: <MessageSquare size={15} />, label: "Comments", value: stats.comments },
                { icon: <Sparkles size={15} />, label: "Judgments", value: stats.votes },
                { icon: <Trophy size={15} />, label: "Works", value: stats.artworks },
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
          eyebrow="From the community"
          title="Works submitted by people, not institutions."
          description="Every approved upload is reviewed by a moderator, then opened to the room."
          href="/discover?sort=newest"
          linkLabel="Newest additions"
        />
        {data.works.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line py-16 text-center">
            <p className="text-[14px] font-medium">No community submissions yet.</p>
            <p className="mt-2 text-[12.5px] text-muted">
              Be the first to put something of your own in front of the room.
            </p>
            <Link href="/submit" className={buttonClasses({ size: "sm", className: "mt-5" })}>
              Submit artwork
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
              <p className="eyebrow">Latest conversations</p>
              <Link href="/discover" className="text-[11px] text-muted hover:text-ink">
                Find a work to discuss
              </Link>
            </div>
            <ul className="mt-5 space-y-2">
              {data.comments.length === 0 && (
                <li className="rounded-2xl border border-dashed border-line p-6 text-center text-[12.5px] text-muted">
                  No comments yet. The first opinion is always the loneliest.
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
                        on {comment.artwork_title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">Members to follow</p>
              <Link href="/leaderboard" className="text-[11px] text-muted hover:text-ink">
                Full leaderboard
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
                        {formatNumber(member.points)} pts · {member.votes} judgments
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
              title: "Look first, read later",
              text: "In Play, the title, artist and history stay hidden until you have made your call.",
            },
            {
              title: "One person, one judgment",
              text: "Votes are final and enforced at the database level. You cannot stuff the ballot.",
            },
            {
              title: "No house style",
              text: "The gallery mixes public-domain classics, community uploads and clearly labelled demos.",
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
