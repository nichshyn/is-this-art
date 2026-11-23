import "server-only";

import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { CATEGORIES, POINTS } from "./constants";
import { SEED_ARTWORKS } from "@/data/artworks";
import { hashPassword } from "./password";

type SqlValue = string | number | null | bigint | Uint8Array;

export type Db = DatabaseSync;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  points INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_vote_date TEXT,
  is_blocked INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  history TEXT,
  image_url TEXT NOT NULL,
  image_width INTEGER NOT NULL DEFAULT 1200,
  image_height INTEGER NOT NULL DEFAULT 1200,
  image_credit TEXT,
  image_license TEXT,
  image_source_url TEXT,
  category TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  creation_year TEXT,
  country TEXT,
  location TEXT,
  fun_fact TEXT,
  is_ai_generated INTEGER NOT NULL DEFAULT 0,
  is_verified INTEGER NOT NULL DEFAULT 0,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 0,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_submitted ON artworks(submitted_by);
CREATE INDEX IF NOT EXISTS idx_artworks_created ON artworks(created_at);

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  guest_id TEXT,
  artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('yes','no','unsure')),
  created_at TEXT NOT NULL,
  CHECK ((user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_votes_user_artwork
  ON votes(user_id, artwork_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_votes_guest_artwork
  ON votes(guest_id, artwork_id) WHERE guest_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_votes_artwork ON votes(artwork_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_created ON votes(created_at);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_artwork ON comments(artwork_id, created_at);

CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, artwork_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 20,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id TEXT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','dismissed')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, challenge_date)
);
`;

function dataDir(): string {
  const configured = process.env.DATA_DIR;
  return configured
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configured)
    : path.join(process.cwd(), "data");
}

function seedIfEmpty(db: Db) {
  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get() as {
    count: number;
  };
  if (row.count > 0) return;

  const now = new Date();
  const iso = (daysAgo = 0, hour = 12) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - daysAgo);
    d.setUTCHours(hour, (daysAgo * 13) % 60, 0, 0);
    return d.toISOString();
  };

  db.exec("BEGIN IMMEDIATE");
  try {
    const insertMeta = db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)");
    insertMeta.run("seed_version", "1");
    insertMeta.run("seeded_at", new Date().toISOString());

    // Categories -----------------------------------------------------------
    const insertCategory = db.prepare(
      "INSERT INTO categories (slug, name, description, sort_order, is_active) VALUES (?, ?, ?, ?, 1)",
    );
    CATEGORIES.forEach((category, index) => {
      insertCategory.run(category.slug, category.name, category.description, index);
    });

    // Achievements ---------------------------------------------------------
    const achievements = [
      ["first-vote", "Первое суждение", "Подайте свой первый голос.", "sparkles", 0],
      ["ten-votes", "Первые 10 голосов", "Оцените десять работ.", "layers", 1],
      ["fifty-votes", "Исследователь искусства", "Оцените пятьдесят работ в пяти категориях.", "compass", 2],
      ["hundred-votes", "100 оценённых работ", "Оцените сто работ.", "trophy", 3],
      ["streak-3", "Три дня подряд", "Голосуйте три дня подряд.", "flame", 4],
      ["streak-7", "Недельная серия", "Голосуйте семь дней подряд.", "calendar", 5],
      ["top-10", "Топ-10% игроков", "Войдите в первые десять процентов таблицы лидеров.", "crown", 6],
      ["first-upload", "Признанный художник", "Добейтесь одобрения своей работы.", "palette", 7],
      ["curator", "Куратор", "Добейтесь одобрения пяти работ.", "gallery", 8],
      ["commenter", "Участник обсуждения", "Оставьте десять комментариев.", "message", 9],
    ] as const;
    const insertAchievement = db.prepare(
      "INSERT INTO achievements (id, name, description, icon, points, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
    );
    achievements.forEach(([id, name, description, icon, sortOrder]) => {
      insertAchievement.run(id, name, description, icon, POINTS.achievement, sortOrder);
    });

    // Users ----------------------------------------------------------------
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@isart.local";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin1234";
    const adminUsername = process.env.SEED_ADMIN_USERNAME || "curator";

    const demoUsers = [
      ["mira", "Mira Sol", "Ищу момент, когда вещь становится изображением."],
      ["jonas", "Jonas Reed", "Музейный охранник. Мнение — моё собственное."],
      ["aiko", "Aiko Tanaka", "Цвет, свет и очень долгие прогулки."],
      ["noor", "Noor Haddad", "Сначала голосую по чутью, потом читаю табличку."],
      ["elio", "Elio Marchetti", "Реставратор. Вижу прежде всего трещины."],
      ["sana", "Sana Okafor", "Куратор маленьких и странных вещей."],
      ["theo", "Theo Lindqvist", "Скептик. Иногда трогает."],
      ["ines", "Inès Moreau", "В основном фотография. Иногда море."],
      ["dmitri", "Dmitri Volkov", "Апологет супрематизма."],
      ["lucia", "Lucía Ferrer", "Нравятся работы, которые спорят со мной."],
      ["kwame", "Kwame Mensah", "Скульптура — это просто медленный рисунок."],
      ["freya", "Freya Holm", "Картины, гравюры и плохой кофе."],
      ["omar", "Omar Farouk", "Я ради споров."],
      ["yuki", "Yuki Sato", "Тихие залы, громкие изображения."],
      ["marco", "Marco Bianchi", "Старый мастер, новые вопросы."],
      ["zara", "Zara Khan", "Концептуальное искусство — мой язык любви."],
      ["hugo", "Hugo Pereira", "Сначала оцениваю раму, потом картину."],
      ["nadia", "Nadia Petrova", "Инсталляции и невозможные пространства."],
      ["sam", "Sam O'Connell", "Я менял мнение 400 раз."],
      ["lena", "Lena Fischer", "Рождённая в цифровую эпоху, с аналоговым сердцем."],
      ["ravi", "Ravi Mehta", "Минимализм, максималистские взгляды."],
      ["clara", "Clara Dubois", "Я веду список того, что меня останавливало."],
      ["ben", "Ben Carter", "Фотография — не документ."],
      ["amara", "Amara Nwosu", "Текст, ткань и пространство между ними."],
      ["felix", "Felix Braun", "Пришёл ради споров, остался ради искусства."],
      ["sofia", "Sofia Rossi", "Любительница цветовых полей."],
      ["tariq", "Tariq Aziz", "Предметы с тайной жизнью."],
      ["maeve", "Maeve Byrne", "Я смотрю медленно."],
      ["oskar", "Oskar Nowak", "Сетка — никогда не просто сетка."],
      ["priya", "Priya Raman", "Звук, изображение и другие призраки."],
      ["andres", "Andrés Silva", "Я не доверяю текстам на стенах."],
      ["nina", "Nina Kovač", "Краска — материал с памятью."],
      ["jae", "Jae Park", "Изображения ИИ, человеческие сомнения."],
      ["marta", "Marta López", "Я голосую «не уверена» чаще, чем следовало бы."],
      ["eli", "Eli Rosen", "Красивая случайность — всё равно случайность."],
      ["tomo", "Tomo Ishida", "Гравюры, волны и негативное пространство."],
      ["ada", "Ada Nwankwo", "Табличка — часть работы."],
      ["peter", "Peter Novak", "Старые привычки, новые медиа."],
    ] as const;

    const insertUser = db.prepare(
      `INSERT INTO users
       (id, username, email, password_hash, avatar_url, bio, role, points, streak, longest_streak, last_vote_date, is_blocked, is_demo, created_at)
       VALUES (?, ?, ?, ?, NULL, ?, ?, 0, 0, 0, NULL, 0, ?, ?)`,
    );

    insertUser.run(
      "usr_admin",
      adminUsername,
      adminEmail,
      hashPassword(adminPassword),
      "Хранитель очереди модерации.",
      "admin",
      0,
      iso(120),
    );

    demoUsers.forEach(([username, _name, bio], index) => {
      insertUser.run(
        `usr_${username}`,
        username,
        `${username}@demo.isart.local`,
        null,
        bio,
        "user",
        1,
        iso(110 - index * 2),
      );
    });

    insertUser.run(
      "usr_demo",
      "demo",
      "demo@isart.local",
      hashPassword("demo1234"),
      "Гостевой аккаунт для знакомства с сервисом.",
      "user",
      0,
      iso(60),
    );

    // Artworks -------------------------------------------------------------
    const insertArtwork = db.prepare(
      `INSERT INTO artworks
       (id, slug, title, description, history, image_url, image_width, image_height, image_credit, image_license,
        image_source_url, category, artist_name, creation_year, country, location, fun_fact, is_ai_generated,
        is_verified, is_anonymous, is_demo, submitted_by, status, rejection_reason, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, NULL, ?)`,
    );

    SEED_ARTWORKS.forEach((artwork) => {
      const submittedBy = artwork.submittedByUsername
        ? `usr_${artwork.submittedByUsername}`
        : null;
      insertArtwork.run(
        `art_${artwork.slug}`,
        artwork.slug,
        artwork.title,
        artwork.description,
        artwork.history,
        artwork.imageUrl,
        artwork.imageWidth,
        artwork.imageHeight,
        artwork.imageCredit,
        artwork.imageLicense,
        artwork.imageSourceUrl,
        artwork.category,
        artwork.artistName,
        artwork.creationYear,
        artwork.country,
        artwork.location,
        artwork.funFact,
        artwork.isAiGenerated ? 1 : 0,
        artwork.isVerified ? 1 : 0,
        artwork.isDemo ? 1 : 0,
        submittedBy,
        artwork.status ?? "approved",
        iso(artwork.createdDaysAgo ?? 20),
      );
    });

    // Votes ----------------------------------------------------------------
    const targets: Record<string, number> = {
      "mona-lisa": 0.92,
      "starry-night": 0.95,
      "black-square": 0.54,
      "composition-vii": 0.68,
      "garden-of-earthly-delights": 0.86,
      fountain: 0.41,
      "the-thinker": 0.9,
      "winged-victory": 0.93,
      "great-wave": 0.94,
      "grande-jatte": 0.84,
      "the-kiss": 0.91,
      "the-scream": 0.88,
      "le-gras": 0.47,
      "the-steerage": 0.76,
      "mondrian-1930": 0.59,
      "armory-show-1913": 0.55,
      "demo-suspended-field": 0.62,
      "demo-synthetic-garden": 0.44,
      "demo-chromatic-study": 0.71,
      "demo-question-repeated": 0.49,
      "demo-still-life-fold": 0.57,
    };

    const voterIds = demoUsers.map(([username]) => `usr_${username}`);
    voterIds.push("usr_demo");

    const hash32 = (value: string) => {
      const digest = createHash("sha256").update(value).digest();
      return digest.readUInt32BE(0);
    };

    const approved = SEED_ARTWORKS.filter((a) => (a.status ?? "approved") === "approved");
    const insertVote = db.prepare(
      "INSERT INTO votes (id, user_id, guest_id, artwork_id, vote_type, created_at) VALUES (?, ?, NULL, ?, ?, ?)",
    );

    approved.forEach((artwork, artworkIndex) => {
      const seed = hash32(`votes:${artwork.slug}`);
      const total = 19 + (seed % 15); // 19–33
      const yesPct = targets[artwork.slug] ?? 0.6;
      const unsurePct = 0.07 + ((seed >> 8) % 7) / 100; // 7–13%
      let yes = Math.round(total * yesPct);
      let unsure = Math.max(1, Math.round(total * unsurePct));
      let no = total - yes - unsure;
      if (no < 1) {
        no = 1;
        yes = total - no - unsure;
      }
      if (yes < 1) {
        yes = 1;
        unsure = Math.max(1, total - yes - no);
      }
      const types: string[] = [];
      for (let i = 0; i < yes; i++) types.push("yes");
      for (let i = 0; i < no; i++) types.push("no");
      for (let i = 0; i < unsure; i++) types.push("unsure");

      // Deterministic Fisher–Yates using the artwork hash.
      let state = seed || 1;
      const next = () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state;
      };
      for (let i = types.length - 1; i > 0; i--) {
        const j = next() % (i + 1);
        [types[i], types[j]] = [types[j], types[i]];
      }

      const pool = [...voterIds];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = next() % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      pool.slice(0, Math.min(total, pool.length)).forEach((userId, index) => {
        const daysAgo = (next() % 45) + (artworkIndex % 3);
        insertVote.run(
          `vote_${artwork.slug}_${index}`,
          userId,
          `art_${artwork.slug}`,
          types[index % types.length],
          iso(daysAgo, 8 + (index % 12)),
        );
      });
    });

    // Comments -------------------------------------------------------------
    const commentSeed: Array<[string, string, string, number]> = [
      ["mona-lisa", "noor", "Пришёл ради улыбки, остался ради трещин на доске.", 1],
      ["mona-lisa", "elio", "Лак уже почти вторая картина.", 2],
      ["black-square", "dmitri", "Это не картина ничего. Это картина конца картин.", 1],
      ["black-square", "theo", "Хочу верить. Сегодня — нет.", 2],
      ["black-square", "zara", "Стоять перед ней — совсем другой опыт, чем смотреть с экрана.", 3],
      ["fountain", "omar", "Вопрос и есть произведение. Писсуар — просто знак вопроса.", 1],
      ["fountain", "mira", "Я голосовала «нет», а потом дважды передумала, пока читала это.", 2],
      ["le-gras", "ines", "Размыто, странно и абсолютно основополагающе.", 1],
      ["le-gras", "ben", "Похоже на воспоминание о фотографии.", 2],
      ["demo-synthetic-garden", "jae", "Машина сделала текстуру. Но кто-то всё равно выбрал рамку.", 1],
      ["demo-synthetic-garden", "lena", "Я бы это повесила, и сама удивляюсь.", 2],
      ["great-wave", "tomo", "Негативное пространство работает больше, чем волна.", 1],
      ["great-wave", "aiko", "Каждая репродукция меняет синий цвет.", 2],
      ["mondrian-1930", "oskar", "Линии — это решения, а не измерения.", 1],
      ["the-kiss", "clara", "Золото как способ остановить время.", 1],
      ["demo-question-repeated", "ada", "Работа о табличке, которую она получит.", 1],
      ["the-scream", "freya", "Небо здесь звучит громче всего.", 1],
      ["armory-show-1913", "marco", "Зал, который изменил представление американских зрителей о том, чем должно быть искусство.", 1],
    ];
    const insertComment = db.prepare(
      "INSERT INTO comments (id, user_id, artwork_id, content, is_hidden, created_at) VALUES (?, ?, ?, ?, 0, ?)",
    );
    commentSeed.forEach(([slug, username, content, daysAgo], index) => {
      insertComment.run(
        `cmt_${index}`,
        `usr_${username}`,
        `art_${slug}`,
        content,
        iso(daysAgo, 10 + (index % 10)),
      );
    });

    // Likes ----------------------------------------------------------------
    const insertLike = db.prepare(
      "INSERT OR IGNORE INTO likes (id, user_id, artwork_id, created_at) VALUES (?, ?, ?, ?)",
    );
    const likePairs = [
      ["mira", "black-square"],
      ["jonas", "black-square"],
      ["aiko", "great-wave"],
      ["noor", "the-kiss"],
      ["elio", "mona-lisa"],
      ["sana", "fountain"],
      ["theo", "mondrian-1930"],
      ["ines", "le-gras"],
      ["dmitri", "black-square"],
      ["lucia", "composition-vii"],
      ["kwame", "the-thinker"],
      ["freya", "starry-night"],
      ["omar", "fountain"],
      ["yuki", "the-scream"],
      ["marco", "garden-of-earthly-delights"],
      ["zara", "demo-question-repeated"],
      ["hugo", "the-steerage"],
      ["nadia", "demo-suspended-field"],
      ["sam", "fountain"],
      ["lena", "demo-chromatic-study"],
    ] as const;
    likePairs.forEach(([username, slug], index) => {
      insertLike.run(
        `like_${index}`,
        `usr_${username}`,
        `art_${slug}`,
        iso(index % 12, 9 + (index % 8)),
      );
    });

    // Follows --------------------------------------------------------------
    const insertFollow = db.prepare(
      "INSERT OR IGNORE INTO follows (id, follower_id, following_id, created_at) VALUES (?, ?, ?, ?)",
    );
    const followPairs = [
      ["jonas", "mira"],
      ["aiko", "mira"],
      ["noor", "mira"],
      ["sana", "mira"],
      ["theo", "mira"],
      ["mira", "jonas"],
      ["mira", "aiko"],
      ["ines", "theo"],
      ["lucia", "dmitri"],
      ["zara", "mira"],
      ["jae", "mira"],
      ["lena", "mira"],
    ] as const;
    followPairs.forEach(([follower, following], index) => {
      insertFollow.run(
        `follow_${index}`,
        `usr_${follower}`,
        `usr_${following}`,
        iso(index + 2, 11),
      );
    });

    // Daily challenge completions (demo) -----------------------------------
    const insertCompletion = db.prepare(
      "INSERT OR IGNORE INTO daily_completions (id, user_id, challenge_date, created_at) VALUES (?, ?, ?, ?)",
    );
    const today = new Date();
    demoUsers.forEach(([username], index) => {
      const count = (hash32(`daily:${username}`) % 4);
      for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setUTCDate(d.getUTCDate() - i);
        insertCompletion.run(
          `dc_${username}_${i}`,
          `usr_${username}`,
          d.toISOString().slice(0, 10),
          d.toISOString(),
        );
      }
    });

    // Streaks --------------------------------------------------------------
    const updateUserStreak = db.prepare(
      "UPDATE users SET streak = ?, longest_streak = ?, last_vote_date = ? WHERE id = ?",
    );
    demoUsers.forEach(([username], index) => {
      const streak = 1 + (hash32(`streak:${username}`) % 11);
      const last = new Date(today);
      last.setUTCDate(last.getUTCDate() - (index % 2));
      updateUserStreak.run(
        streak,
        streak + (hash32(`longest:${username}`) % 5),
        last.toISOString().slice(0, 10),
        `usr_${username}`,
      );
    });

    // Points + achievements ------------------------------------------------
    const allUsers = db
      .prepare("SELECT id, username FROM users WHERE is_demo = 1 OR id = 'usr_demo'")
      .all() as Array<{
      id: string;
      username: string;
    }>;

    const voteCountStmt = db.prepare(
      "SELECT COUNT(*) AS count FROM votes WHERE user_id = ?",
    );
    const categoryCountStmt = db.prepare(
      `SELECT COUNT(DISTINCT a.category) AS count
       FROM votes v JOIN artworks a ON a.id = v.artwork_id
       WHERE v.user_id = ?`,
    );
    const insertUA = db.prepare(
      "INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id, created_at) VALUES (?, ?, ?, ?)",
    );
    const completionCountStmt = db.prepare(
      "SELECT COUNT(*) AS count FROM daily_completions WHERE user_id = ?",
    );

    const provisional: Array<{ id: string; username: string; points: number; votes: number }> = [];

    allUsers.forEach((user) => {
      const votes = (voteCountStmt.get(user.id) as { count: number }).count;
      const categories = (categoryCountStmt.get(user.id) as { count: number }).count;
      const completions = (completionCountStmt.get(user.id) as { count: number }).count;
      const streak = (db.prepare("SELECT streak FROM users WHERE id = ?").get(user.id) as { streak: number }).streak;
      const earned: string[] = [];
      if (votes >= 1) earned.push("first-vote");
      if (votes >= 10) earned.push("ten-votes");
      if (votes >= 50 && categories >= 5) earned.push("fifty-votes");
      if (votes >= 100) earned.push("hundred-votes");
      if (streak >= 3) earned.push("streak-3");
      if (streak >= 7) earned.push("streak-7");
      earned.forEach((achievementId, index) => {
        insertUA.run(
          `ua_${user.username}_${achievementId}`,
          user.id,
          achievementId,
          iso(index + 1, 12),
        );
      });
      const points = votes * POINTS.vote + completions * POINTS.dailyChallenge + earned.length * POINTS.achievement;
      provisional.push({ ...user, points, votes });
    });

    provisional.sort((a, b) => b.points - a.points);
    const topCount = Math.max(1, Math.ceil(provisional.length * 0.1));
    provisional.slice(0, topCount).forEach((user) => {
      if (user.votes >= 20) {
        insertUA.run(`ua_${user.username}_top-10`, user.id, "top-10", iso(1, 13));
        user.points += POINTS.achievement;
      }
    });

    const setPoints = db.prepare("UPDATE users SET points = ? WHERE id = ?");
    provisional.forEach((user) => setPoints.run(user.points, user.id));

    // Reports --------------------------------------------------------------
    const insertReport = db.prepare(
      "INSERT INTO reports (id, user_id, artwork_id, reason, details, status, created_at) VALUES (?, ?, ?, ?, ?, 'open', ?)",
    );
    insertReport.run(
      "rpt_seed_1",
      "usr_theo",
      "art_fountain",
      "Вводящая в заблуждение информация",
      "В записи не указано, что оригинал утрачен. Фотография — не само произведение.",
      iso(1, 9),
    );
    insertReport.run(
      "rpt_seed_2",
      "usr_omar",
      "art_demo-synthetic-garden",
      "Проблема с авторскими правами или принадлежностью",
      "Это помечено как демо-контент с поддержкой ИИ. Пожалуйста, проверьте, что метка видна везде.",
      iso(2, 15),
    );

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function createDatabase(): Db {
  const dir = dataDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, "uploads"), { recursive: true });
  const db = new DatabaseSync(path.join(dir, "is-this-art.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  seedIfEmpty(db);
  return db;
}

const globalForDb = globalThis as unknown as { __isThisArtDb?: Db };

export function getDb(): Db {
  if (!globalForDb.__isThisArtDb) {
    globalForDb.__isThisArtDb = createDatabase();
  }
  return globalForDb.__isThisArtDb;
}

export function queryAll<T>(sql: string, ...params: SqlValue[]): T[] {
  // node:sqlite returns null-prototype rows. Copy them into plain objects so
  // they can safely cross the Server Component -> Client Component boundary.
  return (getDb().prepare(sql).all(...params) as unknown as Record<string, unknown>[]).map(
    (row) => ({ ...row }) as T,
  );
}

export function queryOne<T>(sql: string, ...params: SqlValue[]): T | null {
  const row = getDb().prepare(sql).get(...params) as Record<string, unknown> | undefined;
  return row ? ({ ...row } as T) : null;
}

export function execute(sql: string, ...params: SqlValue[]) {
  return getDb().prepare(sql).run(...params);
}

export function transaction<T>(fn: (db: Db) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn(db);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function newId(prefix = ""): string {
  return `${prefix}${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmac(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}
