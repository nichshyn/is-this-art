import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import {
  GUEST_COOKIE,
  SESSION_COOKIE,
  SESSION_DAYS,
} from "./constants";
import { hmac, newId, queryOne, randomToken, sha256 } from "./db";
import type { PublicUser, User } from "./types";

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[is-this-art] AUTH_SECRET is not set. Sessions work, but guest signatures use an insecure default.",
    );
  }
  return "is-this-art-dev-secret-change-before-deploying";
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function createSession(userId: string): Promise<void> {
  const token = randomToken(32);
  const id = sha256(token);
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const db = (await import("./db")).getDb();
  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).run(id, userId, expires.toISOString(), new Date().toISOString());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = (await import("./db")).getDb();
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sha256(token));
  }
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const now = new Date().toISOString();
  return queryOne<User>(
    `SELECT u.* FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > ?`,
    sha256(token),
    now,
  );
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Fplay");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Fadmin");
  if (user.role !== "admin") redirect("/");
  return user;
}

export function toPublicUser(user: User): PublicUser {
  const { email: _email, password_hash: _password, is_blocked: _blocked, is_demo: _demo, ...rest } = user;
  return rest;
}

/** A guest is a signed random identifier stored in an httpOnly cookie. */
export async function readGuestId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(GUEST_COOKIE)?.value;
  if (!raw) return null;
  const [id, signature] = raw.split(".");
  if (!id || !signature) return null;
  const expected = hmac(id, secret());
  if (signature.length !== expected.length) return null;
  // Constant-time-ish comparison without importing timingSafeEqual twice.
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) return null;
  return sha256(`guest:${id}`);
}

/** Only call from a route handler or server action — it writes a cookie. */
export async function ensureGuestId(): Promise<string> {
  const existing = await readGuestId();
  if (existing) return existing;
  const rawId = newId("g_") + randomToken(9);
  const store = await cookies();
  store.set(GUEST_COOKIE, `${rawId}.${hmac(rawId, secret())}`, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60,
  });
  return sha256(`guest:${rawId}`);
}

export interface Participant {
  userId: string | null;
  guestId: string | null;
  user: User | null;
}

export async function getParticipant(): Promise<Participant> {
  const user = await getCurrentUser();
  if (user) return { userId: user.id, guestId: null, user };
  const guestId = await readGuestId();
  return { userId: null, guestId, user: null };
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("host");
    const originHost = new URL(origin).host;
    if (host && originHost === host) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site && originHost === new URL(site).host) return true;
    return false;
  } catch {
    return false;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function googleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
