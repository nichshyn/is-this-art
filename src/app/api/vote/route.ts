import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, ensureGuestId, getCurrentUser, isSameOrigin } from "@/lib/auth";
import { VOTE_TYPES } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { castVote } from "@/lib/voting";

export const runtime = "nodejs";

const bodySchema = z.object({
  artworkId: z.string().min(1),
  voteType: z.enum(VOTE_TYPES),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Invalid origin." }, { status: 403 });
  }
  const ip = clientIp(request);
  const limited = rateLimit(`vote:${ip}`, 80, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many votes. Take a breath and try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid vote." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  const guestId = user ? null : await ensureGuestId();
  const result = castVote({
    artworkId: parsed.data.artworkId,
    voteType: parsed.data.voteType,
    userId: user?.id ?? null,
    guestId,
  });

  if (!result.ok) {
    const status =
      result.code === "not_found"
        ? 404
        : result.code === "already_voted"
          ? 409
          : result.code === "blocked"
            ? 403
            : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
