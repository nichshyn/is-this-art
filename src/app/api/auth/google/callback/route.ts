import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSession, googleOAuthConfigured } from "@/lib/auth";
import { OAUTH_STATE_COOKIE } from "@/lib/constants";
import { newId, queryOne } from "@/lib/db";
import { getUserByEmail } from "@/lib/queries";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

interface GoogleProfile {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function usernameFromEmail(email: string): string {
  const base =
    slugify(email.split("@")[0] || "collector").replace(/-/g, "_").slice(0, 18) ||
    "collector";
  let candidate = base;
  let i = 2;
  while (queryOne("SELECT 1 FROM users WHERE username = ?", candidate)) {
    candidate = `${base}${i++}`.slice(0, 24);
  }
  return candidate;
}

export async function GET(request: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const expected = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete(OAUTH_STATE_COOKIE);

  if (!googleOAuthConfigured() || !code || !state || !expected || state !== expected) {
    return NextResponse.redirect(new URL("/login?error=google-state", origin));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) throw new Error("Token exchange failed.");
    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) throw new Error("No access token.");

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${token.access_token}` } },
    );
    if (!profileResponse.ok) throw new Error("Profile request failed.");
    const profile = (await profileResponse.json()) as GoogleProfile;
    const email = profile.email?.toLowerCase();
    if (!email || !profile.email_verified) throw new Error("Email not verified.");

    let user = getUserByEmail(email);
    if (!user) {
      const id = newId("usr_");
      const username = usernameFromEmail(email);
      const { getDb } = await import("@/lib/db");
      getDb()
        .prepare(
          `INSERT INTO users
           (id, username, email, password_hash, avatar_url, bio, role, points, streak, longest_streak, last_vote_date, is_blocked, is_demo, created_at)
           VALUES (?, ?, ?, NULL, ?, NULL, 'user', 0, 0, 0, NULL, 0, 0, ?)`,
        )
        .run(
          id,
          username,
          email,
          profile.picture ?? null,
          new Date().toISOString(),
        );
      user = getUserByEmail(email);
    }
    if (!user) throw new Error("Could not create account.");
    if (user.is_blocked) {
      return NextResponse.redirect(new URL("/login?error=blocked", origin));
    }
    await createSession(user.id);
    return NextResponse.redirect(new URL("/play?welcome=1", origin));
  } catch (error) {
    console.error("[google-oauth]", error);
    return NextResponse.redirect(new URL("/login?error=google", origin));
  }
}
