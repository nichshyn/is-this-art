import type { Metadata } from "next";

import { PlayClient } from "@/components/artwork/play-client";
import { getParticipant } from "@/lib/auth";
import { getArtworkBySlug, getNextPlayArtwork, hasVoted } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Play",
  description:
    "One artwork. One question. Three answers. Judge the work, then see what the world thinks.",
  alternates: { canonical: "/play" },
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ artwork?: string }>;
}) {
  const params = await searchParams;
  const participant = await getParticipant();
  let card = null;

  if (params.artwork) {
    const artwork = getArtworkBySlug(params.artwork);
    if (artwork && !hasVoted(participant, artwork.id)) {
      card = {
        id: artwork.id,
        imageUrl: artwork.image_url,
        imageWidth: artwork.image_width,
        imageHeight: artwork.image_height,
      };
    }
  }

  card ??= getNextPlayArtwork(participant);

  return (
    <PlayClient
      initialCard={card}
      signedIn={Boolean(participant.user)}
      userPoints={participant.user?.points ?? 0}
    />
  );
}
