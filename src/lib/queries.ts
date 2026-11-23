import "server-only";

import { POINTS } from "./constants";
import { queryAll, queryOne, sha256 } from "./db";
import type {
  Achievement,
  Artwork,
  ArtworkWithStats,
  Comment,
  LeaderboardRow,
  PlayCard,
  PublicUser,
  Report,
  User,
  UserAchievement,
  VoteStats,
  VoteType,
} from "./types";

const STATS_SUBQUERIES = `
  (SELECT COUNT(*) FROM votes v WHERE v.artwork_id = a.id) AS vote_count,
  (SELECT COUNT(*) FROM votes v WHERE v.artwork_id = a.id AND v.vote_type = 'yes') AS yes_count,
  (SELECT COUNT(*) FROM votes v WHERE v.artwork_id = a.id AND v.vote_type = 'no') AS no_count,
  (SELECT COUNT(*) FROM votes v WHERE v.artwork_id = a.id AND v.vote_type = 'unsure') AS unsure_count,
  (SELECT COUNT(*) FROM comments c WHERE c.artwork_id = a.id AND c.is_hidden = 0) AS comment_count,
  (SELECT COUNT(*) FROM likes l WHERE l.artwork_id = a.id) AS like_count
`;

export function statsFromCounts(counts: {
  vote_count: number;
  yes_count: number;
  no_count: number;
  unsure_count: number;
}): VoteStats {
  const total = counts.vote_count;
  if (!total) {
    return { total: 0, yes: 0, no: 0, unsure: 0, yesPct: 0, noPct: 0, unsurePct: 0 };
  }
  const yesPct = Math.round((counts.yes_count / total) * 100);
  const noPct = Math.round((counts.no_count / total) * 100);
  return {
    total,
    yes: counts.yes_count,
    no: counts.no_count,
    unsure: counts.unsure_count,
    yesPct,
    noPct,
    unsurePct: Math.max(0, 100 - yesPct - noPct),
  };
}

function withStats<T extends ArtworkWithStats>(row: T): T {
  const stats = statsFromCounts(row);
  return {
    ...row,
    yes_pct: stats.yesPct,
    no_pct: stats.noPct,
    unsure_pct: stats.unsurePct,
  };
}

export function getArtworkStats(artworkId: string): VoteStats {
  const counts = queryOne<{
    vote_count: number;
    yes_count: number;
    no_count: number;
    unsure_count: number;
  }>(
    `SELECT
       COUNT(*) AS vote_count,
       COALESCE(SUM(CASE WHEN vote_type = 'yes' THEN 1 ELSE 0 END), 0) AS yes_count,
       COALESCE(SUM(CASE WHEN vote_type = 'no' THEN 1 ELSE 0 END), 0) AS no_count,
       COALESCE(SUM(CASE WHEN vote_type = 'unsure' THEN 1 ELSE 0 END), 0) AS unsure_count
     FROM votes WHERE artwork_id = ?`,
    artworkId,
  );
  return statsFromCounts(
    counts ?? { vote_count: 0, yes_count: 0, no_count: 0, unsure_count: 0 },
  );
}

export function getArtworkById(id: string): ArtworkWithStats | null {
  const row = queryOne<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES} FROM artworks a WHERE a.id = ?`,
    id,
  );
  return row ? withStats(row) : null;
}

export function getArtworkBySlug(slug: string): ArtworkWithStats | null {
  const row = queryOne<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES} FROM artworks a WHERE a.slug = ? AND a.status = 'approved'`,
    slug,
  );
  return row ? withStats(row) : null;
}

export interface ArtworkFilters {
  q?: string;
  category?: string;
  sort?: "trending" | "controversial" | "newest" | "votes";
  page?: number;
  pageSize?: number;
}

export function listArtworks(filters: ArtworkFilters = {}): {
  items: ArtworkWithStats[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
} {
  const pageSize = Math.min(Math.max(filters.pageSize ?? 12, 1), 48);
  const page = Math.max(filters.page ?? 1, 1);
  const where: string[] = ["a.status = 'approved'"];
  const params: Array<string | number> = [];

  if (filters.q) {
    where.push("(a.title LIKE ? OR a.artist_name LIKE ? OR a.description LIKE ?)");
    const term = `%${filters.q}%`;
    params.push(term, term, term);
  }
  if (filters.category) {
    where.push("a.category = ?");
    params.push(filters.category);
  }

  const order =
    filters.sort === "newest"
      ? "a.created_at DESC"
      : filters.sort === "controversial"
        ? "ABS((yes_count * 100.0 / NULLIF(vote_count, 0)) - 50) ASC, vote_count DESC"
        : filters.sort === "votes"
          ? "vote_count DESC, a.created_at DESC"
          : "vote_count DESC, a.created_at DESC";

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const totalRow = queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM artworks a ${whereSql}`,
    ...params,
  );
  const total = totalRow?.count ?? 0;

  const rows = queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     ${whereSql}
     ORDER BY ${order}
     LIMIT ? OFFSET ?`,
    ...params,
    pageSize,
    (page - 1) * pageSize,
  );

  return {
    items: rows.map(withStats),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function getTrendingArtworks(limit = 6): ArtworkWithStats[] {
  return queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.status = 'approved'
     ORDER BY vote_count DESC, a.created_at DESC
     LIMIT ?`,
    limit,
  ).map(withStats);
}

export function getControversialArtworks(limit = 4): ArtworkWithStats[] {
  return queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.status = 'approved'
     ORDER BY ABS((yes_count * 100.0 / NULLIF(vote_count, 0)) - 50) ASC, vote_count DESC
     LIMIT ?`,
    limit,
  ).map(withStats);
}

export function getRecentArtworks(limit = 6): ArtworkWithStats[] {
  return queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.status = 'approved'
     ORDER BY a.created_at DESC
     LIMIT ?`,
    limit,
  ).map(withStats);
}

export function getArtworkOfTheDay(date = new Date().toISOString().slice(0, 10)): ArtworkWithStats | null {
  const rows = queryAll<{ id: string }>(
    "SELECT id FROM artworks WHERE status = 'approved' ORDER BY id",
  );
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) =>
    sha256(`${date}:${a.id}`).localeCompare(sha256(`${date}:${b.id}`)),
  );
  return getArtworkById(sorted[0]!.id);
}

export function getDailyChallengeIds(date = new Date().toISOString().slice(0, 10)): string[] {
  const rows = queryAll<{ id: string }>(
    "SELECT id FROM artworks WHERE status = 'approved' ORDER BY id",
  );
  return [...rows]
    .sort((a, b) => sha256(`challenge:${date}:${a.id}`).localeCompare(sha256(`challenge:${date}:${b.id}`)))
    .slice(0, 5)
    .map((r) => r.id);
}

export function getChallengeCards(date = new Date().toISOString().slice(0, 10)): PlayCard[] {
  const ids = getDailyChallengeIds(date);
  const cards: PlayCard[] = [];
  for (const id of ids) {
    const row = queryOne<{
      id: string;
      image_url: string;
      image_width: number;
      image_height: number;
    }>(
      "SELECT id, image_url, image_width, image_height FROM artworks WHERE id = ? AND status = 'approved'",
      id,
    );
    if (row) {
      cards.push({
        id: row.id,
        imageUrl: row.image_url,
        imageWidth: row.image_width,
        imageHeight: row.image_height,
      });
    }
  }
  return cards;
}

export function getParticipantVotes(participant: {
  userId: string | null;
  guestId: string | null;
}): Set<string> {
  if (participant.userId) {
    const rows = queryAll<{ artwork_id: string }>(
      "SELECT artwork_id FROM votes WHERE user_id = ?",
      participant.userId,
    );
    return new Set(rows.map((r) => r.artwork_id));
  }
  if (participant.guestId) {
    const rows = queryAll<{ artwork_id: string }>(
      "SELECT artwork_id FROM votes WHERE guest_id = ?",
      participant.guestId,
    );
    return new Set(rows.map((r) => r.artwork_id));
  }
  return new Set();
}

export function hasVoted(
  participant: { userId: string | null; guestId: string | null },
  artworkId: string,
): boolean {
  if (participant.userId) {
    return Boolean(
      queryOne(
        "SELECT 1 FROM votes WHERE user_id = ? AND artwork_id = ?",
        participant.userId,
        artworkId,
      ),
    );
  }
  if (participant.guestId) {
    return Boolean(
      queryOne(
        "SELECT 1 FROM votes WHERE guest_id = ? AND artwork_id = ?",
        participant.guestId,
        artworkId,
      ),
    );
  }
  return false;
}

export function getVoteType(
  participant: { userId: string | null; guestId: string | null },
  artworkId: string,
): VoteType | null {
  const row = participant.userId
    ? queryOne<{ vote_type: VoteType }>(
        "SELECT vote_type FROM votes WHERE user_id = ? AND artwork_id = ?",
        participant.userId,
        artworkId,
      )
    : participant.guestId
      ? queryOne<{ vote_type: VoteType }>(
          "SELECT vote_type FROM votes WHERE guest_id = ? AND artwork_id = ?",
          participant.guestId,
          artworkId,
        )
      : null;
  return row?.vote_type ?? null;
}

export function getNextPlayArtwork(
  participant: { userId: string | null; guestId: string | null },
  excludeId?: string,
): PlayCard | null {
  const where: string[] = ["a.status = 'approved'"];
  const params: string[] = [];
  if (excludeId) {
    where.push("a.id <> ?");
    params.push(excludeId);
  }
  if (participant.userId) {
    where.push("a.id NOT IN (SELECT artwork_id FROM votes WHERE user_id = ?)");
    params.push(participant.userId);
  } else if (participant.guestId) {
    where.push("a.id NOT IN (SELECT artwork_id FROM votes WHERE guest_id = ?)");
    params.push(participant.guestId);
  }
  const row = queryOne<{
    id: string;
    image_url: string;
    image_width: number;
    image_height: number;
  }>(
    `SELECT a.id, a.image_url, a.image_width, a.image_height
     FROM artworks a
     WHERE ${where.join(" AND ")}
     ORDER BY RANDOM()
     LIMIT 1`,
    ...params,
  );
  if (!row) return null;
  return {
    id: row.id,
    imageUrl: row.image_url,
    imageWidth: row.image_width,
    imageHeight: row.image_height,
  };
}

export function getComments(artworkId: string): Comment[] {
  return queryAll<Comment>(
    `SELECT c.id, c.user_id, c.artwork_id, c.content, c.created_at,
            u.username, u.avatar_url
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.artwork_id = ? AND c.is_hidden = 0
     ORDER BY c.created_at DESC
     LIMIT 60`,
    artworkId,
  );
}

export function getRecentComments(limit = 8): Array<Comment & { artwork_title: string; artwork_slug: string }> {
  return queryAll(
    `SELECT c.id, c.user_id, c.artwork_id, c.content, c.created_at,
            u.username, u.avatar_url, a.title AS artwork_title, a.slug AS artwork_slug
     FROM comments c
     JOIN users u ON u.id = c.user_id
     JOIN artworks a ON a.id = c.artwork_id
     WHERE c.is_hidden = 0 AND a.status = 'approved'
     ORDER BY c.created_at DESC
     LIMIT ?`,
    limit,
  );
}

export function getSimilarArtworks(artwork: Artwork, limit = 4): ArtworkWithStats[] {
  return queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.status = 'approved' AND a.category = ? AND a.id <> ?
     ORDER BY vote_count DESC
     LIMIT ?`,
    artwork.category,
    artwork.id,
    limit,
  ).map(withStats);
}

export function getLikeState(
  artworkId: string,
  userId: string | null,
): { count: number; liked: boolean } {
  const count = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM likes WHERE artwork_id = ?",
    artworkId,
  );
  const liked = userId
    ? Boolean(
        queryOne(
          "SELECT 1 FROM likes WHERE artwork_id = ? AND user_id = ?",
          artworkId,
          userId,
        ),
      )
    : false;
  return { count: count?.count ?? 0, liked };
}

export function getUserByEmail(email: string): User | null {
  return queryOne<User>("SELECT * FROM users WHERE email = ?", email.toLowerCase());
}

export function getUserByUsername(username: string): User | null {
  return queryOne<User>("SELECT * FROM users WHERE username = ?", username);
}

export function getUserById(id: string): User | null {
  return queryOne<User>("SELECT * FROM users WHERE id = ?", id);
}

export function getPublicUser(username: string): PublicUser | null {
  const user = getUserByUsername(username);
  if (!user) return null;
  const {
    email: _email,
    password_hash: _password,
    is_blocked: _blocked,
    is_demo: _demo,
    ...rest
  } = user;
  return rest;
}

export function getUserStats(userId: string) {
  const votes = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM votes WHERE user_id = ?",
    userId,
  );
  const works = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM artworks WHERE submitted_by = ? AND status = 'approved'",
    userId,
  );
  const pending = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM artworks WHERE submitted_by = ? AND status = 'pending'",
    userId,
  );
  const comments = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM comments WHERE user_id = ? AND is_hidden = 0",
    userId,
  );
  const followers = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM follows WHERE following_id = ?",
    userId,
  );
  const following = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?",
    userId,
  );
  return {
    votes: votes?.count ?? 0,
    works: works?.count ?? 0,
    pending: pending?.count ?? 0,
    comments: comments?.count ?? 0,
    followers: followers?.count ?? 0,
    following: following?.count ?? 0,
  };
}

export function getUserAchievements(userId: string): UserAchievement[] {
  return queryAll<UserAchievement>(
    `SELECT a.*, ua.created_at AS earned_at
     FROM user_achievements ua
     JOIN achievements a ON a.id = ua.achievement_id
     WHERE ua.user_id = ?
     ORDER BY ua.created_at DESC`,
    userId,
  );
}

export function getAllAchievements(): Achievement[] {
  return queryAll<Achievement>("SELECT * FROM achievements ORDER BY sort_order ASC");
}

export function getUserWorks(userId: string, includePending = false): ArtworkWithStats[] {
  const status = includePending ? "a.status IN ('approved','pending','rejected')" : "a.status = 'approved'";
  return queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.submitted_by = ? AND ${status}
     ORDER BY a.created_at DESC`,
    userId,
  ).map(withStats);
}

export function isFollowing(followerId: string, followingId: string): boolean {
  return Boolean(
    queryOne(
      "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?",
      followerId,
      followingId,
    ),
  );
}

export function getTopMembers(limit = 8): LeaderboardRow[] {
  return queryAll<LeaderboardRow>(
    `SELECT u.id, u.username, u.avatar_url, u.points, u.points AS score, u.streak,
            (SELECT COUNT(*) FROM votes v WHERE v.user_id = u.id) AS votes,
            (SELECT COUNT(*) FROM artworks a WHERE a.submitted_by = u.id AND a.status = 'approved') AS works
     FROM users u
     WHERE u.is_blocked = 0
     ORDER BY u.points DESC, u.created_at ASC
     LIMIT ?`,
    limit,
  );
}

export function getLeaderboard(period: "weekly" | "monthly" | "all"): LeaderboardRow[] {
  if (period === "all") {
    return getTopMembers(50);
  }
  const days = period === "weekly" ? 7 : 30;
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceIso = since.toISOString();
  return queryAll<LeaderboardRow>(
    `SELECT u.id, u.username, u.avatar_url, u.points,
            (
              (SELECT COUNT(*) FROM votes v WHERE v.user_id = u.id AND v.created_at >= ?) * ${POINTS.vote} +
              (SELECT COUNT(*) FROM daily_completions dc WHERE dc.user_id = u.id AND dc.created_at >= ?) * ${POINTS.dailyChallenge} +
              (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = u.id AND ua.created_at >= ?) * ${POINTS.achievement} +
              (SELECT COUNT(*) FROM artworks a WHERE a.submitted_by = u.id AND a.status = 'approved' AND a.created_at >= ?) * ${POINTS.approvedArtwork}
            ) AS score,
            (SELECT COUNT(*) FROM votes v WHERE v.user_id = u.id AND v.created_at >= ?) AS votes,
            (SELECT COUNT(*) FROM artworks a WHERE a.submitted_by = u.id AND a.status = 'approved') AS works,
            u.streak
     FROM users u
     WHERE u.is_blocked = 0
     ORDER BY score DESC, u.points DESC
     LIMIT 50`,
    sinceIso,
    sinceIso,
    sinceIso,
    sinceIso,
    sinceIso,
  );
}

export function getSiteStats() {
  const artworks = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM artworks WHERE status = 'approved'",
  );
  const votes = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM votes");
  const users = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM users");
  const comments = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM comments WHERE is_hidden = 0");
  const countries = queryOne<{ count: number }>(
    "SELECT COUNT(DISTINCT country) AS count FROM artworks WHERE status = 'approved' AND country <> '—'",
  );
  const today = new Date().toISOString().slice(0, 10);
  const todayVotes = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM votes WHERE substr(created_at, 1, 10) = ?",
    today,
  );
  return {
    artworks: artworks?.count ?? 0,
    votes: votes?.count ?? 0,
    users: users?.count ?? 0,
    comments: comments?.count ?? 0,
    countries: countries?.count ?? 0,
    todayVotes: todayVotes?.count ?? 0,
  };
}

export function getCategoriesWithCounts(): Array<{
  slug: string;
  name: string;
  description: string | null;
  count: number;
}> {
  return queryAll(
    `SELECT c.slug, c.name, c.description,
            (SELECT COUNT(*) FROM artworks a WHERE a.category = c.slug AND a.status = 'approved') AS count
     FROM categories c
     WHERE c.is_active = 1
     ORDER BY c.sort_order ASC`,
  );
}

export function getCommunityData() {
  const works = queryAll<ArtworkWithStats>(
    `SELECT a.*, ${STATS_SUBQUERIES}
     FROM artworks a
     WHERE a.status = 'approved' AND a.submitted_by IS NOT NULL
     ORDER BY a.created_at DESC
     LIMIT 8`,
  ).map(withStats);
  return {
    works,
    comments: getRecentComments(8),
    members: getTopMembers(8),
  };
}

export function getChallengeProgress(
  participant: { userId: string | null; guestId: string | null },
  date = new Date().toISOString().slice(0, 10),
): { ids: string[]; voted: string[]; complete: boolean; completionRecorded: boolean } {
  const ids = getDailyChallengeIds(date);
  if (!ids.length) return { ids, voted: [], complete: false, completionRecorded: false };
  const placeholders = ids.map(() => "?").join(",");
  // Count a challenge work as judged even if the vote happened earlier. The set
  // is shared by everyone, so a past judgment should not make today's challenge
  // impossible to finish.
  const rows = participant.userId
    ? queryAll<{ artwork_id: string }>(
        `SELECT artwork_id FROM votes
         WHERE user_id = ? AND artwork_id IN (${placeholders})`,
        participant.userId,
        ...ids,
      )
    : participant.guestId
      ? queryAll<{ artwork_id: string }>(
          `SELECT artwork_id FROM votes
           WHERE guest_id = ? AND artwork_id IN (${placeholders})`,
          participant.guestId,
          ...ids,
        )
      : [];
  const voted = rows.map((r) => r.artwork_id);
  const recorded = participant.userId
    ? Boolean(
        queryOne(
          "SELECT 1 FROM daily_completions WHERE user_id = ? AND challenge_date = ?",
          participant.userId,
          date,
        ),
      )
    : false;
  return {
    ids,
    voted,
    complete: ids.every((id) => voted.includes(id)),
    completionRecorded: recorded,
  };
}

export function getAdminStats() {
  const users = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM users");
  const artworks = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM artworks");
  const approved = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM artworks WHERE status = 'approved'",
  );
  const pending = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM artworks WHERE status = 'pending'",
  );
  const votes = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM votes");
  const comments = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM comments");
  const reports = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM reports WHERE status = 'open'",
  );
  const blocked = queryOne<{ count: number }>(
    "SELECT COUNT(*) AS count FROM users WHERE is_blocked = 1",
  );
  return {
    users: users?.count ?? 0,
    artworks: artworks?.count ?? 0,
    approved: approved?.count ?? 0,
    pending: pending?.count ?? 0,
    votes: votes?.count ?? 0,
    comments: comments?.count ?? 0,
    reports: reports?.count ?? 0,
    blocked: blocked?.count ?? 0,
  };
}

export function listPendingArtworks(): Array<Artwork & { submitter: string | null }> {
  return queryAll(
    `SELECT a.*, u.username AS submitter
     FROM artworks a LEFT JOIN users u ON u.id = a.submitted_by
     WHERE a.status = 'pending'
     ORDER BY a.created_at ASC`,
  );
}

export function listAdminArtworks(limit = 100): Array<Artwork & { submitter: string | null; vote_count: number }> {
  return queryAll(
    `SELECT a.*, u.username AS submitter,
            (SELECT COUNT(*) FROM votes v WHERE v.artwork_id = a.id) AS vote_count
     FROM artworks a LEFT JOIN users u ON u.id = a.submitted_by
     ORDER BY a.created_at DESC
     LIMIT ?`,
    limit,
  );
}

export function listReports(): Report[] {
  return queryAll<Report>(
    `SELECT r.*, u.username, a.title AS artwork_title, a.slug AS artwork_slug, a.image_url AS artwork_image
     FROM reports r
     JOIN users u ON u.id = r.user_id
     JOIN artworks a ON a.id = r.artwork_id
     ORDER BY CASE r.status WHEN 'open' THEN 0 ELSE 1 END, r.created_at DESC
     LIMIT 100`,
  );
}

export function listAdminUsers(): Array<{
  id: string;
  username: string;
  email: string;
  role: string;
  points: number;
  is_blocked: number;
  created_at: string;
  votes: number;
  works: number;
}> {
  return queryAll(
    `SELECT u.id, u.username, u.email, u.role, u.points, u.is_blocked, u.created_at,
            (SELECT COUNT(*) FROM votes v WHERE v.user_id = u.id) AS votes,
            (SELECT COUNT(*) FROM artworks a WHERE a.submitted_by = u.id AND a.status = 'approved') AS works
     FROM users u
     ORDER BY u.created_at DESC
     LIMIT 200`,
  );
}

export function listAllCategories(): Array<{
  slug: string;
  name: string;
  description: string | null;
  is_active: number;
  count: number;
}> {
  return queryAll(
    `SELECT c.slug, c.name, c.description, c.is_active,
            (SELECT COUNT(*) FROM artworks a WHERE a.category = c.slug) AS count
     FROM categories c
     ORDER BY c.sort_order ASC`,
  );
}

export function getUserRecentVotes(
  userId: string,
  limit = 6,
): Array<{
  vote_type: VoteType;
  created_at: string;
  title: string;
  slug: string;
  image_url: string;
  artist_name: string;
}> {
  return queryAll(
    `SELECT v.vote_type, v.created_at, a.title, a.slug, a.image_url, a.artist_name
     FROM votes v JOIN artworks a ON a.id = v.artwork_id
     WHERE v.user_id = ? AND a.status = 'approved'
     ORDER BY v.created_at DESC
     LIMIT ?`,
    userId,
    limit,
  );
}

export function getCommunityMembers(limit = 24): LeaderboardRow[] {
  return queryAll<LeaderboardRow>(
    `SELECT u.id, u.username, u.avatar_url, u.points, u.points AS score, u.streak,
            (SELECT COUNT(*) FROM votes v WHERE v.user_id = u.id) AS votes,
            (SELECT COUNT(*) FROM artworks a WHERE a.submitted_by = u.id AND a.status = 'approved') AS works
     FROM users u
     WHERE u.is_blocked = 0
     ORDER BY u.points DESC, u.created_at ASC
     LIMIT ?`,
    limit,
  );
}

export function getOwnedArtwork(id: string, userId: string): Artwork | null {
  return queryOne<Artwork>(
    "SELECT * FROM artworks WHERE id = ? AND submitted_by = ?",
    id,
    userId,
  );
}
