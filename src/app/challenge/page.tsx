import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import { PlayClient } from "@/components/artwork/play-client";
import { buttonClasses } from "@/components/ui/button";
import { getParticipant } from "@/lib/auth";
import { getChallengeCards, getChallengeProgress } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily challenge",
  description:
    "Five works, one day, one shared challenge. Judge all five and compare your answers with the world.",
  alternates: { canonical: "/challenge" },
};

export default async function ChallengePage() {
  const participant = await getParticipant();
  const progress = getChallengeProgress(participant);
  const allCards = getChallengeCards();
  const remaining = allCards.filter((card) => !progress.voted.includes(card.id));

  return (
    <>
      <div className="border-b border-line bg-subtle/50">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <CalendarDays size={13} />
              Daily challenge
            </p>
            <h1 className="display mt-3 text-[clamp(1.8rem,4vw,3rem)] leading-[1]">
              Five works. One shared question.
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted">
              Everyone gets the same five works today. Judge each one, then compare
              your answers with the world. Complete all five for a bonus.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5">
              <Sparkles size={12} />
              +25 bonus
            </span>
            <Link href="/leaderboard" className="link-underline text-ink">
              Leaderboard <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {remaining.length === 0 ? (
        <div className="container-narrow py-16 text-center sm:py-24">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
            <Sparkles size={22} />
          </span>
          <h2 className="display mt-6 text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.98]">
            Today&apos;s challenge is complete.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
            You judged all five works. A new set arrives tomorrow. In the meantime,
            keep exploring the gallery or submit a work of your own.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/play" className={buttonClasses()}>
              Keep playing
            </Link>
            <Link href="/discover" className={buttonClasses({ variant: "secondary" })}>
              Browse the gallery
            </Link>
          </div>
        </div>
      ) : (
        <PlayClient
          initialCard={null}
          mode="challenge"
          challengeCards={remaining}
          signedIn={Boolean(participant.user)}
          challengeVotedCount={progress.voted.length}
          challengeAlreadyComplete={progress.complete}
          userPoints={participant.user?.points ?? 0}
        />
      )}
    </>
  );
}
