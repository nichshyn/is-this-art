import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";
import { queryAll } from "@/lib/db";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/discover",
    "/play",
    "/challenge",
    "/community",
    "/leaderboard",
    "/submit",
    "/about",
    "/credits",
    "/privacy",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let artworks: Array<{ slug: string; created_at: string }> = [];
  try {
    artworks = queryAll<{ slug: string; created_at: string }>(
      "SELECT slug, created_at FROM artworks WHERE status = 'approved' ORDER BY created_at DESC",
    );
  } catch {
    // The sitemap should still work before the database is initialised.
  }

  let profiles: Array<{ username: string }> = [];
  try {
    profiles = queryAll<{ username: string }>(
      "SELECT username FROM users WHERE is_blocked = 0 ORDER BY points DESC LIMIT 100",
    );
  } catch {
    // ignore
  }

  return [
    ...staticPages,
    ...artworks.map((artwork) => ({
      url: `${SITE.url}/artwork/${artwork.slug}`,
      lastModified: new Date(artwork.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...profiles.map((profile) => ({
      url: `${SITE.url}/u/${profile.username}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];
}
