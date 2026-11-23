import { NextResponse } from "next/server";

import { clientIp, getParticipant } from "@/lib/auth";
import { getNextPlayArtwork } from "@/lib/queries";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`next:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, message: "Слишком быстро. Попробуйте чуть позже." }, { status: 429 });
  }
  const participant = await getParticipant();
  const exclude = new URL(request.url).searchParams.get("exclude") ?? undefined;
  const card = getNextPlayArtwork(participant, exclude);
  return NextResponse.json({ ok: true, card });
}
