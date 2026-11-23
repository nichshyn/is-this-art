import "server-only";

import { POINTS, VOTE_TYPES, type VoteType } from "./constants";
import { newId, transaction, type Db } from "./db";
import { getArtworkById, getArtworkStats, getDailyChallengeIds } from "./queries";
import type { Achievement, Artwork, User } from "./types";
import { utcDay } from "./utils";

export interface CastVoteInput {
  artworkId: string;
  voteType: VoteType;
  userId: string | null;
  guestId: string | null;
}

export interface CastVoteSuccess {
  ok: true;
  artwork: Artwork;
  stats: ReturnType<typeof getArtworkStats>;
  yourVote: VoteType;
  pointsEarned: number;
  totalPoints: number;
  streak: number;
  newAchievements: Achievement[];
  challengeComplete: boolean;
  challengeBonus: number;
}

export interface CastVoteFailure {
  ok: false;
  code: "invalid" | "not_found" | "already_voted" | "blocked";
  message: string;
}

export type CastVoteResult = CastVoteSuccess | CastVoteFailure;

function yesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function award(
  db: Db,
  userId: string,
  achievementId: string,
  nowIso: string,
): Achievement | null {
  const achievement = db
    .prepare("SELECT * FROM achievements WHERE id = ?")
    .get(achievementId) as unknown as Achievement | undefined;
  if (!achievement) return null;
  const result = db
    .prepare(
      "INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(newId("ua_"), userId, achievementId, nowIso);
  if (result.changes === 0) return null;
  db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(
    achievement.points,
    userId,
  );
  return achievement;
}

function awardVoteAchievements(
  db: Db,
  user: User,
  nowIso: string,
): Achievement[] {
  const earned: Achievement[] = [];
  const add = (id: string) => {
    const achievement = award(db, user.id, id, nowIso);
    if (achievement) earned.push(achievement);
  };

  const votes = (
    db.prepare("SELECT COUNT(*) AS count FROM votes WHERE user_id = ?").get(user.id) as {
      count: number;
    }
  ).count;
  const categories = (
    db
      .prepare(
        `SELECT COUNT(DISTINCT a.category) AS count
         FROM votes v JOIN artworks a ON a.id = v.artwork_id
         WHERE v.user_id = ?`,
      )
      .get(user.id) as { count: number }
  ).count;

  if (votes >= 1) add("first-vote");
  if (votes >= 10) add("ten-votes");
  if (votes >= 50 && categories >= 5) add("fifty-votes");
  if (votes >= 100) add("hundred-votes");
  if (user.streak >= 3) add("streak-3");
  if (user.streak >= 7) add("streak-7");

  if (votes >= 20) {
    const total = (
      db.prepare("SELECT COUNT(*) AS count FROM users WHERE is_blocked = 0").get() as {
        count: number;
      }
    ).count;
    const current = db
      .prepare("SELECT points FROM users WHERE id = ?")
      .get(user.id) as { points: number };
    const higher = (
      db
        .prepare("SELECT COUNT(*) AS count FROM users WHERE is_blocked = 0 AND points > ?")
        .get(current.points) as { count: number }
    ).count;
    const percentile = total > 0 ? (higher + 1) / total : 1;
    if (percentile <= 0.1) add("top-10");
  }

  return earned;
}

export function castVote(input: CastVoteInput): CastVoteResult {
  if (!VOTE_TYPES.includes(input.voteType)) {
    return { ok: false, code: "invalid", message: "Выберите один из трёх вариантов ответа." };
  }
  if (!input.userId && !input.guestId) {
    return { ok: false, code: "invalid", message: "Не удалось определить сессию." };
  }

  const artwork = getArtworkById(input.artworkId);
  if (!artwork || artwork.status !== "approved") {
    return { ok: false, code: "not_found", message: "Эта работа недоступна." };
  }

  const existing = input.userId
    ? transaction((db) =>
        db
          .prepare("SELECT 1 FROM votes WHERE user_id = ? AND artwork_id = ?")
          .get(input.userId!, input.artworkId),
      )
    : transaction((db) =>
        db
          .prepare("SELECT 1 FROM votes WHERE guest_id = ? AND artwork_id = ?")
          .get(input.guestId!, input.artworkId),
      );
  if (existing) {
    return {
      ok: false,
      code: "already_voted",
      message: "Вы уже оценили эту работу.",
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const today = utcDay(now);

  try {
    const outcome = transaction((db) => {
      let pointsEarned = 0;
      let challengeComplete = false;
      let challengeBonus = 0;
      let newAchievements: Achievement[] = [];
      let streak = 0;
      let totalPoints = 0;

      if (input.userId) {
        const user = db
          .prepare("SELECT * FROM users WHERE id = ?")
          .get(input.userId) as unknown as User;
        if (!user || user.is_blocked) {
          throw new Error("BLOCKED");
        }

        db.prepare(
          "INSERT INTO votes (id, user_id, guest_id, artwork_id, vote_type, created_at) VALUES (?, ?, NULL, ?, ?, ?)",
        ).run(newId("vote_"), user.id, input.artworkId, input.voteType, nowIso);

        streak =
          user.last_vote_date === today
            ? user.streak || 1
            : user.last_vote_date === yesterdayUtc()
              ? (user.streak || 0) + 1
              : 1;
        const longest = Math.max(user.longest_streak, streak);
        pointsEarned += POINTS.vote;
        db.prepare(
          `UPDATE users
           SET points = points + ?, streak = ?, longest_streak = ?, last_vote_date = ?
           WHERE id = ?`,
        ).run(POINTS.vote, streak, longest, today, user.id);

        const refreshed = {
          ...user,
          points: user.points + POINTS.vote,
          streak,
          longest_streak: longest,
          last_vote_date: today,
        };
        newAchievements = awardVoteAchievements(db, refreshed, nowIso);
        pointsEarned += newAchievements.reduce((sum, a) => sum + a.points, 0);

        // Daily challenge: all five of today's works judged today.
        const challengeIds = getDailyChallengeIds(today);
        if (challengeIds.includes(input.artworkId)) {
          const placeholders = challengeIds.map(() => "?").join(",");
          const judged = db
            .prepare(
              `SELECT COUNT(DISTINCT artwork_id) AS count FROM votes
               WHERE user_id = ? AND artwork_id IN (${placeholders})`,
            )
            .get(user.id, ...challengeIds) as { count: number };
          if (judged.count >= challengeIds.length) {
            const inserted = db
              .prepare(
                "INSERT OR IGNORE INTO daily_completions (id, user_id, challenge_date, created_at) VALUES (?, ?, ?, ?)",
              )
              .run(newId("dc_"), user.id, today, nowIso);
            if (inserted.changes > 0) {
              challengeComplete = true;
              challengeBonus = POINTS.dailyChallenge;
              pointsEarned += challengeBonus;
              db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(
                challengeBonus,
                user.id,
              );
            }
          }
        }

        const final = db
          .prepare("SELECT points, streak FROM users WHERE id = ?")
          .get(user.id) as { points: number; streak: number };
        totalPoints = final.points;
        streak = final.streak;
      } else {
        db.prepare(
          "INSERT INTO votes (id, user_id, guest_id, artwork_id, vote_type, created_at) VALUES (?, NULL, ?, ?, ?, ?)",
        ).run(newId("vote_"), input.guestId, input.artworkId, input.voteType, nowIso);
      }

      return {
        pointsEarned,
        challengeComplete,
        challengeBonus,
        newAchievements,
        streak,
        totalPoints,
      };
    });

    return {
      ok: true,
      artwork,
      stats: getArtworkStats(input.artworkId),
      yourVote: input.voteType,
      ...outcome,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "BLOCKED") {
      return { ok: false, code: "blocked", message: "Эта учётная запись заблокирована." };
    }
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE constraint")) {
      return {
        ok: false,
        code: "already_voted",
        message: "Вы уже оценили эту работу.",
      };
    }
    console.error("[vote]", error);
    return { ok: false, code: "invalid", message: "Не удалось сохранить ваш голос. Попробуйте снова." };
  }
}

export function awardCommentAchievement(userId: string): Achievement | null {
  return transaction((db) => {
    const count = (
      db
        .prepare("SELECT COUNT(*) AS count FROM comments WHERE user_id = ? AND is_hidden = 0")
        .get(userId) as { count: number }
    ).count;
    if (count < 10) return null;
    return award(db, userId, "commenter", new Date().toISOString());
  });
}

export function awardUploadAchievements(userId: string): Achievement[] {
  return transaction((db) => {
    const earned: Achievement[] = [];
    const works = (
      db
        .prepare(
          "SELECT COUNT(*) AS count FROM artworks WHERE submitted_by = ? AND status = 'approved'",
        )
        .get(userId) as { count: number }
    ).count;
    const now = new Date().toISOString();
    if (works >= 1) {
      const a = award(db, userId, "first-upload", now);
      if (a) earned.push(a);
    }
    if (works >= 5) {
      const a = award(db, userId, "curator", now);
      if (a) earned.push(a);
    }
    if (earned.length) {
      db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(
        POINTS.approvedArtwork,
        userId,
      );
    }
    return earned;
  });
}
