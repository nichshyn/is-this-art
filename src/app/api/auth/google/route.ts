import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { googleOAuthConfigured } from "@/lib/auth";
import { OAUTH_STATE_COOKIE } from "@/lib/constants";
import { randomToken } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (!googleOAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google-not-configured", origin));
  }
  const state = randomToken(20);
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });
  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
